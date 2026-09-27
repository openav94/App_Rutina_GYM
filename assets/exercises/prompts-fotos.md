# Prompts listos para generar las fotos de ejercicios

Genera estas imágenes con Gemini o ChatGPT (DALL-E) y guárdalas en esta misma carpeta
(`assets/exercises/`) con el nombre exacto indicado en cada bloque, en formato **WebP**.

Cuando tengas los 62 archivos (o los que quieras ir subiendo por tandas), avísame y registro
los nombres en `js/exercise-images.js` para que la app los muestre automáticamente en vez del
diagrama vectorial.

## Plantilla base

Cada prompt sigue esta estructura (ya está resuelta abajo, no necesitas editarla):

> Genera una imagen fotografica horizontal 7:5 para una guia educativa de gimnasio.
> Muestra a una persona adulta realizando **[EJERCICIO]**, en la fase **[FASE]**.
> Representa la postura y el equipo de forma anatomica y biomecanicamente plausible, con
> extremidades completas y sin obstrucciones. Usa una persona adulta de apariencia
> deportiva; alterna mujeres y hombres a lo largo de la serie. Viste ropa deportiva
> opaca y apropiada para entrenar. Escena en un gimnasio limpio, iluminacion natural
> suave, fondo ordenado y discreto, encuadre lateral o tres cuartos que permita ver
> claramente la tecnica. Una sola persona y una sola accion congelada. Sin texto,
> flechas, marcas, logotipos, marcas de agua, paneles, collage ni equipo adicional.
> Mantén el mismo estilo fotografico, encuadre, iluminacion y tratamiento de color
> en todas las imagenes de la serie.

Sugerencia: alterna explícitamente "mujer" / "hombre" en cada prompt según la columna
**Modelo** para que la serie completa quede balanceada (ya viene alternado abajo).

---

## Día 1 · Piernas

### 1. hack-smith-squat — Hack squat o sentadilla en Smith
**Modelo sugerido:** mujer

- Archivo: `hack-smith-squat-inicio.webp`
  Prompt: Genera una imagen fotografica horizontal 7:5 para una guia educativa de gimnasio. Muestra a una mujer adulta de apariencia deportiva realizando hack squat o sentadilla en Smith, en la fase inicial: de pie con los pies al ancho de caderas, rodillas extendidas sin bloquear, espalda apoyada en el respaldo de la maquina hack (o barra sobre la parte alta de la espalda si es Smith), justo antes de iniciar el descenso. Representa la postura y el equipo de forma anatomica y biomecanicamente plausible, con extremidades completas y sin obstrucciones. Viste ropa deportiva opaca y apropiada para entrenar. Escena en un gimnasio limpio, iluminacion natural suave, fondo ordenado y discreto, encuadre lateral o tres cuartos que permita ver claramente la tecnica. Una sola persona y una sola accion congelada. Sin texto, flechas, marcas, logotipos, marcas de agua, paneles, collage ni equipo adicional.
- Archivo: `hack-smith-squat-ejecucion.webp`
  Prompt: Genera una imagen fotografica horizontal 7:5 para una guia educativa de gimnasio. Muestra a la misma mujer adulta realizando hack squat o sentadilla en Smith, en la fase de ejecucion: en la parte baja de la sentadilla, rodillas flexionadas, talones apoyados y pelvis estable, justo antes de comenzar el ascenso. Representa la postura y el equipo de forma anatomica y biomecanicamente plausible, con extremidades completas y sin obstrucciones. Viste ropa deportiva opaca y apropiada para entrenar. Escena en un gimnasio limpio, iluminacion natural suave, fondo ordenado y discreto, encuadre lateral o tres cuartos que permita ver claramente la tecnica. Una sola persona y una sola accion congelada. Sin texto, flechas, marcas, logotipos, marcas de agua, paneles, collage ni equipo adicional. Mantén el mismo estilo fotografico, encuadre, iluminacion y tratamiento de color que la imagen anterior de esta serie.

### 2. rdl-hamstrings — Peso muerto rumano para isquiotibiales
**Modelo sugerido:** hombre

