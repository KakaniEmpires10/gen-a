import type { NextAuthConfig } from "next-auth";

// Config ini TIDAK menggunakan bcrypt atau prisma
// Hanya untuk middleware
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnForget = nextUrl.pathname.startsWith("/forget");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect ke login page
      } else if (isOnLogin || isOnForget) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Providers akan ditambahkan di auth.ts
} satisfies NextAuthConfig;