import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import cartRepository from './cartRepository';

const add: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { productId, quantity } = req.body;

    await cartRepository.add(userId, productId, quantity);

    const cart = await cartRepository.findByUserId(userId);

    res.status(StatusCodes.CREATED).json(cart);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Identifiant doit être un nombre' });
      return;
    }
    const cart = await cartRepository.findByUserId(userId);

    if (cart == null) {
      res.status(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).json(cart);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const updatedCart = {
      userId: Number(req.params.userId),
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity),
    };

    await cartRepository.update(
      updatedCart.userId,
      updatedCart.productId,
      updatedCart.quantity,
    );

    res.status(StatusCodes.OK).json(updatedCart);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const deletedCart = {
      productId: Number(req.params.productId),
      userId: Number(req.params.userId),
    };

    await cartRepository.delete(deletedCart.userId, deletedCart.productId);

    res.status(StatusCodes.OK).json(deletedCart);
  } catch (err) {
    next(err);
  }
};

const validate: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.body.productId);

    if (Number.isNaN(userId) || Number.isNaN(productId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Paramétres invalides' });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default { add, read, edit, destroy, validate };
