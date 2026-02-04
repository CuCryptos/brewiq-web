import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  content: z.string().min(10, "Review must be at least 10 characters").max(2000, "Review must be at most 2000 characters"),
  flavorTags: z.array(z.string()).optional(),
});

export const sightingSchema = z.object({
  beerId: z.string().min(1, "Beer is required"),
  locationName: z.string().min(1, "Location name is required"),
  latitude: z.number(),
  longitude: z.number(),
  format: z.enum(["draft", "can", "bottle", "crowler", "growler"]),
  price: z.number().optional(),
  notes: z.string().max(500).optional(),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(100),
  style: z.string().min(1, "Style is required"),
  description: z.string().max(2000).optional(),
  batchSize: z.number().positive("Batch size must be positive"),
  batchSizeUnit: z.enum(["gallons", "liters"]),
  fermentables: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.enum(["lb", "kg", "oz", "g"]),
    })
  ),
  hops: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.enum(["oz", "g"]),
      timing: z.number(),
      use: z.enum(["boil", "dry_hop", "whirlpool"]),
    })
  ),
  yeast: z.object({
    name: z.string(),
    amount: z.number().optional(),
  }),
  isPublic: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SightingInput = z.infer<typeof sightingSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;
