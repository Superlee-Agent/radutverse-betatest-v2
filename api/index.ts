import { createServer } from "../server/index.js";

let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = createServer();
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  // Get or create the Express app (cached)
  const app = await getApp();
  // Pass the request directly to Express. This works with Vercel Node functions.
  return app(req, res);
}
