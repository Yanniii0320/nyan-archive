"use client";

import Link from "next/link";

type Work = { title: string; type: string; text: string; image?: string };

const worlds: Record<string, { id: string; title: string; statement: string; image: string; rgb: string; works: Work[] }> = {
  liminal: {
    id: "01", title: "LIMINAL", rgb: "177, 106, 255", image: "/archive/liminal.png",
    statement: "Some worlds do not wait to be understood. They only breathe for a moment while you pass through.",
    works: [
      { title: "The Orphic Passage", type: "FILM / MOVING IMAGE", text: "A passage through memory, ritual and the unstable boundary between image and consciousness." },
      { title: "Liquid Noise", type: "AUDIO REACTIVE / WEBGL", text: "A fluid field that changes density through gesture, sound and bass frequency." },
      { title: "Call Me by Your Name", type: "INTERACTIVE POETRY", text: "A concrete poem made from letters: held, pulled into orbit, and returned to language." },
    ],
  },
  buffer: {
    id: "02", title: "BUFFER", rgb: "255, 194, 130", image: "/archive/buffer.png",
    statement: "Where instinct meets structure: identities, objects and small systems made tactile enough to be felt.",
    works: [
      { title: "PATHOS / 情绪维他命", type: "BRAND / PACKAGING / EMOTION", text: "Emotions imagined as vitamins — a vivid identity, voice and packaging system for feeling." , image: "/archive/portfolio/pathos-23.jpg" },
      { title: "DUDU4X11", type: "IP DESIGN / CHARACTER SYSTEM", text: "A blue character system for X11, extended from proportions and expression into packaging and physical matter.", image: "/archive/portfolio/x11-04.jpg" },
      { title: "Untitled / 留白", type: "PERSONAL PROJECT / IN DEVELOPMENT", text: "A place intentionally left unfilled until a project worth keeping appears." },
    ],
  },
  afterimage: {
    id: "04", title: "AFTERIMAGE", rgb: "186, 255, 180", image: "/archive/afterlight.png",
    statement: "Not answers themselves, but the fields of study and experiments left behind on the way toward them.",
    works: [
      { title: "Float in the Flow", type: "VIBE CODING / INTERACTIVE TOOLS", text: "A small laboratory of generators, browser experiments and interactive tools." },
      { title: "Sound Drawing Machine", type: "PHYSICAL COMPUTING", text: "Sound translated into a line and slowly written onto paper — a breath that refuses to be forgotten." },
      { title: "Field of Small Things", type: "ARCHIVE / RESEARCH", text: "A record of moments too small to become events: grass, wind and unresolved pauses." },
    ],
  },
};

export default function ArchiveWorld({ world }: { world: keyof typeof worlds }) {
  const item = worlds[world];
  return (
    <main className="world-page" style={{ "--world-rgb": item.rgb } as React.CSSProperties}>
      <div className="world-page__hero" style={{ backgroundImage: `url(${item.image})` }} aria-hidden="true" />
      <div className="world-page__veil" aria-hidden="true" />
      <header className="world-page__header">
        <Link href="/" className="world-page__brand">NÝAN.ARCHIVE</Link>
        <span>{item.id} / 04</span>
      </header>
      <section className="world-page__intro">
        <p>WORLD {item.id}</p>
        <h1>{item.title}</h1>
        <span>{item.statement}</span>
      </section>
      <section className="world-page__works" aria-label={`${item.title} selected works`}>
        {item.works.map((work, index) => (
          <article className="world-work" key={work.title}>
            <p>{String(index + 1).padStart(2, "0")}</p>
            <div className="world-work__media">
              {work.image ? <img src={work.image} alt="" /> : <span>{item.title}</span>}
            </div>
            <div className="world-work__copy">
              <small>{work.type}</small>
              <h2>{work.title}</h2>
              <p>{work.text}</p>
            </div>
          </article>
        ))}
      </section>
      <nav className="world-page__navigation" aria-label="Explore other worlds">
        <Link href="/liminal">LIMINAL</Link><Link href="/buffer">BUFFER</Link><Link href="/resonance">RESONANCE</Link><Link href="/afterimage">AFTERIMAGE</Link>
      </nav>
    </main>
  );
}
