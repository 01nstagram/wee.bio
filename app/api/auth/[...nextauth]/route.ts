import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, isAuthRuntimeConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

const unavailable = () =>
  NextResponse.json(
    { error: "Authentication is not configured. Check the deployment environment variables." },
    { status: 503 }
  );

const handler = isAuthRuntimeConfigured() ? NextAuth(authOptions) : unavailable;

export { handler as GET, handler as POST };
