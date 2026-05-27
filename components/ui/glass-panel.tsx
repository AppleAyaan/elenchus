import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassPanel({
  className,
  hover = false,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass-panel",
        hover &&
          "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
