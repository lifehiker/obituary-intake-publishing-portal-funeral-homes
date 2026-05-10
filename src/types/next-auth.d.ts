import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      funeralHomeId?: string | null;
      locationId?: string | null;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    role: UserRole;
    funeralHomeId?: string | null;
    locationId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    funeralHomeId?: string | null;
    locationId?: string | null;
  }
}
