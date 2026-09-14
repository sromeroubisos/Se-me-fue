# Se me fue

App de gastos e ingresos del mes. Funciona en celular (Android y iPhone) y en computadora (Windows, Mac y Linux). No tiene servidor ni cuentas: los datos de cada persona quedan en su dispositivo.

## Qué hay en la carpeta

| Carpeta / archivo | Qué es |
|---|---|
| `web/` | **La app.** Es lo que se publica en internet. Se instala desde el navegador y funciona sin conexión. |
| `electron/main.js` | La versión de escritorio: abre la misma app en una ventana propia. |
| `scripts/` | Utilidades: generar íconos y levantar un servidor local de prueba. |
| `dist/` | Acá aparece el instalador de Windows cuando lo compilás. |
| `finanzas.html` | La primera versión (un solo archivo). Ya no hace falta para la app. |

## Probarla en tu computadora

```bash
npm install        # solo la primera vez
npm run web        # versión web en http://localhost:5173
npm start          # versión de escritorio
```

> Si `npm start` no abre ninguna ventana desde la terminal de VS Code, es porque VS Code define la variable `ELECTRON_RUN_AS_NODE`. Corré `Remove-Item Env:ELECTRON_RUN_AS_NODE` (PowerShell) y probá de nuevo. A los usuarios no les pasa.

## 1. Publicar la versión web (gratis)

Es lo único imprescindible para lanzar: con un link, cualquiera la instala en su celular o computadora.

**La opción más simple, Netlify Drop:**
1. Entrá a https://app.netlify.com/drop y creá una cuenta gratis.
2. Arrastrá la carpeta `web` a la página.
3. Te da un link del tipo `https://nombre-al-azar.netlify.app`. En *Site configuration → Change site name* lo podés cambiar, por ejemplo a `semefue.netlify.app`.
4. Opcional: conectá un dominio propio (por ejemplo `semefue.app`) en *Domain management*.

**Si conectás el repo de GitHub a Netlify:** no hace falta configurar nada. El archivo `netlify.toml` le indica que publique la carpeta `web`. Si en lugar de eso arrastrás la carpeta entera del proyecto a Netlify Drop, vas a ver «Page not found».

**Alternativas:** GitHub Pages, Cloudflare Pages o Vercel sirven igual. Tienen que servir la carpeta `web` con HTTPS, que es obligatorio para instalarla y para que funcione sin conexión.

### Cómo la instalan los usuarios

- **Android (Chrome):** abren el link y tocan «Instalar app», o *menú ⋮ → Instalar aplicación*.
- **iPhone (Safari):** abren el link, tocan *Compartir → Agregar a inicio*.
- **Windows y Mac (Chrome o Edge):** botón «Instalar app» en la página, o el ícono de instalar en la barra de direcciones.

## 2. Instalador de Windows (.exe)

```bash
npm run dist:win
```

Genera `dist/SeMeFue-Setup-1.0.0.exe`. Ese archivo se puede subir a la web, a Google Drive o a GitHub Releases para que lo descarguen.

**Sobre el aviso de Windows:** el instalador no está firmado, así que Windows SmartScreen va a mostrar «Windows protegió su PC», y hay que tocar *Más información → Ejecutar de todas formas*. Para sacar ese aviso hay dos caminos:
- **Microsoft Store:** publicarla ahí, y la tienda la firma por vos. Revisá el costo vigente de la cuenta de desarrollador al registrarte.
- **Certificado de firma de código:** comprar uno, que se paga por año, y configurarlo en electron-builder.

**Mac y Linux:** `npm run dist:mac` (hay que correrlo en una Mac) y `npm run dist:linux`.

## Publicar una actualización

1. Hacé los cambios en `web/index.html`.
2. Subí el número de versión en `package.json` (por ejemplo `1.0.1`).
3. En `web/sw.js`, cambiá `VERSION` (por ejemplo `semefue-v2`). Sin este cambio, quien ya tiene la app instalada sigue viendo la versión vieja.
4. Volvé a subir la carpeta `web` y, si corresponde, recompilá el `.exe`.

## Antes de lanzar

- [ ] Poner un email de contacto real en `web/privacidad.html`. Ahora dice `contacto@ejemplo.com`.
- [ ] Probarla en un celular real: instalarla, cargar movimientos, cerrarla y volver a abrirla.
- [ ] Probar exportar e importar el respaldo JSON en el celular.

## Más adelante: tiendas de apps

Con la web publicada, https://www.pwabuilder.com genera a partir de tu link los paquetes para **Google Play** (cuenta de desarrollador: USD 25, pago único), **Microsoft Store** e **iOS App Store** (hace falta una Mac y la cuenta de Apple, USD 99 por año). No hay que reescribir la app.

## Datos y privacidad

- Los datos se guardan en el almacenamiento local del navegador o de la app de escritorio, con la clave `semefue.v1`.
- Si el usuario borra los datos del navegador o desinstala la app, se pierden. Por eso la app ofrece «Exportar JSON».
- La versión web y la de escritorio no comparten datos entre sí. Para pasar los datos de una a otra se usa exportar e importar.
