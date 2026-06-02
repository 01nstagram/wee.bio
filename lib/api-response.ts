import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { error: jsonError("Invalid JSON body", 400) } as const;
  }

  try {
    return { data: schema.parse(body) } as const;
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: NextResponse.json({ error: "Invalid request body", issues: error.flatten() }, { status: 400 }) } as const;
    }

    return { error: jsonError("Invalid request body", 400) } as const;
  }
}

export function truncateHeader(value: string | null, maxLength: number) {
  if (!value) {
    return null;
  }

  return value.slice(0, maxLength);
}
