// Enlace oficial de venta. Todos los botones de boletos utilizan esta configuración.
export const TICKETS_URL =
  "https://eventos.tec.mx/s/lt-event?language=es_MX&id=a5uUG000000RGrtYAG";

export const EVENT_LOGOS = {
  tec: {
    src: "/assets/logo-tec.webp",
    alt: "Tecnológico de Monterrey",
    width: 600,
    height: 159,
  },
  lideres: {
    src: "/assets/logo-lideres.webp",
    alt: "Líderes del Mañana",
    width: 400,
    height: 193,
  },
};

// Logos oficiales que se muestran también en el footer.
export const PARTNER_LOGOS: {
  src: string;
  alt: string;
  width: number;
  height: number;
}[] = [EVENT_LOGOS.tec, EVENT_LOGOS.lideres];
