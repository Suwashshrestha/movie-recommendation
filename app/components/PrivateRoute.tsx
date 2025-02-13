import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  if (!user) {
    return redirect("/login");
  }
  return json({ user });
};

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>(); // Get user from loader

  return user ? <>{children}</> : null; // If no user, redirect happens in the loader
}
