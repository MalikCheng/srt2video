import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const getClient = () => {
    let localEnv = {};
    if (process.env.NODE_ENV !== 'production') {
        try {
            const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env.local');
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                const key = parts[0]?.trim();
                if (key && !key.startsWith('#') && parts.length > 1) {
                    localEnv[key] = parts.slice(1).join('=').trim();
                }
            });
        } catch (e) { }
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || localEnv.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment.");
    }
    return new GoogleGenAI({ apiKey });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitError = (error) => {
    if (!error) return false;
    if (error.status === 429 || error.code === 429) return true;
    if (error.error) {
        if (error.error.code === 429) return true;
        if (error.error.status === 'RESOURCE_EXHAUSTED') return true;
    }
    const msg = (error.message || JSON.stringify(error) || '').toLowerCase();
    return msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('resource_exhausted');
};

export function setupApiRoutes(app) {
    app.post('/api/analyze-images', async (req, res) => {
        try {
            const { base64Images } = req.body;
            if (!base64Images || base64Images.length === 0) {
                return res.json([]);
            }

            const ai = getClient();
            const model = "gemini-3-flash-preview";

            const prompt = `
          Analyze these images and identify the specific MAIN ENTITY in each one.
          Return a JSON array of strings, where each string describes the entity at that index.
          
          Example Output: ["The book 'Principles' by Ray Dalio", "A bottle of Chanel No.5 perfume"]
          
          Be specific. If it is a book, mention the title and author on the cover. If it is a product, mention the brand.
      `;

            const parts = [{ text: prompt }];

            base64Images.forEach(img => {
                const base64Data = img.split(',')[1];
                const mimeType = img.split(';')[0].split(':')[1] || 'image/png';
                parts.push({
                    inlineData: { mimeType, data: base64Data }
                });
            });

            const response = await ai.models.generateContent({
                model,
                contents: { parts },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });

            const descriptions = JSON.parse(response.text || "[]");
            res.json(descriptions);
        } catch (e) {
            console.warn("Failed to analyze reference images:", e);
            // Fallback
            const base64Images = req.body.base64Images || [];
            res.json(base64Images.map((_, i) => `Reference Image ${i}`));
        }
    });

    app.post('/api/generate-storyboard', async (req, res) => {
        try {
            const { subtitles, style, referenceImageDescriptions = [] } = req.body;
            const ai = getClient();

            const maxSrtEndTime = subtitles.reduce((max, sub) => Math.max(max, sub.endSeconds), 0);

            let strategySection = '';
            if (style.id === 'oil_painting') {
                strategySection = "### STRATEGY: Healing/Therapeutic. Slow pacing, back views, nature focus.";
            } else {
                strategySection = "### STRATEGY: Viral/TikTok. Fast pacing, hook at start.";
            }

            const refAssetsContext = referenceImageDescriptions.map((desc, i) =>
                `Index ${i}: ${desc}`
            ).join('\\n    ');

            const systemInstruction = `
        You are a world-class Short Video Creative Director. 
        Your goal is to transform a subtitle script into a visual storyboard matching the style: "${style.name}" (${style.description}).

        ### 1. UNIFIED VISUAL CONSISTENCY (HIGHEST PRIORITY):
        *   **Consistent Environment**: Establish a SINGLE, cohesive setting. Do not jump between wildly different locations unless the script explicitly demands it.
        *   **Consistent Lighting**: Maintain the same time of day and lighting conditions across ALL segments.
        *   **Consistent Palette**: Use the prompt to enforce a specific color palette defined by the style "${style.name}".
        *   **Recurring Characters**: If a character appears, describe them EXACTLY the same way in every visual_prompt.

        ### 2. TEMPORAL & SOCIAL CONTEXT:
        *   **DETECT ERA**: Analyze the script for time cues.
        *   **MODERN CHINA CONTEXT**: If the script implies Chinese context, use modern visuals (Glass Skyscrapers, High-Speed Trains). FORBIDDEN: 1990s visuals unless specified.
        *   **OUTPUT RULE**: In \`visual_prompt\`, explicitly state the era AND the consistent lighting/setting in EVERY segment.

        ### 3. REFERENCE ASSETS:
        You have access to the following specific uploaded assets:
        ${refAssetsContext}

        **INTELLIGENT ENTITY MATCHING RULES:**
        *   **Strict Semantic Matching**: Only assign a \`reference_image_index\` if the subtitle text refers to the *specific physical entity* described.
        *   **Avoid Ambiguity**: If the scene is abstract, set \`reference_image_index\` to -1.

        ### 4. VISUAL STYLE:
        *   Match the style description: ${style.description}
        
        ${strategySection}

        ### JSON OUTPUT INSTRUCTIONS:
        Generate a \`visual_prompt\` like a Midjourney prompt.
        Field \`reference_image_index\`: Integer. The index of the uploaded image to use (0 to ${Math.max(0, referenceImageDescriptions.length - 1)}). Set to -1 if no reference needed.
      `;

            const simpleSubs = subtitles.map(s => ({
                id: s.id,
                time: `${s.startTime} --> ${s.endTime}`,
                text: s.text
            }));

            const prompt = `
        SRT content:
        ${JSON.stringify(simpleSubs)}
        
        Reference Images Available: ${referenceImageDescriptions.length}

        Generate JSON storyboard for the ENTIRE script. Ensure VISUAL CONSISTENCY across all frames.
      `;

            let lastError = null;
            for (let attempt = 0; attempt < 5; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: "gemini-3-flash-preview",
                        contents: prompt,
                        config: {
                            systemInstruction: systemInstruction,
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        subtitle_ids: {
                                            type: Type.ARRAY,
                                            items: { type: Type.STRING }
                                        },
                                        visual_prompt: { type: Type.STRING, description: "Detailed visual prompt. MUST repeat the core setting/lighting keywords for consistency." },
                                        reference_image_index: { type: Type.INTEGER, description: "Index of reference image to use (0-N), or -1 if none." },
                                        camera_movement: {
                                            type: Type.STRING,
                                            enum: ["Zoom In", "Zoom Out", "Pan Right", "Pan Left", "Static"]
                                        },
                                        viral_reasoning: { type: Type.STRING },
                                        tactic: {
                                            type: Type.STRING
                                        }
                                    },
                                    required: ["subtitle_ids", "visual_prompt", "camera_movement", "viral_reasoning", "tactic"]
                                }
                            }
                        }
                    });

                    const jsonStr = response.text || "[]";
                    const rawSegments = JSON.parse(jsonStr);

                    const hydratedSegments = rawSegments.map((seg) => {
                        const relevantSubs = subtitles.filter(s => seg.subtitle_ids?.includes(s.id));
                        if (!relevantSubs.length) return null;
                        relevantSubs.sort((a, b) => a.startSeconds - b.startSeconds);

                        let refIdx = seg.reference_image_index;
                        if (typeof refIdx !== 'number' || refIdx < 0 || refIdx >= referenceImageDescriptions.length) {
                            refIdx = undefined;
                        }

                        return {
                            ...seg,
                            startTime: relevantSubs[0].startSeconds,
                            endTime: relevantSubs[relevantSubs.length - 1].endSeconds,
                            text: relevantSubs.map(s => s.text).join(' '),
                            reference_image_index: refIdx
                        };
                    }).filter(Boolean);

                    hydratedSegments.sort((a, b) => a.startTime - b.startTime);

                    let currentTime = 0;
                    const finalSegments = hydratedSegments.map((seg, index) => {
                        let segmentEnd = seg.endTime;
                        if (index < hydratedSegments.length - 1) {
                            const nextStart = hydratedSegments[index + 1].startTime;
                            if (nextStart > segmentEnd) segmentEnd = nextStart;
                        } else {
                            if (segmentEnd < maxSrtEndTime) segmentEnd = maxSrtEndTime;
                        }

                        const duration = Math.max(0.1, segmentEnd - currentTime);
                        const finalSegment = {
                            id: `seg-${index}-${Date.now()}`,
                            status: 'IDLE',
                            text: seg.text,
                            duration: duration,
                            visual_prompt: `${seg.visual_prompt}`,
                            camera_movement: seg.camera_movement,
                            viral_reasoning: seg.viral_reasoning,
                            tactic: seg.tactic,
                            reference_image_index: seg.reference_image_index
                        };
                        currentTime = segmentEnd;
                        return finalSegment;
                    });

                    return res.json(finalSegments);

                } catch (error) {
                    lastError = error;
                    if (isRateLimitError(error)) {
                        const waitTime = (Math.pow(2, attempt) * 2000) + 1000;
                        console.warn(`Storyboard generation rate limited. Retrying in ${waitTime}ms...`);
                        await delay(waitTime);
                        continue;
                    }
                    throw error;
                }
            }
            throw lastError;
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message || 'Failed to generate storyboard' });
        }
    });

    app.post('/api/refine-prompt', async (req, res) => {
        try {
            const { currentPrompt, style } = req.body;
            const ai = getClient();
            const prompt = `Refine this prompt for style "${style.name}". Ensure it matches the consistent atmosphere of: ${style.description}. Prompt: "${currentPrompt}". Remove AI feel. Return only prompt.`;
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });
            res.json({ prompt: response.text?.trim() || currentPrompt });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message || 'Failed to refine prompt' });
        }
    });

    app.post('/api/generate-image', async (req, res) => {
        try {
            const { segment, aspectRatio, referenceImages = [], seed } = req.body;
            const ai = getClient();
            const modelName = 'gemini-3-pro-image-preview';

            const maxRetries = 8;
            const antiAiPositive = "cinematic lighting, high fidelity, distinct consistent artstyle, masterful composition, 8k resolution, highly detailed";
            const negativeConstraints = "Exclude: blurry, low quality, distorted, bad anatomy, ugly, disfigured, watermark, text, subtitles, ui, signature, jpeg artifacts, cartoon (unless specified), anime (unless specified), cgi (unless specified), inconsistent lighting, messy background.";

            const contentParts = [];
            const refIndex = segment.reference_image_index;
            const specificRefImage = (refIndex !== undefined && refIndex >= 0 && refIndex < referenceImages.length)
                ? referenceImages[refIndex]
                : null;

            if (specificRefImage) {
                const base64Data = specificRefImage.split(',')[1];
                const mimeType = specificRefImage.split(';')[0].split(':')[1] || 'image/png';
                contentParts.push({
                    inlineData: { mimeType, data: base64Data }
                });
            }

            let finalPrompt = `${segment.visual_prompt}. ${antiAiPositive}. Aspect ratio ${aspectRatio}. ${negativeConstraints}`;
            if (specificRefImage) {
                finalPrompt = `[IMPORTANT: Integrate the object from the provided image naturally into this scene, maintaining the scene's lighting and style]. ${finalPrompt}`;
            }

            contentParts.push({ text: finalPrompt });

            let lastError = null;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: modelName,
                        contents: { parts: contentParts },
                        config: {
                            imageConfig: { aspectRatio: aspectRatio, imageSize: '1K' },
                            seed: seed,
                            safetySettings: [
                                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                            ]
                        }
                    });

                    if (response.candidates?.[0]?.content?.parts) {
                        for (const part of response.candidates[0].content.parts) {
                            if (part.inlineData && part.inlineData.data) {
                                const mimeType = part.inlineData.mimeType || 'image/png';
                                return res.json({ uri: `data:${mimeType};base64,${part.inlineData.data}` });
                            }
                        }
                    }
                    throw new Error("No image data found");
                } catch (error) {
                    lastError = error;
                    if (isRateLimitError(error)) {
                        const waitTime = (Math.pow(2, attempt) * 2000) + (Math.random() * 1000);
                        await delay(waitTime);
                        continue;
                    }
                    if (error.message && error.message.includes("404")) throw error;
                    await delay(2000);
                }
            }
            throw lastError || new Error("Image generation failed");
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message || 'Failed to generate image' });
        }
    });
}
