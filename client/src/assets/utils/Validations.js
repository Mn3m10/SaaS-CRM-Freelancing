import * as Yup from "yup";

export const signupValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 chatacters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email formate")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must agree to the Terms of Service and Privacy Policy",
  ),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email formate")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
});

export const personalInfoSchema = Yup.object({
  name: Yup.string()
    .min(3, "At least 3 characters")
    .max(20, "At most 20 characters"),
  email: Yup.string().email("Invalid email format"),
  phone: Yup.string()
    .min(11, "At least 11 numbers")
    .max(11, "At most 11 numbers"),
});

export const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .required("New password is required"),

  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export const clientValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Client name must be at least 3 characters.")
    .max(15, "Client name cannot be longer than 15 characters.")
    .required("Client name is required."),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address.")
    .max(30, "Email cannot be longer than 30 characters.")
    .required("Email address is required."),

  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\-() ]*$/, "Please enter a valid phone number.")
    .max(25, "Phone number cannot be longer than 25 characters."),

  company: Yup.string()
    .trim()
    .max(40, "Company name cannot be longer than 40 characters."),

  notes: Yup.string()
    .trim()
    .max(1000, "Notes cannot be longer than 1000 characters."),
});
