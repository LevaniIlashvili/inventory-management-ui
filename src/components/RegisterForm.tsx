import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { register } from "../services/authService";
import useErrorHandler from "../hooks/useErrorHandler";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const { error, handleError, clearError } = useErrorHandler();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await register(data);
      alert("Registered successfully!");
      reset();
    } catch (err: any) {
      handleError(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border p-4 shadow-sm rounded bg-light"
      >
        <h2 className="mb-4 text-center">Register</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* First Name */}
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            {...formRegister("firstName")}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            {...formRegister("lastName")}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>

        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...formRegister("username")}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...formRegister("email")}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...formRegister("password")}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            {...formRegister("confirmPassword")}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}
