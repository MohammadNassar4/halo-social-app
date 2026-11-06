import * as z from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Please enter your current password")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain at least one number, capital letter and small letter and a special character (#?!@$%^&*-)",
      ),
    newPassword: z
      .string()
      .nonempty("Please enter your new password")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must contain at least one number, capital letter and small letter and a special character (#?!@$%^&*-)",
      ),
    rePassword: z.string().nonempty("Please confirm your password"),
  })
  .refine(
    (obj) => {
      return obj.password !== obj.newPassword;
    },
    {
      path: ["newPassword"],
      message: "New password must be different from the current one",
    },
  )
  .refine(
    (obj) => {
      return obj.newPassword === obj.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Passwords doesn't match",
    },
  );
