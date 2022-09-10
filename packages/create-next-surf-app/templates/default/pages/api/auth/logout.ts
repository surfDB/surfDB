/* eslint-disable no-case-declarations */
// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { surfClient } from '../../../lib/surfClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'POST':
      const resp = await surfClient.logout(req, res);
      return res.status(200).json(resp);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
