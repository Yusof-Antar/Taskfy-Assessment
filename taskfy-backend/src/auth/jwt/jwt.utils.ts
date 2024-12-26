import { sign, verify } from 'jsonwebtoken';
import { User } from '@prisma/client';

export const generateToken = (user: User) => {
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_TOKEN,
    { expiresIn: '1h' },
  );
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, process.env.JWT_TOKEN);
  } catch (error) {
    throw new Error('Invalid or Expired Token');
  }
};
