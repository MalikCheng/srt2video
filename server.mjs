import { createServer } from 'vite';
import { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const server = await createServer({
    root: resolve(__dirname, './'),
    plugins: [
      require('vike/plugin')({
        prerender: {
          enabled: true,
        }
      })
    ],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    }
  });

  await server.listen();
  
  console.log('SSR Server running at http://localhost:3000');
}

createServer();
