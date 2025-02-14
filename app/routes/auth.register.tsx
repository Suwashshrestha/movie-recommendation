import { useState } from "react";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { auth } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Register - CineMatch" },
    { name: "description", content: "Create your CineMatch account to get personalized movie recommendations" },
  ];
};

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
    re_password?: string;
    username?: string;
    general?: string;
  };
  success?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const re_password = formData.get("re_password");
  const username = formData.get("username");

  const errors: ActionData["errors"] = {};

  // Validation
  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Invalid email format";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!re_password || re_password !== password) {
    errors.re_password = "Passwords do not match";
  }

  if (!username || typeof username !== "string") {
    errors.username = "Username is required";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    await auth.register({
      email: email.toString(),
      username: username.toString(),
      password: password.toString(),
      re_password: re_password.toString(),
    });

    return json<ActionData>(
      { 
        success: true,
        errors: { 
          general: "Registration successful! Please check your email for activation instructions." 
        } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    const serverErrors: ActionData["errors"] = {};
    
    if (error.response?.data) {
      const data = error.response.data;
      if (data.email) serverErrors.email = data.email[0];
      if (data.username) serverErrors.username = data.username[0];
      if (data.password) serverErrors.password = data.password[0];
      if (data.non_field_errors) serverErrors.general = data.non_field_errors[0];
    } else {
      serverErrors.general = "Registration failed. Please try again.";
    }

    return json<ActionData>({ errors: serverErrors }, { status: 400 });
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-gray-900/90 z-10" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Cinema Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-md w-full">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Join CineMatch
              </h2>
              <p className="mt-2 text-gray-400">
                Create your account to start discovering perfect movies
              </p>
            </div>

            {actionData?.success ? (
              <div className="mb-6 rounded-lg bg-purple-900/50 p-4 text-purple-200 border border-purple-500">
                {actionData.errors?.general}
              </div>
            ) : actionData?.errors?.general ? (
              <div className="mb-6 rounded-lg bg-red-900/50 p-4 text-red-200 border border-red-500">
                {actionData.errors.general}
              </div>
            ) : null}

            <Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {actionData?.errors?.username && (
                  <p className="mt-1 text-sm text-red-400">
                    {actionData.errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {actionData?.errors?.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {actionData.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {actionData?.errors?.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {actionData.errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="re_password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Confirm Password
                </label>
                <input
                  id="re_password"
                  name="re_password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {actionData?.errors?.re_password && (
                  <p className="mt-1 text-sm text-red-400">
                    {actionData.errors.re_password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </Form>

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}