# Imagenes de ejercicios

La aplicacion busca dos imagenes WebP por ejercicio, una por cada fase:

```text
<id-del-ejercicio>-inicio.webp
<id-del-ejercicio>-ejecucion.webp
```

Guarda los archivos en esta carpeta. Los identificadores exactos estan en `js/data.js`.
La tarjeta utiliza la imagen de inicio; el dialogo alterna entre inicio y ejecucion.
Mientras falte una imagen, la aplicacion muestra el diagrama vectorial existente.
Cuando agregues archivos, registra sus nombres en el `Set` exportado por
`js/exercise-images.js`; solo los recursos registrados se cargaran en la pagina.

Identificadores incluidos:

```text
hack-smith-squat
rdl-hamstrings
leg-extension
leg-curl
step-up-quads
bulgarian-quads
hip-adduction
standing-calf-raise
rdl-glutes
hip-thrust
smith-reverse-lunge
single-leg-rdl
step-up-glutes
plated-hyperextension
hip-abduction-alternatives
bulgarian-glutes
cable-crunch
woodchop-low-high
woodchop-high-low
reverse-crunch
ab-wheel
pallof-press
single-arm-pulldown
seated-single-arm-row
one-arm-row
rope-biceps-curl
incline-rear-delt-raise
incline-dumbbell-press
pec-deck
machine-chest-press
push-up
```

## Prompts listos por ejercicio

Ver `prompts-fotos.md` en esta misma carpeta: tiene el prompt completo ya resuelto
(persona, ejercicio y fase) para cada uno de los 62 archivos, listo para copiar y
pegar en Gemini o ChatGPT.

## Prompt base para Gemini o ChatGPT

Genera una imagen fotografica horizontal 7:5 para una guia educativa de gimnasio.
Muestra a una persona adulta realizando **[EJERCICIO]**, en la fase **[INICIO O EJECUCION]**.
Representa la postura y el equipo de forma anatomica y biomecanicamente plausible, con
extremidades completas y sin obstrucciones. Usa una persona adulta de apariencia
deportiva; alterna mujeres y hombres a lo largo de la serie. Viste ropa deportiva
opaca y apropiada para entrenar. Escena en un gimnasio limpio, iluminacion natural
suave, fondo ordenado y discreto, encuadre lateral o tres cuartos que permita ver
claramente la tecnica. Una sola persona y una sola accion congelada. Sin texto,
flechas, marcas, logotipos, marcas de agua, paneles, collage ni equipo adicional.
Mantén el mismo estilo fotografico, encuadre, iluminacion y tratamiento de color
en todas las imagenes de la serie.

Antes de generar cada archivo, sustituye **[EJERCICIO]** por el nombre del ejercicio
y **[INICIO O EJECUCION]** por la posicion inicial o la fase de esfuerzo indicada
por las instrucciones tecnicas del ejercicio. Exporta cada resultado como WebP con
el nombre correspondiente al identificador del ejercicio y la fase.