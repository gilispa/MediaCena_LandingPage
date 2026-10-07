# Media Cena ’26

Landing editorial en español. React + Vite + TypeScript, estilos propios y fuentes locales (Poppins, Italiana y Manrope). No requiere servicios externos para mostrar imágenes o tipografías.

## Ejecutar

```sh
npm install
npm run dev
```

En PowerShell con ejecución de scripts restringida, utiliza `npm.cmd` en lugar de `npm`.

```sh
npm run build
npm run preview
```

## Publicar en Netlify

### Subida manual

1. Ejecuta `npm run build` (o `npm.cmd run build` en PowerShell).
2. Abre [Netlify Drop](https://app.netlify.com/drop) con tu cuenta.
3. Arrastra la carpeta `dist` generada. Esa carpeta contiene la página lista para publicar, incluidas imágenes y fuentes.

Para actualizar la página, vuelve a compilar y sube la nueva carpeta `dist` en el área de despliegues del mismo proyecto de Netlify.

### Despliegue desde GitHub

Sube el proyecto a tu repositorio, incluidos `package-lock.json`, `netlify.toml` y los archivos de `public/`. En Netlify, importa ese repositorio. La configuración de `netlify.toml` establece:

- Comando de compilación: `npm run build`.
- Carpeta de publicación: `dist`.
- Node.js: versión 22.
- Directorio base: raíz del repositorio, si allí está `package.json`.

No necesita variables de entorno para la versión actual. Las imágenes optimizadas ya están en `public/assets/`; no hace falta ejecutar los scripts de preparación de imágenes en Netlify. Cada cambio enviado a la rama de producción generará un nuevo despliegue.

Referencia: [Vite en Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/).

## Configuración

- `src/config.ts`: contiene el enlace oficial de venta en `TICKETS_URL`. Los botones del hero, la navegación y el cierre utilizan esa misma constante.
- En el mismo archivo, `EVENT_LOGOS` contiene los logos oficiales del Tec y Líderes del Mañana para la portada; `PARTNER_LOGOS` los muestra también en el footer.
- `src/App.tsx`: contenido y componentes de las secciones.
- `src/styles.css`: paleta, tipografías, composiciones y responsive.
- Las siete fotos de eventos pasados tienen copias JPEG en `images/` terminadas en `_color_vino.jpg`. Incluyen solo el tratamiento de color aprobado y conservan la luminosidad original. `npm run assets:color` regenera las copias; `npm run assets` prepara sus cuatro tamaños WebP para los nombres `event-*` del componente `Photo`. El color está incorporado en los archivos y no se vuelve a aplicar con CSS. Los originales se conservan; `images/filtro_color_vino.json` registra el tratamiento y la comprobación de luminosidad.

## Assets elegidos

Los dieciocho originales se conservan sin cambios en `images/`. Las fotografías WebP en cuatro tamaños responsive, las tres estrellas y los dos logos optimizados se encuentran en `public/assets/`. Para regenerarlos: `npm run assets`. Los logos conservan su transparencia y se recorta solo el margen vacío. El favicon PNG se genera a partir de `estrella2.png`.

| Original                                  | Contenido                                      | Uso                                                                                       |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `fondoCortinasRojas.jpg`                  | Cortinas rojas con sombra                      | Hero a pantalla completa, con overlay y zoom lento                                        |
| `tonightForTomorrow.png`                  | Lettering blanco y estrellas con transparencia | Protagonista del hero y transición sobre rosas; se preserva la ilustración                |
| `klara-kulikova-rYzppyjo4DQ-unsplash.jpg` | Velas y flores color vino                      | Manifiesto, dentro de un marco vertical en arco                                           |
| `katie-puzatova-w9hsioE2Zc4-unsplash.jpg` | Mesa con rosas, velas y copas                  | Experiencia «Compartir», composición vertical                                             |
| `fondoRosasRojas.jpg`                     | Rosas rojas                                    | Experiencia «Contribuir» en arco y fondo de la transición con degradado oscuro            |
| `tanya-prodaan-7LVZt5YG69g-unsplash.jpg`  | Amigos compartiendo una cena cálida            | Experiencia «Vivir», causa y comunidad, con diferentes recortes                           |
| `estrella1.png`                           | Estrella de cuatro puntas                      | Un acento discreto en el fondo de la experiencia                                          |
| `estrella2.png`                           | Estrella de ocho puntas                        | Estrella predominante: hero, manifiesto, experiencia, transición, causa, cierre y favicon |
| `estrella3.png`                           | Estrella de múltiples puntas                   | Segunda en frecuencia: hero, manifiesto, experiencia, transición, cierre y footer         |

La landing conserva la selección actual de fotografías. Las siete fotos reales de eventos pasados están preparadas para incorporarlas con el filtro aprobado. La vista `.work/catalogo-fotos/aplicadas.html` muestra las siete con el tratamiento de producción.

## Verificación

Con el servidor ejecutándose en el puerto 5173:

```sh
npm run check
```

La revisión con Playwright utiliza Edge instalado en Windows (o Chromium de Playwright si Edge no está instalado). Comprueba 320, 375, 390, 430, 768, 1024, 1440 y 1920 px, carga de assets, overflow, consola, anchors, menú móvil, los tres enlaces oficiales de boletos, orden vertical de los datos en celular, accesibilidad con axe y reducción de movimiento. Los tamaños de celular usan viewport de 812 px de altura y emulación de touch. Los resultados y capturas se guardan en `.work/`, fuera del código de producción. La variable opcional `SITE_URL` permite revisar el servidor de producción de `npm run preview`.

## Movimiento y accesibilidad

Revelados mediante IntersectionObserver y CSS, sin librería de animaciones. El zoom del hero se pausa fuera de la pantalla. `prefers-reduced-motion` desactiva animaciones y scroll suave. Navegación semántica, enlace para saltar al contenido, focus visible y menú móvil con estado ARIA y cierre por Escape.
