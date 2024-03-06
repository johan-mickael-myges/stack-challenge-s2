import { Request, Response } from 'express';

export const helloWorldRoute = (req: Request, res: Response): void => {
  res.send('Hello, World!');
};