- Archivo: `rdl-hamstrings-inicio.webp`
  Prompt: ...persona: hombre adulto de apariencia deportiva realizando peso muerto rumano para isquiotibiales, fase inicial: de pie sujetando una barra con discos frente a los muslos, pies al ancho de caderas, rodillas suavemente flexionadas, columna neutra, a punto de iniciar el descenso llevando la cadera hacia atras. (Resto de la plantilla base igual que el ejemplo anterior.)
- Archivo: `rdl-hamstrings-ejecucion.webp`
  Prompt: ...el mismo hombre en la fase de ejecucion: cadera desplazada bien hacia atras, torso inclinado hacia delante casi paralelo al suelo, barra cerca de las espinillas, espinillas casi verticales, isquiotibiales en maxima tension, columna neutra. (Resto de la plantilla base igual, manteniendo el mismo estilo que la imagen de inicio.)

### 3. leg-extension — Extensión de cuádriceps
**Modelo sugerido:** mujer
- `leg-extension-inicio.webp`: mujer sentada en una maquina de extension de piernas, espalda y cadera apoyadas, rodillas flexionadas a 90 grados, rodillo apoyado sobre la parte baja de la tibia, manos sujetando las asas.
- `leg-extension-ejecucion.webp`: la misma mujer con las piernas casi completamente extendidas al final del recorrido, cuadriceps contraidos, torso estable contra el respaldo.

### 4. leg-curl — Curl femoral sentado o acostado
**Modelo sugerido:** hombre
- `leg-curl-inicio.webp`: hombre en una maquina de curl femoral (sentado o acostado), piernas extendidas, rodillo apoyado justo encima de los talones, pelvis fija.
- `leg-curl-ejecucion.webp`: el mismo hombre con las rodillas flexionadas llevando los talones hacia los gluteos, en el punto de maxima flexion, pelvis todavia fija.

### 5. step-up-quads — Step-up enfocado en cuádriceps
**Modelo sugerido:** mujer
- `step-up-quads-inicio.webp`: mujer de pie frente a un cajon o banco estable, un pie completo apoyado sobre la plataforma, torso relativamente vertical, a punto de iniciar el ascenso.
- `step-up-quads-ejecucion.webp`: la misma mujer de pie completamente sobre el cajon, pierna de trabajo extendida, torso erguido, terminando el movimiento de subida.

### 6. bulgarian-quads — Sentadilla búlgara para cuádriceps
**Modelo sugerido:** hombre
- `bulgarian-quads-inicio.webp`: hombre de pie frente a un banco, empeine del pie trasero apoyado sobre el banco, pie delantero apoyado por completo, torso erguido, sosteniendo mancuernas, justo antes de descender.
- `bulgarian-quads-ejecucion.webp`: el mismo hombre en la parte baja de la sentadilla bulgara, rodilla delantera flexionada dentro de un rango comodo, torso vertical, pie delantero completamente apoyado.

### 7. hip-adduction — Aductores en máquina
**Modelo sugerido:** mujer
- `hip-adduction-inicio.webp`: mujer sentada en una maquina de aduccion de cadera, espalda apoyada, piernas abiertas con las almohadillas en la cara interna de las rodillas.
- `hip-adduction-ejecucion.webp`: la misma mujer con las piernas cerradas, almohadillas juntas, aductores contraidos, espalda todavia apoyada.

### 8. standing-calf-raise — Elevación de talones de pie
**Modelo sugerido:** hombre
- `standing-calf-raise-inicio.webp`: hombre de pie sobre una plataforma o maquina de pantorrillas, antepie apoyado y talones libres hacia abajo en estiramiento, rodillas extendidas sin bloquear.
- `standing-calf-raise-ejecucion.webp`: el mismo hombre con los talones completamente elevados, de puntillas, pantorrillas contraidas al maximo.

## Día 3 · Glúteos

