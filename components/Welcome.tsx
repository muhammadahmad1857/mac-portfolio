"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
const FONT_WEIGHTS = {
  subtitle: {
    min: 200,
    max: 400,
    default: 200,
  },
  title: {
    min: 400,
    max: 900,
    default: 400,
  },
};

const setupTextHover = (
  container: HTMLElement,
  type: keyof typeof FONT_WEIGHTS
) => {
  if (!container) return () => {};
  const letters: NodeListOf<HTMLSpanElement> =
    container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (
    letter: HTMLElement,
    weight: number,
    duration: number = 0.25
  ) => {
    return gsap.to(letter, {
      duration: duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });
  };
  const handleMouseMove = (e: MouseEvent) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;
    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      console.log("mouse moved", letter.tagName);
      const distance = Math.abs(mouseX - (l + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 2000);
      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetter(letter, base, 0.3);
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const renderText = (
  text: string,
  className: string,
  baseWeight: number = 400
) => {
  return [...text].map((char, index) => (
    <span
      key={index}
      className={className}
      style={{
        fontVariationSettings: `'wght' ${baseWeight}`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const Welcome = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current!, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current!, "subtitle");
    console.log("GSAP setup complete");
    return () => {
      subtitleCleanup();
      titleCleanup();
    };
  }, []);
  return (
    <div id="welcome">
      <p ref={subtitleRef}>
        {renderText(
          "Hey, I am Ahmad welcome to my ",
          "text-3xl font-georama",
          FONT_WEIGHTS.subtitle.default
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText(
          "Portfolio",
          "text-9xl font-georama italic ",
          FONT_WEIGHTS.title.default
        )}
      </h1>
      <div className="small-screen">
        <p>This Portfolio is designed for desktop/Tablet screen</p>
      </div>
    </div>
  );
};

export default Welcome;
