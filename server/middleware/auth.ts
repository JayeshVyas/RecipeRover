import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // For demo purposes, return the first user
    const users = await storage.getUser("123"); // This would come from session
    if (!users) {
      const allUsers = Array.from((storage as any).users.values());
      req.user = allUsers[0] || null;
    } else {
      req.user = users;
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication failed" });
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