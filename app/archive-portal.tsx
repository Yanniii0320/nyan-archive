"use client";

import { useEffect, useRef, useState } from "react";

const worlds = [
  {
    id: "01",
    title: "LIMINAL",
    descriptor: "images at the edge of language",
    href: "/liminal",
    image: "/archive/liminal.png",
    tint: "174, 121, 255",
  },
  {
    id: "02",
    title: "BUFFER",
    descriptor: "forms held between feeling and structure",
    href: "/buffer",
    image: "/archive/buffer.png",
    tint: "255, 196, 128",
  },
  {
    id: "03",
    title: "RESONANCE",
    descriptor: "listening as an emotional habitat",
    href: "/resonance",
    image: "/archive/residue.png",
    tint: "254, 157, 210",
  },
  {
    id: "04",
    title: "AFTERIMAGE",
    descriptor: "experiments after the light has moved on",
    href: "/afterimage",
    image: "/archive/afterlight.png",
    tint: "184, 255, 181",
  },
];

export default function ArchivePortal() {
  const [active, setActive] = useState(1);
  const wheelLock = useRef(false);

  useEffect(() => {
    const move = (direction: number) => {
      if (wheelLock.current) return;
      wheelLock.current = true;
      setActive((value) => (value + direction + worlds.length) % worlds.length);
      window.setTimeout(() => { wheelLock.current = false; }, 740);
    };
    const onWheel = (event: WheelEvent) => move(event.deltaY > 0 ? 1 : -1);
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(event.key)) move(1);
      if (["ArrowUp", "ArrowLeft"].includes(event.key)) move(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = worlds[active];

  return (
    <main className="archive-portal" style={{ "--world-rgb": selected.tint } as React.CSSProperties}>
      <div className="archive-portal__wash" aria-hidden="true" />
      <p className="archive-portal__mark">NÝAN.ARCHIVE <span>SEASON 01</span></p>
      <p className="archive-portal__counter" aria-live="polite">{selected.id} / 04</p>

      <div className="archive-portal__worlds" aria-label="Archive worlds">
        {worlds.map((world, index) => {
          const distance = ((index - active + worlds.length) % worlds.length);
          const position = distance === 0 ? 0 : distance === 1 ? 1 : distance === 3 ? -1 : 2;
          return (
            <a
              className={`archive-world ${index === active ? "is-active" : ""}`}
              data-position={position}
              href={world.href}
              key={world.id}
              onMouseEnter={() => setActive(index)}
              aria-label={`Enter ${world.title}`}
            >
              <span className="archive-world__image" style={{ backgroundImage: `url(${world.image})` }} />
              <span className="archive-world__fog" />
              <span className="archive-world__id">{world.id}</span>
              <span className="archive-world__name">{world.title}</span>
              <span className="archive-world__line" />
            </a>
          );
        })}
      </div>

      <section className="archive-portal__intro" aria-label="Selected world">
        <p>AN ARCHIVE OF TENDER SYSTEMS</p>
        <h1>{selected.title}</h1>
        <span>{selected.descriptor}</span>
      </section>

      <p className="archive-portal__drift">DRIFT TO SHIFT <i>↓</i></p>
      <p className="archive-portal__note">each world is a different way of staying</p>
    </main>
  );
}
