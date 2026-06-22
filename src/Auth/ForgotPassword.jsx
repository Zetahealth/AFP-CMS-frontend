import { useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api/Api";
import logo from "../../public/logo4.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  //   const handleForgotPassword = async (e) => {
  //     e.preventDefault();

  //     setLoading(true);
  //     setError("");

  //     try {
  //       const response = await fetch(
  //         `${Api}/users/password`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //           body: JSON.stringify({
  //             user: { email },
  //           }),
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorData = await response.json();

  //         setError(
  //           errorData.error ||
  //             "Failed to send reset password link"
  //         );

  //         setLoading(false);
  //         return;
  //       }

  //       setSuccess(true);

  //     } catch (err) {
  //       console.error(err);

  //       setError(
  //         "Something went wrong. Please try again."
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${Api}/users/password`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      console.log("Forgot Password Response:", data);

      if (!response.ok) {
        setError(
          data.error ||
          data.message ||
          "Failed to send reset password link"
        );

        return;
      }

      setSuccess(true);

    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-8 w-96">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="App Logo"
            className="h-28 w-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email to receive a password reset link
        </p>

        {success ? (
          <div className="text-center">

            <p className="text-green-600 mb-4">
              Reset password instructions have been sent to your email.
            </p>

            {/* <Link
              to="/"
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </Link> */}

          </div>
        ) : (
          <form
            onSubmit={handleForgotPassword}
            className="flex flex-col gap-4"
          >

            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="border rounded-lg px-4 py-2"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>
        )}

        <p className="text-sm mt-6 text-center">
          Remember your password?{" "}
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}