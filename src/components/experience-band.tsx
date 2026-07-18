import { Link } from "@tanstack/react-router";
import experienceBg from "@/assets/experience-bg.jpg";

export function ExperienceBand() {
  return (
    <section className="mx-auto mt-14 max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={experienceBg}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="relative z-10 max-w-xl px-6 py-14 text-white md:px-12 md:py-20">
          <h3 className="font-display text-3xl font-extrabold md:text-5xl">
            Experience it <span className="gradient-title">live</span>
          </h3>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Want to feel the bass or try the fit? Visit our experience centers with
            dedicated zones for gaming, audio and smart home tech.
          </p>
          <Link
            to="/stores"
            className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:brightness-110"
          >
            Find nearest store →
          </Link>
        </div>
      </div>
    </section>
  );
}
