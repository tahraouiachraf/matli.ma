import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nom requis"),
  role: z.enum(["tenant", "owner"]),
});
