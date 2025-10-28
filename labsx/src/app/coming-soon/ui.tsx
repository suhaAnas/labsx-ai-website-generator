"use client";

import { AnimatePresence, motion } from "motion/react";
import { Faculty_Glyphic } from "next/font/google";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import "@/styles/theme/labsx-background.scss";

import SaranganImage from "@/assets/images/Sarangan.jpeg";

const facultyGlyphic = Faculty_Glyphic({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

type ButtonState = "idle" | "loading" | "success";

const buttonCopy: Record<ButtonState, ReactNode> = {
  idle: (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          color="currentColor"
        >
          <path d="m7 7.5l2.942 1.74c1.715 1.014 2.4 1.014 4.116 0L17 7.5" />
          <path d="M11.5 19.5s-1.43-.012-2.401-.037c-3.149-.079-4.723-.118-5.854-1.254c-1.131-1.135-1.164-2.668-1.23-5.733a69 69 0 0 1 0-2.952c.066-3.065.099-4.598 1.23-5.733C4.376 2.655 5.95 2.616 9.099 2.537a115 115 0 0 1 5.802 0c3.149.079 4.723.118 5.854 1.254c1.131 1.135 1.164 2.668 1.23 5.733c.007.357.012.976.014 1.476M14 17.5h8m-4 4v-8" />
        </g>
      </svg>
      <span>Join waitlist</span>
    </>
  ),
  loading: (
    <motion.div
      className="mx-auto h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4"
      aria-hidden="true"
    />
  ),
  success: (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 14.5s1.5 0 3.5 3.5c0 0 5.559-9.167 10.5-11"
          color="currentColor"
        />
      </svg>
      <span>Added</span>
    </>
  ),
};

const isValidEmail = (candidate: string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(candidate.trim());

const getSafeExternalUrl = (candidate?: string) => {
  if (!candidate) return "";

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch (error) {
    console.warn("Blocked unsafe URL", candidate, error);
  }

  return "";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

type TeamMember = {
  id: number;
  name: string;
  designation: string;
  image: string | StaticImageData;
  href: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Sarangan Raviraj",
    designation: "CEO, LabsX",
    image: SaranganImage,
    href: "https://www.linkedin.com/in/sarangan-raviraj/",
  },
  {
    id: 2,
    name: "Coming Soon",
    designation: "Coming Soon",
    image: "",
    href: "",
  },
];

function MemberCard({ member }: { member: TeamMember }) {
  const safeHref = getSafeExternalUrl(member.href);
  const imageSource: string | StaticImageData =
    typeof member.image === "string"
      ? getSafeExternalUrl(member.image)
      : member.image;
  const hasImage =
    typeof imageSource === "string" ? Boolean(imageSource) : Boolean(imageSource);
  const initials = getInitials(member.name) || "LX";

  const cardClasses =
    "flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-left shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/20";

  const content = (
    <>
      {hasImage ? (
        <Image
          src={imageSource}
          alt={member.name}
          width={56}
          height={56}
          className="h-12 w-12 rounded-full border border-primary/20 object-cover object-center"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary"
        >
          {initials}
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-dark">{member.name}</p>
        <p className="text-xs text-dark/60">{member.designation}</p>
      </div>
    </>
  );

  if (safeHref) {
    return (
      <Link
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClasses} role="group" aria-label={`${member.name} profile`}>
      {content}
    </div>
  );
}

export function ComingSoonPage() {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const aboutRef = useRef<HTMLParagraphElement | null>(null);
  const honeypotRef = useRef<HTMLInputElement | null>(null);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const emailFieldA11yProps = error
    ? ({
        "aria-invalid": "true",
        "aria-describedby": "email-error",
      } as const)
    : ({} as const);

  const submitButtonA11yProps =
    buttonState === "loading"
      ? ({
          "aria-busy": "true",
          "aria-disabled": "true",
        } as const)
      : ({} as const);

  const toggleNotifyPanel = (status?: "about") => {
    setIsNotifyOpen((prev) => !prev);

    if (status !== "about") {
      const target = emailInputRef.current;
      if (target) {
        window.setTimeout(() => target.focus(), 200);
      }
    }

    if (status === "about" && aboutRef.current) {
      const aboutElement = aboutRef.current;
      aboutElement.style.background = "#FFFF00";
      aboutElement.style.color = "#000000";

      window.setTimeout(() => {
        aboutElement.style.background = "";
        aboutElement.style.color = "";
      }, 2000);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (honeypotRef.current?.value) {
      return;
    }

    if (buttonState === "success") return;

    const sanitizedEmail = email.trim();

    if (!isValidEmail(sanitizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setButtonState("loading");
    setEmail(sanitizedEmail);

    window.setTimeout(() => {
      setButtonState("success");
    }, 1750);

    window.setTimeout(() => {
      setEmail("");
      setButtonState("idle");
    }, 3500);
  };

  return (
    <main className={`${facultyGlyphic.className} main-content-1 min-h-screen bg-cover bg-no-repeat px-8`}>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex items-center justify-between py-8"
      >
        <div className="w-1/2">
          <Link className="text-3xl font-bold" href="/" aria-label="LabsX home">
            LabsX
          </Link>
        </div>
        <div className="w-1/2 text-end">
          <button
            type="button"
            className="relative cursor-pointer after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:left-0 hover:after:right-auto hover:after:w-full"
            aria-label="Open LabsX info panel"
          >
            <span className="block sm:hidden" onClick={() => toggleNotifyPanel()}>
              Notify Me
            </span>
            <span className="hidden sm:block" onClick={() => toggleNotifyPanel("about")}>
              About LabsX
            </span>
          </button>
        </div>
      </motion.header>

      <section className="grid h-[calc(100vh-200px)] place-content-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Your AI website engine is
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="filter-[url(#ripples)]"
        >
          <svg className="w-64 animate-spin-slow sm:w-96" viewBox="0 0 460 460">
            <defs>
              <path
                id="circle-button-text"
                d="M230,380 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
              ></path>
            </defs>
            <text className="text-[2.1rem] uppercase">
              <textPath fill="currentColor" href="#circle-button-text">
                LabsX • AI Website Generator • Coming Soon •
              </textPath>
            </text>
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Launching Q1 2026
        </motion.p>
      </section>

      <svg height="0" className="hidden">
        <filter id="ripples" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            id="ripple-turbulence"
            numOctaves="1"
            seed="0.1"
            baseFrequency="0.02 0.05"
          ></feTurbulence>
          <feDisplacementMap scale="10" in="SourceGraphic"></feDisplacementMap>
          <animate
            href="#ripple-turbulence"
            attributeName="baseFrequency"
            dur="75s"
            keyTimes="0;0.5;1"
            values="0.02 0.03; 0.04 0.04; 0.02 0.03"
            repeatCount="indefinite"
          ></animate>
        </filter>
      </svg>

      <aside
        className={`${
          isNotifyOpen ? "" : "-translate-x-full"
        } fixed top-0 left-0 z-[9998] h-full w-[90%] bg-white text-black transition duration-200 md:w-[60%] lg:w-1/2 xl:w-[35%]`}
      >
        <button
          type="button"
          onClick={() => toggleNotifyPanel()}
          className="absolute right-4 top-6 z-50 overflow-clip bg-white p-3 opacity-20 transition duration-200 hover:opacity-100 sm:right-9 sm:top-11"
          aria-label="Close LabsX panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 5L5 19M5 5l14 14"
              color="currentColor"
            />
          </svg>
        </button>

        <div className="flex h-full flex-col overflow-y-auto p-8 sm:p-12">
          <div className="mb-12 sm:mb-16">
            <Link
              className="mb-8 inline-block text-3xl font-bold sm:mb-16"
              href="/"
              aria-label="LabsX home"
            >
              LabsX
            </Link>

            <p className="mb-2 text-sm opacity-75 sm:mb-3">
              LabsX is nearly ready for liftoff.
            </p>
            <p className="mb-6 text-2xl sm:mb-8 sm:text-3xl">
              Be first in line for early access
            </p>

            <form onSubmit={handleSubmit}>
              <div aria-hidden="true" className="absolute h-px w-px overflow-hidden">
                <label htmlFor="job-title" className="sr-only">
                  Leave this field empty
                </label>
                <input
                  ref={honeypotRef}
                  id="job-title"
                  name="job-title"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
              <label className="mb-2 block text-sm" htmlFor="email">
                Enter your email <span className="text-red-500">*</span>
              </label>

              <div className="items-center gap-1 sm:flex">
                <input
                  className="peer block h-12 w-full rounded-md border-2 border-gray-100 px-4 transition duration-200 hover:border-gray-200 focus:border-[var(--primary-shade)] focus:bg-white focus:outline-none"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@email.com"
                  aria-label="Enter your email"
                  autoComplete="email"
                  inputMode="email"
                  ref={emailInputRef}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  {...emailFieldA11yProps}
                />

                <button
                  className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-100 px-6 text-black transition duration-200 hover:bg-[var(--primary-shade)] hover:text-white focus:outline-[var(--primary-shade)] sm:mt-0"
                  type="submit"
                  aria-label="Submit notify email"
                  disabled={buttonState === "loading"}
                  {...submitButtonA11yProps}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      className="flex items-center gap-2"
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 25 }}
                      key={buttonState}
                    >
                      {buttonCopy[buttonState]}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              {error && (
                <p id="email-error" className="mt-2 text-xs text-red-500" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="mt-auto">
            <hr className="mb-8 block w-10" />
            <p
              ref={aboutRef}
              className="mb-6 inline-block text-[15px] text-black/50"
            >
              About LabsX
            </p>
            <p className="text-[15px] leading-relaxed sm:text-base sm:leading-loose">
              We’re a team of builders creating an AI-native website generator.
              LabsX partners with founders to ship conversion-ready experiences
              in minutes—no code, no compromises.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-wide text-black/40">
                Leadership team
              </span>
              <div className="flex flex-wrap gap-4">
                {TEAM_MEMBERS.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section
        onClick={() => toggleNotifyPanel()}
        className={`${
          isNotifyOpen
            ? ""
            : "pointer-events-none opacity-0 visisbility-hidden"
        } fixed top-0 left-0 z-[9990] h-full w-full cursor-pointer bg-black/50 transition duration-200`}
        aria-hidden="true"
      ></section>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="items-center justify-between py-8 sm:flex"
      >
        <div className="w-full text-center sm:w-2/3 sm:text-start">
          <span className="inline-block text-sm text-balance">
            &copy; {new Date().getFullYear()} LabsX. Crafted by the LabsX team.
          </span>
        </div>
        <div className="hidden w-1/3 text-end sm:block">
          <button
            onClick={() => toggleNotifyPanel()}
            type="button"
            className="relative cursor-pointer after:absolute after:right-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:left-0 hover:after:right-auto hover:after:w-full"
            aria-label="Open LabsX notify panel"
          >
            Notify Me
          </button>
        </div>
      </motion.footer>
    </main>
  );
}
