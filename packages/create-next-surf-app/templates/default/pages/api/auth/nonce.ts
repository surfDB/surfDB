/* eslint-disable no-case-declarations */
// pages/api/auth/nonce.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { surfClient } from '../../../lib/surfClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'GET':
      const nonce = await surfClient.getAuthNonce(req, res);
      return res.status(200).json(nonce);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
