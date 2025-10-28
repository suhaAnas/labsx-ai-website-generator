"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface AnimatedTooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
  href?: string;
}

interface AnimatedTooltipProps {
  items: AnimatedTooltipItem[];
  className?: string;
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  items,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((item) => (
        <div
          className="group relative -mr-4"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX,
                  rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-foreground px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute left-10 -bottom-px z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-background">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {item.href ? (
            <Link
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Image
                onMouseMove={handleMouseMove}
                height={56}
                width={56}
                src={item.image}
                alt={item.name}
                className="relative h-14 w-14 rounded-full border-2 border-background object-cover object-top transition duration-500 group-hover:z-30 group-hover:scale-105"
              />
            </Link>
          ) : (
            <Image
              onMouseMove={handleMouseMove}
              height={56}
              width={56}
              src={item.image}
              alt={item.name}
              className="relative h-14 w-14 rounded-full border-2 border-background object-cover object-top transition duration-500 group-hover:z-30 group-hover:scale-105"
            />
          )}
        </div>
      ))}
    </div>
  );
};
