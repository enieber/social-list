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
      password,
    } = req.body
    if (!email || !password) {
      return res.status(400).json({
        message: 'need params in request'
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (user) {
      const metchPassword = await bcrypt.compare(password, user.password)
      if (metchPassword) {
      return res.status(200).json({
        token: 'new-token'
      });   
      
      }
    }
    return res.status(400).json({
      message: 'invalid email or password'
    })
  } else {
    res.status(405).json({ message: 'method not allowed' })    
  }
}

