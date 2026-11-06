import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Please enter your name")
      .min(3, "Name must be at least 3 letters")
      .max(20, "Name must be under 20 letters"),
    username: z
      .string()
      .nonempty("Please enter your username")
      .min(3, "Username must be at least 3 letters")
      .max(20, "Username must be under 21 letter")
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
        "Username must start with a letter and consist of letter, digits, - and _ ",
      ),
    email: z
      .string()
      .nonempty("Please enter your email")
      .email("Invalid email"),
    password: z
      .string()
      .nonempty("Please enter a password")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain at least one number, capital letter and small letter and a special character (#?!@$%^&*-)",
      ),
    gender: z.string().nonempty("Please chose your gender"),
    dateOfBirth: z.string().refine((dateValue:string) => {
      const currentYear = new Date().getFullYear();
      const year = +dateValue.slice(0, 4);
      const age: number = currentYear - year;
      return age > 17;
    }, "Age must be at least 18").nonempty("Please enter your date of birth"),
    rePassword: z.string().nonempty("Please confirm your password"),
  })
  .refine(
    (obj) => {
      return obj.password === obj.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Must match the password",
    },
  );
