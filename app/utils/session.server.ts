import { createCookieSessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["your-secret-key"], // Replace with your actual secret
    secure: process.env.NODE_ENV === "production",
  },
});

type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginUser({ email, password }: LoginCredentials) {
  // TODO: Implement your actual authentication logic here
  // This is just an example
  if (email === "test@example.com" && password === "password") {
    return { id: "1", email };
  }
  throw new Error("Invalid credentials");
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function requireUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    throw redirect("/login");
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

type UserData = {
  email: string;
  password: string;
  username: string;
};

export async function createUser({ email, password, username }: UserData) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // TODO: Implement your database creation logic
  // Example with Prisma:
  // const user = await db.user.create({
  //   data: {
  //     email,
  //     username,
  //     password: hashedPassword,
  //   },
  // });

  // For now, we'll just return a mock user
  return {
    id: "1",
    email,
    username,
  };
}

export async function verifyLogin(email: string, password: string) {
  // TODO: Implement your login verification logic
  // Example with Prisma:
  // const user = await db.user.findUnique({ where: { email } });
  // if (!user) return null;
  // const isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) return null;
  // return user;
}