import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api/Api";
import logo from "../../public/logo4.jpg";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // const handleResetPassword = async (e) => {
    //     e.preventDefault();

    //     setError("");

    //     if (password !== confirmPassword) {
    //         setError("Passwords do not match");
    //         return;
    //     }

    //     try {
    //         setLoading(true);

    //         // token usually comes from email link
    //         // example:
    //         // /reset-password?reset_password_token=xyz

    //         const params = new URLSearchParams(
    //             window.location.search
    //         );

    //         const resetPasswordToken =
    //             params.get("reset_password_token");

    //         //   const response = await fetch(
    //         //     `${Api}/users/password`,
    //         //     {
    //         //       method: "PUT",
    //         //       headers: {
    //         //         "Content-Type": "application/json",
    //         //         Accept: "application/json",
    //         //       },
    //         //       body: JSON.stringify({
    //         //         user: {
    //         //           reset_password_token:
    //         //             resetPasswordToken,
    //         //           password,
    //         //           password_confirmation:
    //         //             confirmPassword,
    //         //         },
    //         //       }),
    //         //     }
    //         //   );
    //         setLoading(true);

    //         setTimeout(() => {
    //             setLoading(false);

    //             alert("Password reset successful!");

    //             navigate("/");
    //         }, 1500);

    //         return;

    //         if (!response.ok) {
    //             const errorData = await response.json();

    //             setError(
    //                 errorData.error ||
    //                 "Failed to reset password"
    //             );

    //             setLoading(false);
    //             return;
    //         }

    //         alert("Password reset successful");

    //         navigate("/");

    //     } catch (err) {
    //         console.error(err);

    //         setError(
    //             "Something went wrong. Please try again."
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams(
                window.location.search
            );

            const resetPasswordToken =
                params.get("reset_password_token");

            const response = await fetch(
                `${Api}/users/password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },

                    body: JSON.stringify({
                        user: {
                            reset_password_token:
                                resetPasswordToken,
                            password: password,
                            password_confirmation:
                                confirmPassword,
                        },
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "Reset Password Response:",
                data
            );

            if (!response.ok) {
                setError(
                    data.error ||
                    data.message ||
                    "Failed to reset password"
                );

                return;
            }

            alert("Password reset successful!");

            navigate("/login");

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

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Reset Password
                </h2>

                <form
                    onSubmit={handleResetPassword}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="password"
                        placeholder="New Password"
                        autoComplete="new-password"
                        className="border rounded-lg px-4 py-2"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        className="border rounded-lg px-4 py-2"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
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
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>
        </div>
    );
}