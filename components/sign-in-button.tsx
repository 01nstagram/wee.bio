"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className="btn btn-primary mt-8 w-full">
      Continue with Discord
    </button>
  );
}
