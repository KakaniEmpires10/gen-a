"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  if (!username || !password) {
    return {
      error: "Username dan password harus diisi",
    };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });

    // Jika berhasil, akan redirect otomatis
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Username atau password salah" };
        default:
          return { error: "Terjadi kesalahan saat login" };
      }
    }

    // Next.js redirect throws NEXT_REDIRECT error yang harus di-throw ulang
    throw error;
  }
}