// pages/api/auth/login.ts
import { SurfClient } from "@surfdb/client-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { serverRuntimeConfig } = getConfig();
  const { surfClient }: { surfClient: SurfClient } = serverRuntimeConfig;
  switch (method) {
    case "POST":
      res.status(200).json((await surfClient.create("test", req.body)).data);
      break;
    case "GET":
      res.status(200).json(((await surfClient.getAll("test")) as any).data);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
