import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { success, failed } from "../../assets/utils/Toasts";
import {
  FiChevronRight,
  FiUserPlus,
} from "react-icons/fi";
import "./Clients.css";
import { clientValidationSchema } from "../../assets/utils/Validations";
import { AddClientForm } from "../../components/LayoutForms";

const AddClient = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },

    validationSchema: clientValidationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
          failed("Please login to add a client");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        if (!userData) {
          failed("User data not found. Please login again.");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);

        if (!user._id) {
          failed("Invalid user data. Please login again.");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        const clientData = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          notes: values.notes.trim(),
        };

        const response = await fetch("http://localhost:5000/api/v1/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientData),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (data.message?.toLowerCase().includes("email")) {
              setFieldError("email", "This email already belongs to a client.");
              failed("This email already belongs to a client.");
            } else if (data.message?.toLowerCase().includes("validation")) {
              if (data.errors) {
                Object.keys(data.errors).forEach((field) => {
                  setFieldError(field, data.errors[field]);
                });
              }
              failed(
                data.message || "Validation failed. Please check your input.",
              );
            } else {
              failed(
                data.message || "Failed to create client. Please try again.",
              );
            }
          } else if (response.status === 401) {
            failed("Session expired. Please login again.");
            navigate("/login");
          } else if (response.status === 403) {
            failed("You don't have permission to add clients.");
          } else {
            failed(
              data.message || "Failed to create client. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Client added successfully.");
        setSubmitting(false);
        navigate("/layout/clients");
      } catch (error) {
        console.error("Error creating client:", error);
        failed(error.message || "Failed to create client. Please try again.");
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-client-page">
      <div className="container">
        <div className="client-breadcrumb">
          <button type="button" onClick={() => navigate("/layout/clients")}>
            Clients
          </button>

          <FiChevronRight />
          <span>Add Client</span>
        </div>

        <div className="add-client-page__header">
          <div>
            <p className="clients-page__eyebrow">CRM Workspace</p>
            <h1>Add New Client</h1>
            <p>
              Create a client profile and keep their contact information in one
              place.
            </p>
          </div>

          <div className="add-client-page__icon">
            <FiUserPlus />
          </div>
        </div>

        <AddClientForm formik={formik} getFieldError={getFieldError}/>

      </div>
    </section>
  );
};

export default AddClient;
