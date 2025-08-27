import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Route error:", err);
  
  if (err.message.includes('validation')) {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.message.includes('not found')) {
    return res.status(404).json({ message: err.message });
  }
  
  res.status(500).json({ message: "Internal server error" });
}