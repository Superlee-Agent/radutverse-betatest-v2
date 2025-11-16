import serverless from "serverless-http";

import { createServer } from "../../server/index.js";

let serverlessHandler: any = null;

export const handler = async (event: any, context: any) => {
  if (!serverlessHandler) {
    const app = await createServer();
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};
