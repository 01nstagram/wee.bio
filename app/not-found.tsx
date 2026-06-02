import Link from "next/link";
import { Shell } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell className="flex items-center justify-center text-center">
      <div>
        <p className="text-cyan">404</p>
        <h1 className="mt-2 text-4xl font-black">Profile not found</h1>
        <p className="mt-3 text-slate-300">This wee.bio profile is private or does not exist.</p>
        <Link href="/" className="btn btn-primary mt-8">Back home</Link>
      </div>
    </Shell>
  );
}
