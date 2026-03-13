import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      username: string;
      memberId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    username: string;
    memberId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    username: string;
    memberId: string | null;
  }
}
