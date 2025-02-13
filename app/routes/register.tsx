import { useState } from "react";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createUser } from "~/utils/session.server";

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
    username?: string;
    general?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const errors: ActionData["errors"] = {};

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

  if (!username || typeof username !== "string") {
    errors.username = "Username is required";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    await createUser({ email, password, username });
    return redirect("/login");
  } catch (error) {
    return json<ActionData>(
      { errors: { general: "Registration failed. Please try again." } },
      { status: 500 }
    );
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="m-auto w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
            Create Account
          </h2>

          {actionData?.errors?.general && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
              {actionData.errors.general}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              {actionData?.errors?.username && (
                <p className="mt-1 text-sm text-red-600">
                  {actionData.errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              {actionData?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              {actionData?.errors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {actionData.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}