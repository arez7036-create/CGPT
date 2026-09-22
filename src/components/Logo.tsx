
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("relative rounded-full overflow-hidden bg-[#10a37f] flex items-center justify-center", sizeClasses[size], className)}>
      <img src="/cgpt-logo.svg" alt="CGPT" className="w-full h-full object-contain p-1" />
    </div>
  );
}
