/* eslint-disable no-case-declarations */
// pages/api/auth/nonce.ts
import getConfig from 'next/config';
import { NextApiRequest, NextApiResponse } from 'next';
import { SurfClient } from '@surfdb/client-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { serverRuntimeConfig } = getConfig();
  const { surfClient }: { surfClient: SurfClient } = serverRuntimeConfig;
  switch (method) {
    case 'GET':
      const nonce = await surfClient.getAuthNonce();
      return res.status(200).json(nonce);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