### 9. rdl-glutes — Peso muerto rumano para glúteos
**Modelo sugerido:** mujer
- `rdl-glutes-inicio.webp`: mujer de pie sujetando una barra con discos frente a los muslos, rodillas ligeramente flexionadas, columna neutra, a punto de iniciar el descenso.
- `rdl-glutes-ejecucion.webp`: la misma mujer con la cadera desplazada bien hacia atras, torso inclinado hacia delante, barra cerca de las piernas, gluteos e isquiotibiales en maxima tension antes de extender la cadera.

### 10. hip-thrust — Hip thrust
**Modelo sugerido:** hombre
- `hip-thrust-inicio.webp`: hombre con la parte superior de la espalda apoyada en un banco, barra acolchada sobre el pliegue de la cadera, cadera baja cerca del suelo, rodillas flexionadas y pies firmes.
- `hip-thrust-ejecucion.webp`: el mismo hombre con la cadera completamente elevada, alineando hombros, cadera y rodillas en una linea recta, gluteos contraidos al maximo.

### 11. smith-reverse-lunge — Zancada inversa en Smith
**Modelo sugerido:** mujer
- `smith-reverse-lunge-inicio.webp`: mujer de pie bajo la barra de una maquina Smith, barra apoyada en la parte alta de la espalda, pies bajo la barra, a punto de dar un paso largo hacia atras.
- `smith-reverse-lunge-ejecucion.webp`: la misma mujer en la parte baja de la zancada inversa, rodilla trasera cerca del suelo, pie delantero firme y estable, torso erguido.

### 12. single-leg-rdl — Peso muerto rumano a una pierna
**Modelo sugerido:** hombre
- `single-leg-rdl-inicio.webp`: hombre de pie sobre una pierna sosteniendo una mancuerna en la mano contraria, rodilla de apoyo suavemente flexionada, torso erguido.
- `single-leg-rdl-ejecucion.webp`: el mismo hombre con el torso inclinado hacia delante casi paralelo al suelo, pierna libre extendida hacia atras como contrapeso, mancuerna cerca del suelo, caderas orientadas hacia abajo.

### 13. step-up-glutes — Step-up enfocado en glúteos
**Modelo sugerido:** mujer
- `step-up-glutes-inicio.webp`: mujer de pie frente a un cajon con el torso ligeramente inclinado desde la cadera, un pie completo apoyado sobre la plataforma.
- `step-up-glutes-ejecucion.webp`: la misma mujer de pie sobre el cajon con la cadera extendida y el gluteo contraido, torso erguido al finalizar el ascenso.

### 14. plated-hyperextension — Hiperextensión con disco
**Modelo sugerido:** hombre
- `plated-hyperextension-inicio.webp`: hombre boca abajo en un banco romano a 45 grados, cadera apoyada sobre la almohadilla y pies fijos, torso flexionado hacia el suelo sosteniendo un disco cerca del pecho.
- `plated-hyperextension-ejecucion.webp`: el mismo hombre con el torso extendido en linea recta con las piernas, gluteos contraidos, disco sostenido contra el pecho, sin hiperextender la zona lumbar.

### 15. hip-abduction-alternatives — Abducción o patada en polea
**Modelo sugerido:** mujer
- `hip-abduction-alternatives-inicio.webp`: mujer sentada en una maquina de abduccion de cadera, piernas juntas, almohadillas apoyadas en la cara externa de las rodillas.
- `hip-abduction-alternatives-ejecucion.webp`: la misma mujer con las piernas separadas al maximo rango comodo, gluteo medio contraido, pelvis estable.

### 16. bulgarian-glutes — Sentadilla búlgara para glúteos
**Modelo sugerido:** hombre
- `bulgarian-glutes-inicio.webp`: hombre de pie frente a un banco, empeine del pie trasero apoyado sobre el banco, pie delantero mas alejado del banco que en una sentadilla bulgara estandar, torso ligeramente inclinado desde la cadera, sosteniendo mancuernas.
- `bulgarian-glutes-ejecucion.webp`: el mismo hombre en la parte baja de la zancada bulgara con la cadera ligeramente hacia atras, rodilla delantera alineada, pie delantero completamente apoyado.

