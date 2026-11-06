import * as z from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .nonempty("Please enter your email")
      .email("Invalid email"),
    password: z
      .string()
      .nonempty("Please enter your password")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain at least one number, capital letter and small letter and a special character (#?!@$%^&*-)",
      )
  })
