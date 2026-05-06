import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

type IconType = ComponentType<LucideProps>;

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function Surface({ children, className }: SurfaceProps) {
  return (
    <section
      className={cx(
        "rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-200/30",
        className,
      )}
    >
      {children}
    </section>
  );
}

type BadgeTone = "dark" | "teal" | "amber" | "zinc";

const badgeTones: Record<BadgeTone, string> = {
  dark: "bg-zinc-950 text-white",
  teal: "bg-teal-50 text-teal-700",
  amber: "bg-amber-50 text-amber-700",
  zinc: "bg-zinc-100 text-zinc-700",
};

export function Badge({
  children,
  tone = "zinc",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: IconType;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-zinc-500">{label}</p>
        {Icon ? <Icon size={15} className="text-teal-600" aria-hidden="true" /> : null}
      </div>
      <p className="mt-1 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

export function InfoList({
  items,
}: {
  items: Array<[string, ReactNode]>;
}) {
  return (
    <div className="divide-y divide-zinc-100">
      {items.map(([label, value]) => (
        <div
          className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
          key={label}
        >
          <span className="text-sm text-zinc-500">{label}</span>
          <span className="max-w-72 text-right text-sm font-semibold text-zinc-800">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: IconType;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-semibold leading-7 text-zinc-950">{title}</h2>
        {body ? <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p> : null}
      </div>
      {Icon ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
          <Icon size={20} aria-hidden="true" />
        </div>
      ) : null}
    </div>
  );
}
