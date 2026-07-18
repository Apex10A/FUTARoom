import { LANDING_THEME } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "right";
  theme?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#0a100e]" : "bg-[#f8f7f4]";

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-1/2 h-px -translate-y-1/2",
          isDark ? "bg-white/15" : "bg-foreground/10"
        )}
      />
      <div
        className={cn(
          "relative flex",
          align === "right" ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-lg",
            bgClass,
            align === "right" ? "pl-6 text-right" : "pr-6 text-left"
          )}
        >
          <h2
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
            style={{ color: LANDING_THEME.accent }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "mt-2 text-sm leading-relaxed sm:text-base",
                isDark ? "text-white/65" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
