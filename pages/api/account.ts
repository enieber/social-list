import {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import bcrypt from 'bcrypt';

import prisma from '../../lib/prisma';

const saltRounds = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      email,
      name,
      password,
    } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({
        message: 'need params in request'
      });
    }
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  })
       return res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'method not allowed' })    
  }
}

