// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { surfClient } from '../../../lib/surfClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'POST':
      const authRes = await surfClient.authenticate(req, res, {
        authSig: req.body.authSig,
      });
      res.status(200).json(authRes);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
