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

## Configuración

- `src/config.ts`: reemplazar `TICKETS_URL = '#'` por el enlace oficial. Todos los CTA comparten esa constante. Mientras no exista, los CTA llevan a la sección final y el botón de compra muestra un aviso accesible de venta próxima.
- En el mismo archivo, `PARTNER_LOGOS` permite agregar los logos oficiales. La zona se renderiza solo cuando existen assets, sin marcas inventadas.
- `src/App.tsx`: contenido y componentes de las secciones.
- `src/styles.css`: paleta, tipografías, composiciones y responsive.

## Assets elegidos

Los seis originales se conservan sin cambios en `images/`. Las versiones WebP y cuatro tamaños responsive se encuentran en `public/assets/`. Para regenerarlos: `npm run assets`.

| Original                                  | Contenido                                      | Uso                                                                     |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| `fondoCortinasRojas.jpg`                  | Cortinas rojas con sombra                      | Hero a pantalla completa, con overlay y zoom lento                      |
| `tonightForTomorrow.png`                  | Lettering blanco y estrellas con transparencia | Protagonista del hero y transición burgundy; se preserva la ilustración |
| `klara-kulikova-rYzppyjo4DQ-unsplash.jpg` | Velas y flores color vino                      | Manifiesto, dentro de un marco vertical en arco                         |
| `katie-puzatova-w9hsioE2Zc4-unsplash.jpg` | Mesa con rosas, velas y copas                  | Experiencia «Compartir», composición vertical                           |
| `fondoRosasRojas.jpg`                     | Rosas rojas                                    | Experiencia «Contribuir», recorte en arco                               |
| `tanya-prodaan-7LVZt5YG69g-unsplash.jpg`  | Amigos compartiendo una cena cálida            | Experiencia «Vivir», causa y comunidad, con diferentes recortes         |

No quedaron assets sin utilizar. La foto de personas es la única fotografía humana disponible; por eso se reutiliza deliberadamente. Las fotografías ambientan la experiencia y no se presentan como documentación de un evento anterior.

## Verificación

Con el servidor ejecutándose en el puerto 5173:

```sh
npm run check
```

La revisión con Playwright utiliza Edge instalado en Windows (o Chromium de Playwright si Edge no está instalado). Comprueba 375, 768, 1024, 1440 y 1920 px, carga de assets, overflow, consola, anchors, menú móvil, aviso de boletos, accesibilidad con axe y reducción de movimiento. Los resultados y capturas se guardan en `.work/`, fuera del código de producción. La variable opcional `SITE_URL` permite revisar el servidor de producción de `npm run preview`.

## Movimiento y accesibilidad

Revelados mediante IntersectionObserver y CSS, sin librería de animaciones. El zoom del hero se pausa fuera de la pantalla. `prefers-reduced-motion` desactiva animaciones y scroll suave. Navegación semántica, enlace para saltar al contenido, focus visible y menú móvil con estado ARIA y cierre por Escape.
