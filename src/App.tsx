import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EVENT_LOGOS, PARTNER_LOGOS, TICKETS_URL } from "./config";

type PhotoName =
  | "curtains"
  | "roses"
  | "table"
  | "candles"
  | "community"
  | "event-sparklers-red"
  | "event-sparklers"
  | "event-sparklers-amber-05"
  | "event-music-1"
  | "event-music-2"
  | "event-music-3"
  | "event-community"
  | "event-presenter"
  | "cause-celebration"
  | "manifesto-sparklers";

function Star({
  className = "",
  variant = 2,
}: {
  className?: string;
  variant?: 1 | 2 | 3;
}) {
  return (
    <img
      className={`star ${className}`}
      src={`/assets/star-${variant}.webp`}
      alt=""
      width="256"
      height="256"
      aria-hidden="true"
    />
  );
}

function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      <Star />
      <Star variant={3} />
      <Star />
      <Star />
    </div>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={`arrow ${down ? "arrow-down" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function Photo({
  name,
  alt,
  className = "",
  sizes = "50vw",
  eager = false,
}: {
  name: PhotoName;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const dimensions = {
    curtains: [3456, 2304],
    roses: [4222, 2818],
    table: [3743, 4986],
    candles: [3648, 5472],
    community: [2969, 1914],
    "event-sparklers-red": [2048, 1365],
    "event-sparklers": [2048, 1365],
    "event-sparklers-amber-05": [2048, 1365],
    "event-music-1": [2048, 1365],
    "event-music-2": [2048, 1365],
    "event-music-3": [2048, 1365],
    "event-community": [2048, 1365],
    "event-presenter": [2048, 1365],
    "cause-celebration": [2048, 1365],
    "manifesto-sparklers": [1008, 1066],
  }[name];
  const eventPhoto = name.startsWith("event-");
  const image = (
    <img
      className={eventPhoto ? "event-photo-image" : `photo ${className}`}
      src={`/assets/${name}-960.webp`}
      srcSet={[640, 960, 1440, 1920]
        .map((width) => `/assets/${name}-${width}.webp ${width}w`)
        .join(", ")}
      sizes={sizes}
      alt={alt}
      width={dimensions[0]}
      height={dimensions[1]}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
  return eventPhoto ? (
    <span className={`photo event-photo ${className}`}>{image}</span>
  ) : (
    image
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (
      !node ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    node.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`reveal ${className}`} ref={element}>
      {children}
    </div>
  );
}

function TicketLink({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`ticket-link ${light ? "ticket-link-light" : ""}`}
      href={TICKETS_URL}
    >
      Comprar boletos
      <Arrow />
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      if (window.innerWidth > 767) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <header
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${open ? "menu-open" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <a className="brand" href="#inicio" aria-label="Media Cena ’26, inicio">
        MEDIA CENA <span>’26</span>
      </a>
      <nav
        aria-label="Navegación principal"
        id="main-navigation"
        className="navigation"
      >
        <a href="#inicio" onClick={() => setOpen(false)}>
          Inicio
        </a>
        <a href="#la-noche" onClick={() => setOpen(false)}>
          La noche
        </a>
        <a href="#la-causa" onClick={() => setOpen(false)}>
          La causa
        </a>
        <a
          className="nav-ticket"
          href={TICKETS_URL}
          onClick={() => setOpen(false)}
        >
          Boletos <Arrow />
        </a>
      </nav>
      <button
        className="menu-toggle"
        ref={menuButton}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = hero.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) =>
      node.classList.toggle("hero-in-view", entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="hero hero-in-view"
      id="inicio"
      aria-labelledby="hero-title"
      ref={hero}
    >
      <Photo
        name="curtains"
        alt=""
        className="hero-background"
        sizes="100vw"
        eager
      />
      <div className="hero-shade" />
      <div className="hero-border" aria-hidden="true" />
      <div className="hero-content">
        <h1 id="hero-title">
          <span className="hero-brand brand">MEDIA CENA ’26</span>
          <img
            className="tagline"
            src="/assets/tonight-for-tomorrow.webp"
            alt="Tonight for Tomorrow"
            width="1800"
            height="456"
            fetchPriority="high"
          />
        </h1>
        <p className="hero-description">
          Una noche para celebrar el presente y abrirle paso al futuro.
        </p>
        <div className="hero-details eyebrow">
          <time dateTime="2026-11-05">05 NOV 2026</time>
          <span aria-hidden="true">·</span>
          <span>7:00 PM — 11:00 PM</span>
          <span aria-hidden="true">·</span>
          <span>DOMO</span>
        </div>
        <TicketLink light />
        <p className="benefit">A beneficio de Líderes del Mañana</p>
      </div>
      <div className="hero-bottom">
        <img
          className="hero-logo hero-logo-tec"
          {...EVENT_LOGOS.tec}
          decoding="async"
        />
        <a
          className="scroll-cue"
          href="#manifiesto"
          aria-label="Descubrir la noche"
        >
          <span>Descubre la noche</span>
          <Arrow down />
        </a>
        <img
          className="hero-logo hero-logo-lideres"
          {...EVENT_LOGOS.lideres}
          decoding="async"
        />
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section
      className="manifesto section-shell"
      id="manifiesto"
      aria-labelledby="manifesto-title"
    >
      <Reveal className="manifesto-copy">
        <p className="eyebrow section-label">05 · 11 · 26</p>
        <h2 id="manifesto-title">
          Hay noches
          <br />
          que duran
          <br />
          unas horas.
          <br />
          <span>
            Otras pueden
            <br />
            cambiar un futuro.
          </span>
        </h2>
      </Reveal>
      <div className="manifesto-aside">
        <Reveal className="arch-frame">
          <Photo
            name="candles"
            alt="Velas encendidas junto a flores de color vino"
            className="manifesto-photo"
            sizes="(max-width: 767px) 80vw, 33vw"
          />
          <span className="image-caption eyebrow">
            UNA NOCHE QUE TRASCIENDE
          </span>
        </Reveal>
        <Reveal>
          <p className="body-copy">
            Media Cena reúne a nuestra comunidad alrededor de una misma mesa y
            un mismo propósito: disfrutar una noche memorable mientras abrimos
            oportunidades para quienes vienen después.
          </p>
          <a className="text-link" href="#la-noche">
            Lo que nos espera <Arrow />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function EventDetails() {
  return (
    <section
      className="event-details section-shell"
      aria-label="Fecha, horario y lugar del evento"
    >
      <Reveal className="event-details-inner">
        <div className="event-date">
          <time dateTime="2026-11-05">
            <span className="event-number">05</span>
            <span className="eyebrow">NOVIEMBRE 2026</span>
          </time>
        </div>
        <span className="event-connector event-at">a las</span>
        <time className="event-time event-start" dateTime="2026-11-05T19:00">
          <span className="event-number">
            7<small>PM</small>
          </span>
        </time>
        <span className="event-connector event-until">hasta</span>
        <time className="event-time event-end" dateTime="2026-11-05T23:00">
          <span className="event-number">
            11<small>PM</small>
          </span>
        </time>
        <span className="event-connector event-in">en</span>
        <div className="event-place">
          <span className="event-venue">Domo</span>
          <span className="event-campus brand">TEC DE MONTERREY</span>
        </div>
      </Reveal>
    </section>
  );
}

function Experience() {
  return (
    <section
      className="experience section-shell"
      id="la-noche"
      aria-labelledby="experience-title"
    >
      <Reveal className="experience-heading">
        <h2 id="experience-title">
          Más que <span>una cena.</span>
        </h2>
        <p className="body-copy">Una noche creada para vivirla juntos.</p>
      </Reveal>
      <div className="experience-gallery">
        <Reveal className="experience-sharing">
          <figure>
            <div className="photo-wrap">
              <Photo
                name="event-community"
                alt="Nuestra comunidad compartiendo la celebración"
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1800px) 30vw, 515px"
              />
            </div>
            <figcaption>
              <h3>
                Alrededor de
                <br />
                la misma mesa.
              </h3>
              <p className="body-copy">
                Una noche para reencontrarnos y conectar como comunidad.
              </p>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="experience-living">
          <figure>
            <div className="photo-wrap">
              <Photo
                name="event-music-1"
                alt="Músicos tocando durante una edición anterior de Media Cena"
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1800px) 30vw, 515px"
              />
            </div>
            <figcaption>
              <h3>
                Momentos que
                <br />
                se quedan contigo.
              </h3>
              <p className="body-copy">
                Cena, música, dinámicas y momentos preparados para hacer de esta
                noche algo especial.
              </p>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="experience-contributing">
          <figure>
            <div className="photo-wrap arch-photo">
              <Photo
                name="event-music-3"
                alt="Integrantes del grupo musical compartiendo el escenario"
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1800px) 30vw, 515px"
              />
            </div>
            <figcaption>
              <h3>
                Un gesto hoy.
                <br />
                Un futuro mañana.
              </h3>
              <p className="body-copy">
                Cada experiencia de la noche suma a una causa que continúa mucho
                después del evento.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Transition() {
  return (
    <section className="transition" aria-label="Tonight for Tomorrow">
      <Photo
        name="roses"
        alt=""
        className="transition-background"
        sizes="100vw"
      />
      <div className="transition-shade" />
      <div className="transition-orbit" aria-hidden="true" />
      <StarField />
      <Reveal>
        <img
          className="transition-tagline"
          src="/assets/tonight-for-tomorrow.webp"
          alt="Tonight for Tomorrow"
          width="1800"
          height="456"
          loading="lazy"
        />
        <p className="body-copy">
          Apostemos por un futuro donde el talento encuentre su oportunidad.
        </p>
      </Reveal>
    </section>
  );
}

function Cause() {
  return (
    <section
      className="cause-section"
      id="la-causa"
      aria-labelledby="cause-title"
    >
      <div className="cause section-shell">
        <Reveal className="cause-photo">
          <div className="photo-wrap">
            <Photo
              name="cause-celebration"
              alt="Jóvenes celebrando juntos con bengalas encendidas"
              className="cause-event-photo"
              sizes="(max-width: 767px) 90vw, 44vw"
            />
          </div>
          <p className="eyebrow image-note">EL FUTURO EMPIEZA CON NOSOTROS.</p>
        </Reveal>
        <Reveal className="cause-copy">
          <h2 id="cause-title">
            <span className="cause-intro">A beneficio de la beca</span>
            Líderes
            <br />
            del Mañana.
          </h2>
          <p className="cause-lead">Una oportunidad puede cambiar una vida.</p>
          <p className="body-copy">
            Lo recaudado durante Media Cena será destinado a apoyar la beca
            Líderes del Mañana, ayudando a abrir nuevas oportunidades educativas
            para jóvenes con talento, liderazgo y deseo de transformar su
            comunidad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalInvitation() {
  return (
    <section
      className="invitation"
      id="boletos"
      aria-labelledby="invitation-title"
    >
      <Photo
        name="event-sparklers-amber-05"
        alt="Celebración con bengalas iluminada en tonos ámbar"
        className="invitation-background"
        sizes="100vw"
      />
      <div className="invitation-shade" />
      <div className="invitation-frame" aria-hidden="true" />
      <Star className="invitation-spark-one" />
      <Star className="invitation-spark-two" variant={3} />
      <Reveal className="invitation-copy">
        <p className="invitation-kicker">Esta noche también lleva tu nombre.</p>
        <h2 id="invitation-title">
          Hay un lugar para ti
          <br />
          <span>en la mesa.</span>
        </h2>
        <div className="invitation-details eyebrow">
          <span>05 NOV 2026</span>
          <span>7:00 PM</span>
          <span>DOMO</span>
        </div>
        <TicketLink light />
        <p className="invitation-impact">
          Tu asistencia también es parte del impacto.
        </p>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <div className="partner-logos" aria-label="Organizadores y aliados">
        {PARTNER_LOGOS.map((logo) => (
          <img key={logo.src} {...logo} loading="lazy" />
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Manifesto />
        <EventDetails />
        <Experience />
        <Transition />
        <Cause />
        <FinalInvitation />
      </main>
      <Footer />
    </>
  );
}
