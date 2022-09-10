// pages/api/auth/login.ts
import { SurfClient } from '@surfdb/client-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { serverRuntimeConfig } = getConfig();
  const { surfClient }: { surfClient: SurfClient } = serverRuntimeConfig;
  switch (method) {
    case 'POST':
      await surfClient.authenticate(req.body.authSig);
      res.status(200).json('ok');
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
