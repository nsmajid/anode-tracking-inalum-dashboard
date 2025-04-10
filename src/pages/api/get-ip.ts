import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // For production environments, use the X-Forwarded-For header to get the real IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  res.status(200).json({ ip })
}
