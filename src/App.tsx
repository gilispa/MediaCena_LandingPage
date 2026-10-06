import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PARTNER_LOGOS, TICKETS_URL } from "./config";

type PhotoName = "curtains" | "roses" | "table" | "candles" | "community";

function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`star ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 0C21.9 14.1 25.9 18.1 40 20C25.9 21.9 21.9 25.9 20 40C18.1 25.9 14.1 21.9 0 20C14.1 18.1 18.1 14.1 20 0Z"
        fill="currentColor"
      />
    </svg>
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
  }[name];
  return (
    <img
      className={`photo ${className}`}
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

function TicketLink({
  light = false,
  short = false,
}: {
  light?: boolean;
  short?: boolean;
}) {
  return (
    <a
      className={`ticket-link ${light ? "ticket-link-light" : ""}`}
      href={TICKETS_URL === "#" ? "#boletos" : TICKETS_URL}
    >
      {short ? "Boletos" : "Comprar boletos"}
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
        <a href="#la-noche" onClick={() => setOpen(false)}>
          La noche
        </a>
        <a href="#la-causa" onClick={() => setOpen(false)}>
          La causa
        </a>
        <a
          className="nav-ticket"
          href="#boletos"
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
        <p className="eyebrow hero-edition">
          <span /> UNA NOCHE. UN MAÑANA. <span />
        </p>
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
          Una noche para celebrar el presente
          <br />y abrirle paso al futuro.
        </p>
        <div className="hero-details eyebrow">
          <time dateTime="2026-11-05">05 NOV 2026</time>
          <Star />
          <span>7:00 PM — 11:00 PM</span>
          <Star />
          <span>DOMO</span>
        </div>
        <TicketLink light />
        <p className="benefit">A beneficio de Líderes del Mañana</p>
      </div>
      <div className="hero-bottom">
        <span className="eyebrow">
          EL PRESENTE NOS REÚNE.
          <br />
          EL FUTURO NOS INSPIRA.
        </span>
        <a
          className="scroll-cue"
          href="#manifiesto"
          aria-label="Descubrir la noche"
        >
          <span>Descubre la noche</span>
          <Arrow down />
        </a>
        <span className="eyebrow hero-bottom-year">
          05 NOVIEMBRE 2026
          <br />
          TEC DE MONTERREY
        </span>
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
        <p className="eyebrow section-label">
          <Star />
          05 · 11 · 26
        </p>
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
          <span className="eyebrow">LA FECHA</span>
          <time dateTime="2026-11-05">
            <span className="event-number">05</span>
            <span className="eyebrow">NOVIEMBRE · 2026</span>
          </time>
        </div>
        <div className="event-time">
          <span className="eyebrow">EL ENCUENTRO</span>
          <span className="event-number">
            7:00<small>PM</small>
          </span>
          <span className="eyebrow">EL INICIO DE LA NOCHE</span>
        </div>
        <div className="event-place">
          <Star />
          <span className="event-venue">Domo</span>
          <span className="eyebrow">TEC DE MONTERREY</span>
        </div>
        <div className="event-time">
          <span className="eyebrow">HASTA</span>
          <span className="event-number">
            11:00<small>PM</small>
          </span>
          <span className="eyebrow">EL ÚLTIMO MOMENTO</span>
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
        <p className="eyebrow section-label">
          <Star />
          LA NOCHE
        </p>
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
                name="table"
                alt="Una mesa preparada con rosas oscuras, copas y velas"
                sizes="(max-width: 767px) 90vw, 39vw"
              />
            </div>
            <figcaption>
              <span className="eyebrow photo-index">01 / COMPARTIR</span>
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
                name="community"
                alt="Amigos compartiendo una cena bajo una iluminación cálida"
                sizes="(max-width: 767px) 90vw, 43vw"
              />
            </div>
            <figcaption>
              <span className="eyebrow photo-index">02 / VIVIR</span>
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
                name="roses"
                alt="Detalle de pétalos de rosas rojas"
                sizes="(max-width: 767px) 65vw, 24vw"
              />
            </div>
            <figcaption>
              <span className="eyebrow photo-index">03 / CONTRIBUIR</span>
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
        <div className="gallery-ornament" aria-hidden="true">
          <Star />
          <span>
            JUNTOS,
            <br />
            TODO TIENE
            <br />
            OTRO SENTIDO.
          </span>
        </div>
      </div>
    </section>
  );
}

function Transition() {
  return (
    <section className="transition" aria-label="Tonight for Tomorrow">
      <div className="transition-orbit" aria-hidden="true" />
      <Star className="transition-star-one" />
      <Star className="transition-star-two" />
      <Reveal>
        <p className="eyebrow">EL SENTIDO DE ESTA NOCHE</p>
        <img
          className="transition-tagline"
          src="/assets/tonight-for-tomorrow.webp"
          alt="Tonight for Tomorrow"
          width="1800"
          height="456"
          loading="lazy"
        />
        <p className="body-copy">
          Una noche para celebrar el presente y apostar por
          <br className="desktop-break" /> quienes construirán el mañana.
        </p>
      </Reveal>
    </section>
  );
}

function Cause() {
  return (
    <section
      className="cause section-shell"
      id="la-causa"
      aria-labelledby="cause-title"
    >
      <Reveal className="cause-photo">
        <div className="photo-wrap">
          <Photo
            name="community"
            alt="Una comunidad reunida alrededor de una cena a la luz de las velas"
            sizes="(max-width: 767px) 90vw, 44vw"
          />
        </div>
        <p className="eyebrow image-note">EL FUTURO EMPIEZA CON NOSOTROS.</p>
      </Reveal>
      <Reveal className="cause-copy">
        <p className="eyebrow section-label">
          <Star />
          POR QUÉ ESTAMOS AQUÍ
        </p>
        <h2 id="cause-title">
          Una oportunidad
          <br />
          puede cambiar
          <br />
          <span>una vida.</span>
        </h2>
        <p className="body-copy">
          Lo recaudado durante Media Cena será destinado a apoyar la beca
          Líderes del Mañana, ayudando a abrir nuevas oportunidades educativas
          para jóvenes con talento, liderazgo y deseo de transformar su
          comunidad.
        </p>
        <div className="cause-signature">
          <Star />
          <span>
            A beneficio de
            <br />
            <strong>Líderes del Mañana</strong>
          </span>
        </div>
      </Reveal>
    </section>
  );
}

function Community() {
  return (
    <section className="community" aria-labelledby="community-title">
      <Photo
        name="community"
        alt="Personas reunidas alrededor de una mesa para compartir una noche especial"
        sizes="100vw"
      />
      <div className="community-shade" />
      <Reveal className="community-copy">
        <p className="eyebrow">UNA MISMA MESA. UNA MISMA CAUSA.</p>
        <h2 id="community-title">
          Esta noche también
          <br />
          lleva <span>tu nombre.</span>
        </h2>
        <p className="body-copy">
          Estudiantes, colaboradores, amigos y miembros de nuestra comunidad
          reunidos por una misma causa.
        </p>
        <Star />
      </Reveal>
    </section>
  );
}

function FinalInvitation() {
  const [showNotice, setShowNotice] = useState(false);
  return (
    <section
      className="invitation"
      id="boletos"
      aria-labelledby="invitation-title"
    >
      <div className="invitation-frame" aria-hidden="true" />
      <Reveal>
        <p className="brand">MEDIA CENA ’26</p>
        <Star />
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
        {TICKETS_URL === "#" ? (
          <button
            className="ticket-link"
            aria-controls="ticket-notice"
            aria-expanded={showNotice}
            onClick={() => setShowNotice(true)}
          >
            Comprar boletos
            <Arrow />
          </button>
        ) : (
          <TicketLink />
        )}
        <p className="invitation-impact">
          Tu asistencia también es parte del impacto.
        </p>
        <div className="ticket-notice" id="ticket-notice" role="status">
          {showNotice && (
            <p>La venta de boletos estará disponible próximamente.</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <div className="footer-top">
        <div>
          <a className="brand" href="#inicio">
            MEDIA CENA ’26
          </a>
          <p className="footer-tagline">Tonight for Tomorrow.</p>
        </div>
        <Star />
        <div className="footer-purpose">
          <p>Tecnológico de Monterrey</p>
          <p>A beneficio de Líderes del Mañana</p>
        </div>
      </div>
      {PARTNER_LOGOS.length > 0 && (
        <div className="partner-logos" aria-label="Organizadores y aliados">
          {PARTNER_LOGOS.map((logo) => (
            <img key={logo.src} {...logo} loading="lazy" />
          ))}
        </div>
      )}
      <div className="footer-bottom">
        <span className="eyebrow">05 DE NOVIEMBRE DE 2026 · DOMO</span>
        <a href="#inicio" className="text-link">
          Volver al inicio <Arrow down />
        </a>
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
        <Community />
        <FinalInvitation />
      </main>
      <Footer />
    </>
  );
}
