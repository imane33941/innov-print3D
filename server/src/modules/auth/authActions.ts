import argon2 from 'argon2';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import userRepository from '../user/userRepository';

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await argon2.hash(password, hashingOptions);

    req.body.hashed_password = hashedPassword;

    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email et mot de passe sont obligatoires' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Format invalide' });
    }

    const user = await userRepository.findByEmail(email);

    if (user == null) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ message: 'utilisateur introuvable' });
      return;
    }
    const verified = await argon2.verify(user.hashed_password, password);
    if (verified) {
      const { hashed_password, ...userWithoutHashedPassword } = user;

      const myPayload: MyPayload = {
        sub: user.id.toString(),
        role: user.role,
      };
      const token = await jwt.sign(
        myPayload,
        process.env.APP_SECRET as string,
        {
          expiresIn: '1h',
        },
      );
      res.json({
        token,
        user: userWithoutHashedPassword,
      });
    } else {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ message: 'Mot de passe incorrect' });
    }
  } catch (err) {
    next(err);
  }
};

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');

    if (authorizationHeader == null) {
      throw new Error('Token manquant');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new Error('Type token invalide');
    }

    req.auth = jwt.verify(token, process.env.APP_SECRET as string) as MyPayload;

    next();
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token invalide ou manquant' });
  }
};

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.auth.role === 'admin') {
    return next();
  }
  res
    .status(StatusCodes.FORBIDDEN)
    .json({ message: "Accès interdit, réservé uniquement à l'admin" });
  return;
};

export default { hashPassword, login, verifyToken, isAdmin };
