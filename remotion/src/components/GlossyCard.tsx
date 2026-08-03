import React from "react";

interface GlossyCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "gold" | "none";
}

export const GlossyCard: React.FC<GlossyCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
}) => {
  const glowStyle =
    glowColor === "blue"
      ? "0 20px 50px rgba(37, 99, 235, 0.25), 0 0 20px rgba(37, 99, 235, 0.15)"
      : glowColor === "gold"
      ? "0 20px 50px rgba(245, 179, 1, 0.25), 0 0 20px rgba(245, 179, 1, 0.15)"
      : "0 20px 40px rgba(0, 0, 0, 0.6)";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden glass-panel ${className}`}
      style={{
        boxShadow: glowStyle,
      }}
    >
      {/* Top reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {children}
    </div>
  );
};
