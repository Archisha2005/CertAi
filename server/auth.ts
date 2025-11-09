// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";

const scryptAsync = promisify(scrypt);

// simple password helpers
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  try {
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch {
    return false;
  }
}

/**
 * Call this to wire up passport + session middleware and auth routes.
 */
export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "e-certificate-portal-secret",
    resave: false,
    saveUninitialized: false,
    // storage.sessionStore may be present on your DB-backed storage; fallback to in-memory store if not.
    store: (storage as any).sessionStore ?? new session.MemoryStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) return done(null, false, { message: "User not found" });
        if (!user.password) return done(null, false, { message: "No password stored" });

        const ok = await comparePasswords(password, user.password);
        if (!ok) return done(null, false, { message: "Invalid password" });
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user ?? false);
    } catch (err) {
      done(err as Error);
    }
  });

  // register basic register/login/logout endpoints used by client
  app.post("/api/register", async (req, res, next) => {
    try {
      // defensive defaults so we always pass the required fields to storage.createUser
      const {
        username,
        password,
        email = "",
        mobile = "",
        fullName = "",
        aadhaar = "",
        address = "",
      } = req.body as {
        username?: string;
        password?: string;
        email?: string;
        mobile?: string;
        fullName?: string;
        aadhaar?: string;
        address?: string;
      };

      if (!username || !password) {
        return res.status(400).json({ message: "username & password required" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) return res.status(400).json({ message: "username exists" });

      const hashed = await hashPassword(password);

      // IMPORTANT: include aadhaar and address (schema requires them). If not provided by client,
      // supply empty strings so DB insert satisfies NOT NULL constraints (alternatively make them optional
      // in schema if you prefer).
      const newUser = await storage.createUser({
        username,
        password: hashed,
        email,
        mobile,
        fullName,
        aadhaar,
        address,
      } as any); // cast to any if your InsertUser typing differs slightly

      req.login(newUser, (err) => {
        if (err) return next(err);
        const { password: _, ...safe } = newUser as any;
        res.status(201).json(safe);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    const { password: _, ...safe } = user ?? {};
    res.json(safe);
  });

  app.post("/api/logout", (req, res, next) => {
    // passport's logout may be sync or async depending on version; keep callback to be safe.
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) return res.sendStatus(401);
    const { password: _, ...safe } = (req.user as any) ?? {};
    res.json(safe);
  });
}
