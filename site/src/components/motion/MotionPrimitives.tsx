import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import appStoreBadge from "@/assets/badges/app-store.svg";
import googlePlayBadge from "@/assets/badges/google-play.svg";

// ----- Variants -----
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

// ----- FadeUp section wrapper -----
type FadeUpProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  as?: "div" | "section";
};

export function FadeUp({ children, className, delay = 0, as = "div", ...rest }: FadeUpProps) {
  const Comp = as === "section" ? motion.section : motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      className={className}
      {...(rest as any)}
    >
      {children}
    </Comp>
  );
}

// ----- Stagger list -----
export function Stagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

// ----- Hover-lift card -----
export function HoverCard({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ----- Animated counter -----
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  decimals = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      }
    });
  }, [spring, prefix, suffix, decimals]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}

// ----- App Store / Google Play badges -----
export function StoreBadges({
  className = "",
  align = "start",
}: {
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <motion.a
        href="#"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="inline-block"
        aria-label="Download GoNex on the App Store"
      >
        <img
          src={appStoreBadge}
          alt="Download on the App Store"
          className="h-12 w-auto sm:h-14"
          loading="lazy"
        />
      </motion.a>
      <motion.a
        href="#"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="inline-block"
        aria-label="Get GoNex on Google Play"
      >
        <img
          src={googlePlayBadge}
          alt="Get it on Google Play"
          className="h-12 w-auto sm:h-14"
          loading="lazy"
        />
      </motion.a>
    </div>
  );
}

// ----- Page transition wrapper -----
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
