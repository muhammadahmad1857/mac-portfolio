// "use client";
// import { useEffect, useRef } from "react";

// interface TextPressureProps {
//   children: string;
//   className?: string;
//   width?: boolean;
//   weight?: boolean;
//   italic?: boolean;
//   alpha?: boolean;
//   stroke?: boolean;
//   scale?: boolean;
//   textColor?: string;
//   strokeColor?: string;
//   strokeWidth?: number;
//   baseFontWeight?: number;
// }

// const TextPressure: React.FC<TextPressureProps> = ({
//   children,
//   className = "",
//   width = false,
//   weight = true,
//   italic = false,
//   alpha = false,
//   stroke = false,
//   scale = false,
//   textColor = "#fff",
//   strokeColor = "#ff0000",
//   strokeWidth = 2,
//   baseFontWeight = 400,
// }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
//   const titleRef = useRef<HTMLDivElement | null>(null);

//   const mouse = useRef({ x: 0, y: 0 });
//   const cursor = useRef({ x: 0, y: 0 });

//   const chars = children.split("");

//   const dist = (a: {x:number,y:number}, b: {x:number,y:number}) =>
//     Math.hypot(b.x - a.x, b.y - a.y);

//   useEffect(() => {
//     const onMove = (e: MouseEvent) => {
//       cursor.current.x = e.clientX;
//       cursor.current.y = e.clientY;
//     };
//     window.addEventListener("mousemove", onMove);

//     return () => window.removeEventListener("mousemove", onMove);
//   }, []);

//   useEffect(() => {
//     let raf: number;

//     const animate = () => {
//       mouse.current.x += (cursor.current.x - mouse.current.x) / 12;
//       mouse.current.y += (cursor.current.y - mouse.current.y) / 12;

//       if (titleRef.current) {
//         const rect = titleRef.current.getBoundingClientRect();
//         const maxDist = rect.width / 2;

//         spansRef.current.forEach((span) => {
//           if (!span) return;

//           const r = span.getBoundingClientRect();
//           const center = {
//             x: r.x + r.width / 2,
//             y: r.y + r.height / 2,
//           };

//           const d = dist(mouse.current, center);

//           const get = (d: number, min: number, max: number) =>
//             Math.max(min, max - (max * d) / maxDist);

//           const wght = weight ? Math.floor(get(d, baseFontWeight, 900)) : baseFontWeight;
//           const wdth = width ? Math.floor(get(d, 50, 200)) : 100;
//           const ital = italic ? get(d, 0, 1).toFixed(2) : "0";
//           const op = alpha ? get(d, 0.2, 1).toFixed(2) : "1";

//           span.style.opacity = op;
//           span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
//         });
//       }

//       raf = requestAnimationFrame(animate);
//     };

//     animate();
//     return () => cancelAnimationFrame(raf);
//   }, [weight, width, italic, alpha, chars.length]);

//   return (
//     <div
//       className={`${className} ${stroke ? "stroke" : ""}`}
//       style={{ color: stroke ? undefined : textColor }}
//       ref={titleRef}
//     >
//       <style>{`
//         .stroke span {
//           position: relative;
//           color: ${textColor};
//         }
//         .stroke span::after {
//           content: attr(data-char);
//           position: absolute;
//           left: 0;
//           top: 0;
//           color: transparent;
//           z-index: -1;
//           -webkit-text-stroke-width: ${strokeWidth}px;
//           -webkit-text-stroke-color: ${strokeColor};
//         }
//       `}</style>

//       {chars.map((char, i) => (
//         <span
//           key={i}
//           ref={(el) => (spansRef.current[i] = el)}
//           data-char={char}
//           className="inline-block"
//         >
//           {char == " " ? "\u00A0" : char}
//         </span>
//       ))}
//     </div>
//   );
// };

// export { TextPressure };



"use client";
import { useEffect, useRef } from "react";

interface TextPressureProps {
  children: string;
  className?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  baseFontWeight?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
  children,
  className = "",
  width = false,
  weight = true,
  italic = false,
  alpha = false,
  stroke = false,
  scale = false,
  textColor = "#fff",
  strokeColor = "#ff0000",
  strokeWidth = 2,
  baseFontWeight = 400,
}) => {
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  const chars = children.split("");

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(b.x - a.x, b.y - a.y);

  useEffect(() => {
    let hovered = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      if (!hovered) return;
      cursor.current.x = e.clientX;
      cursor.current.y = e.clientY;
    };

    const onEnter = () => (hovered = true);

    const onLeave = () => {
      hovered = false;
      spansRef.current.forEach((span) => {
        if (!span) return;
        span.style.opacity = "1";
        span.style.transform = "scale(1)";
        span.style.fontVariationSettings = `'wght' ${baseFontWeight}, 'wdth' 100, 'ital' 0`;
      });
    };

    const animate = () => {
      if (hovered && titleRef.current) {
        mouse.current.x += (cursor.current.x - mouse.current.x) / 12;
        mouse.current.y += (cursor.current.y - mouse.current.y) / 12;

        const rect = titleRef.current.getBoundingClientRect();
        const maxDist = rect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;
          const r = span.getBoundingClientRect();
          const center = {
            x: r.x + r.width / 2,
            y: r.y + r.height / 2,
          };

          const d = dist(mouse.current, center);

          const get = (d: number, min: number, max: number) =>
            Math.max(min, max - (max * d) / maxDist);

          const wght = weight ? Math.floor(get(d, baseFontWeight, 900)) : baseFontWeight;
          const wdth = width ? Math.floor(get(d, 50, 200)) : 100;
          const ital = italic ? get(d, 0, 1).toFixed(2) : "0";
          const op = alpha ? get(d, 0.2, 1).toFixed(2) : "1";
          const scaleVal = scale ? get(d, 1, 1.4).toFixed(2) : "1";

          span.style.opacity = op;
          span.style.transform = `scale(${scaleVal})`;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
        });
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", onMove);
    titleRef.current?.addEventListener("mouseenter", onEnter);
    titleRef.current?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      titleRef.current?.removeEventListener("mouseenter", onEnter);
      titleRef.current?.removeEventListener("mouseleave", onLeave);
    };
  }, [weight, width, italic, alpha, scale, chars.length]);

  return (
    <div
      className={`${className} ${stroke ? "stroke" : ""}`}
      ref={titleRef}
      style={{ color: stroke ? undefined : textColor }}
    >
      <style>{`
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>

      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => (spansRef.current[i] = el)}
          data-char={char}
          className="inline-block transition-all duration-150"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export { TextPressure };


export default function Welcome() {
  return (
    <div id="welcome" >

      <TextPressure
        className="text-3xl font-georama"
        baseFontWeight={200}
      >
        Hi, Ahmad here — welcome to my
      </TextPressure>

      <TextPressure 
        className="text-9xl font-georama italic mt-7"
        baseFontWeight={300}
        weight
        width
        italic
       
      >
        Portfolio
      </TextPressure>

      <div className="small-screen mt-5 text-sm opacity-70">
        This portfolio is designed for desktop/tablet screens
      </div>
    </div>
  );
}