## Día 2 · Espalda + abdomen + pecho

### 17. cable-crunch — Crunch en polea con cuerda
**Modelo sugerido:** mujer
- `cable-crunch-inicio.webp`: mujer arrodillada frente a una polea alta, sosteniendo una cuerda junto a las sienes con los codos altos, torso erguido.
- `cable-crunch-ejecucion.webp`: la misma mujer con el torso flexionado hacia abajo, codos cerca de las rodillas, abdomen contraido al maximo, pelvis fija.

### 18. woodchop-low-high — Giro diagonal en polea: abajo-arriba
**Modelo sugerido:** hombre
- `woodchop-low-high-inicio.webp`: hombre de pie de lado frente a una polea baja, sosteniendo una manija con ambas manos cerca de la cadera mas proxima a la polea, base estable.
- `woodchop-low-high-ejecucion.webp`: el mismo hombre con el torso y la cadera rotados, manos llevadas en diagonal hacia arriba por encima del hombro contrario, cuerpo girando como una unidad.

### 19. woodchop-high-low — Giro diagonal en polea: arriba-abajo
**Modelo sugerido:** mujer
- `woodchop-high-low-inicio.webp`: mujer de pie de lado frente a una polea alta, sosteniendo una manija con ambas manos cerca del hombro mas proximo a la polea.
- `woodchop-high-low-ejecucion.webp`: la misma mujer con el torso y la cadera rotados, manos llevadas en diagonal hacia abajo, hacia la cadera contraria, base firme.

### 20. reverse-crunch — Crunch inverso en banco plano
**Modelo sugerido:** hombre
- `reverse-crunch-inicio.webp`: hombre acostado boca arriba en un banco plano, sujetando el banco por detras de la cabeza, caderas y rodillas flexionadas a unos 90 grados.
- `reverse-crunch-ejecucion.webp`: el mismo hombre con las rodillas llevadas hacia el pecho y la pelvis ligeramente elevada del banco, abdomen contraido.

### 21. ab-wheel — Rueda abdominal
**Modelo sugerido:** mujer
- `ab-wheel-inicio.webp`: mujer arrodillada sobre una colchoneta, manos sobre una rueda abdominal justo frente a las rodillas, pelvis ligeramente recogida.
- `ab-wheel-ejecucion.webp`: la misma mujer con el cuerpo extendido hacia delante en una linea larga, brazos estirados, abdomen en maxima tension, cadera sin tocar el suelo.

### 22. pallof-press — Pallof press
**Modelo sugerido:** hombre
- `pallof-press-inicio.webp`: hombre de pie de lado frente a una polea a la altura del esternon, ambas manos juntas sosteniendo la manija frente al pecho, rodillas suaves.
- `pallof-press-ejecucion.webp`: el mismo hombre con los brazos completamente extendidos al frente en linea recta, resistiendo la rotacion del cable, hombros y caderas alineados.

### 23. single-arm-pulldown — Jalón unilateral con agarre neutro
**Modelo sugerido:** mujer
- `single-arm-pulldown-inicio.webp`: mujer sentada o arrodillada bajo una polea alta, sosteniendo una manija individual con el brazo extendido hacia arriba, palma orientada hacia dentro.
- `single-arm-pulldown-ejecucion.webp`: la misma mujer con el codo llevado hacia el costado del cuerpo, mano cerca de la cadera, dorsal contraido, torso estable.

### 24. seated-single-arm-row — Remo sentado unilateral en polea
**Modelo sugerido:** hombre
- `seated-single-arm-row-inicio.webp`: hombre sentado frente a una polea baja, pies apoyados, brazo extendido hacia delante sosteniendo una manija individual, columna larga.
- `seated-single-arm-row-ejecucion.webp`: el mismo hombre con el codo llevado hacia atras cerca de la cadera, escapula retraida, torso estable sin balanceo.

