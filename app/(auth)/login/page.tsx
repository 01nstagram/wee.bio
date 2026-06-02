import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Shell, Card } from "@/components/ui";
import { SignInButton } from "@/components/sign-in-button";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Shell className="flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan">wee.bio</p>
        <h1 className="mt-4 text-4xl font-black">Connect Discord</h1>
        <p className="mt-3 text-slate-300">
          Sign in with Discord to create, edit and publish your wee.bio profile.
        </p>
        <SignInButton />
      </Card>
    </Shell>
  );
}
