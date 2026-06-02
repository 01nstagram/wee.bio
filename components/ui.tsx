import clsx from "clsx";

export function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={clsx("min-h-screen grid-bg px-4 py-6 sm:px-6 lg:px-8", className)}>{children}</main>;
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-7xl", className)}>{children}</div>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("glass rounded-3xl p-6", className)}>{children}</section>;
}

export function BadgePill({ children, color = "#8b5cf6" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]"
      style={{ borderColor: color, color }}
    >
      {children}
    </span>
  );
}