### 25. one-arm-row — Remo unilateral con mancuerna
**Modelo sugerido:** mujer
- `one-arm-row-inicio.webp`: mujer apoyada con una mano y una rodilla sobre un banco, brazo libre extendido hacia abajo sosteniendo una mancuerna, espalda neutra.
- `one-arm-row-ejecucion.webp`: la misma mujer con el codo flexionado llevando la mancuerna hacia la cadera, espalda contraida, torso estable como una mesa.

### 26. rope-biceps-curl — Curl de bíceps con cuerda
**Modelo sugerido:** hombre
- `rope-biceps-curl-inicio.webp`: hombre de pie erguido frente a una polea baja, sosteniendo una cuerda con agarre neutro, brazos extendidos hacia abajo, codos fijos junto al torso.
- `rope-biceps-curl-ejecucion.webp`: el mismo hombre con los codos flexionados llevando la cuerda hacia los hombros, biceps contraido, codos todavia junto al torso.

### 27. incline-rear-delt-raise — Elevación posterior en banco inclinado
**Modelo sugerido:** mujer
- `incline-rear-delt-raise-inicio.webp`: mujer acostada boca abajo sobre un banco inclinado, pies firmes en el suelo, brazos colgando hacia abajo sosteniendo mancuernas ligeras.
- `incline-rear-delt-raise-ejecucion.webp`: la misma mujer con los brazos elevados hacia los lados a la altura de los hombros, deltoides posterior contraido, pecho apoyado en el banco.

### 28. incline-dumbbell-press — Press inclinado con mancuernas
**Modelo sugerido:** hombre
- `incline-dumbbell-press-inicio.webp`: hombre acostado en un banco inclinado entre 25 y 40 grados, mancuernas a los lados del pecho, codos flexionados, munecas neutras.
- `incline-dumbbell-press-ejecucion.webp`: el mismo hombre con los brazos extendidos hacia arriba sosteniendo las mancuernas por encima del pecho, pectorales contraidos.

### 29. pec-deck — Contractor de pectorales
**Modelo sugerido:** mujer
- `pec-deck-inicio.webp`: mujer sentada en una maquina pec deck, espalda y cabeza apoyadas, brazos abiertos hacia los lados sosteniendo las asas a la altura del pecho.
- `pec-deck-ejecucion.webp`: la misma mujer con los brazos cerrados al frente, asas juntas, pectorales contraidos, espalda todavia apoyada.

### 30. machine-chest-press — Press de pecho en máquina
**Modelo sugerido:** hombre
- `machine-chest-press-inicio.webp`: hombre sentado en una maquina de press de pecho, asas a la altura media del pecho, codos flexionados hacia atras, pies firmes.
- `machine-chest-press-ejecucion.webp`: el mismo hombre con los brazos extendidos hacia delante, codos casi extendidos sin bloquear, pectorales contraidos.

### 31. push-up — Push-up o flexión de brazos
**Modelo sugerido:** mujer
- `push-up-inicio.webp`: mujer en posicion de plancha alta, manos algo mas abiertas que los hombros, brazos extendidos, cuerpo en linea recta desde la cabeza hasta los talones, vista lateral.
- `push-up-ejecucion.webp`: la misma mujer en la parte baja de la flexion, pecho cerca del suelo entre las manos, codos flexionados entre 30 y 60 grados del torso, cadera alineada con el resto del cuerpo.

---

## Notas para generar de forma consistente

- Genera primero la imagen de **inicio** de un ejercicio y luego pide "la misma persona,
  mismo estilo, en esta otra fase: ..." para la de **ejecución** — así el modelo mantiene
  apariencia, ropa y encuadre coherentes entre ambas fotos del mismo ejercicio.
- Exporta/convierte cada imagen a **WebP** antes de guardarla (en Gemini/ChatGPT normalmente
  descargas PNG/JPEG; puedes convertir con cualquier conversor online o con `cwebp`).
- Respeta el nombre de archivo exacto de cada bullet — la app busca ese nombre literal.
- No hace falta hacer las 62 de una sola vez: en cuanto tengas un lote, dime cuáles subiste
  y las registro en `js/exercise-images.js`.
