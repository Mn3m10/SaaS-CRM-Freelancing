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

const getToday = () => new Date().toISOString().split("T")[0];
export const invoiceValidationSchema = Yup.object({
  invoiceNumber: Yup.string()
    .trim()
    .min(3, "Invoice number must be at least 3 characters.")
    .max(30, "Invoice number cannot be longer than 30 characters.")
    .required("Invoice number is required."),

  clientId: Yup.string().required("Please select a client."),

  projectId: Yup.string().required("Please select a project."),

  amount: Yup.number()
    .typeError("Amount must be a number.")
    .positive("Amount must be greater than zero.")
    .required("Invoice amount is required."),

  dueDate: Yup.date()
    .min(getToday(), "Due date cannot be in the past.")
    .required("Please select a due date."),
});

export const projectValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(5, "Project title must be at least 5 characters.")
    .max(50, "Project title cannot be longer than 50 characters.")
    .required("Project title is required."),

  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(100, "Description cannot be longer than 100 characters.")
    .required("Description is required."),

  deadline: Yup.date()
    .nullable()
    .test("is-future", "Deadline must be a future date", function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),

  client: Yup.string().required("Please select a client."),
});
