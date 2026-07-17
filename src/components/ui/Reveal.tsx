import { ReactNode } from "react";
import { MotiView } from "moti";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

// RN equivalent of the web's framer-motion Reveal wrapper, built on Moti.
export default function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: y }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 500, delay }}
      className={className}
    >
      {children}
    </MotiView>
  );
}
