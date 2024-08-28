---
route: algoritmia
title: Algoritmia
description: Los algoritmos nos enseñan el camino
author: JavGuerra
pubDate: 2023-06-24
coverImage:
  image: '@/assets/img/algoritmo.jpg'
  alt: Organigrama
tags:
    - programación
    - código
    - formación
    - alumnos
---

Cuando tenemos que resolver problemas, ya sea en el ámbito de la programación o en el de nuestras vidas, reflexionamos sobre cómo podemos llegar a una solución ajustada a la medida del reto al que nos enfrentamos. Ese proceso requiere crear un algoritmo eficaz compuesto de una serie de pasos bien definidos. En esta entrada veremos, con algo de detalle, las bases para generar algoritmos de resolución exitosos.

# Definición

Un algoritmo es una secuencia ordenada de **pasos**, descrita sin ambigüedades, que conducen a la **solución de un problema** dado. [+info](https://es.wikipedia.org/wiki/Algoritmo)

Puedes ver este [video](https://youtu.be/U3CGMyjzlvM) para tener una idea más clara de lo que es un algoritmo.

# ¿Qué necesitamos?

Para resolver problemas necesitamos:

1. Lápiz y papel
2. Datos
3. Conocimientos específicos en la materia y capacidad lógica
4. Que el problema sea resoluble
5. Paciencia y compromiso (tolerancia a la frustración)

Mediante lápiz y papel empezamos a esbozar el problema, acercándolo a nuestro entendimiento, incluyendo los datos de que disponemos y los que nos faltan, aplicando los conocimientos que tenemos sobre el tema en cuestión y haciendo uso de la lógica para organizarlo todo. Ciertamente el problema debe tener solución, al menos en un plazo de tiempo asumible, y va a requerir de nosotros implicación para resolverlo.

# Pensamiento lógico

El pensamiento lógico alude a la capacidad para resolver problemas, conceder ideas y formalizar conclusiones de manera coherente y sin contradicciones. Es un modo de pensamiento que relaciona las ideas, hechos, acciones o cosas de forma congruente.
           
## Lógica para la resolución de problemas

La base de la programación es la capacidad para resolver problemas, por eso, de entrada, no debemos enfocarnos en la herramienta (aplicación, lenguaje de programación…), sino en la lógica que nos ayudará a implementar un algoritmo de resolución.

## Pasos

Antes de ofrecer o implementar una solución, debemos:

1. Anotar las indicaciones recibidas sobre el problema: Escuchar, mirar y entender.
2. Preguntar o resolver dudas y completar los datos de los que no dispongamos.
3. Realizar un _briefing_ de condiciones sobre el problema.
4. Pensar el algoritmo (pasos): escribir o dibujar qué vamos a hacer.
5. Verificar el algoritmo.

Oir, ver y anotar no es lo mismo que escuchar, mirar y entender. El proceso de comprender el problema requiere una implicación activa por nuestra parte que nos permita procesar la información que recibimos para entender lo que nos piden, los mensajes implícitos, lo que no se dice, lo que se sobreentiende.
               
## Habilidades del pensamiento¹

Para resolver un problema lógico, serán de ayuda los siguientes procesos cognitivos:

- **Observación**, **comparación** y **descripción**: Fijar la atención para identificar y comunicar características, semejanzas y diferencias del problema con otros casos conocidos por nosotros.
- **Análisis** (descomposición), **clasificación** y **relación**: Dividir el problema en partes más pequeñas para simplificarlo, poder organizarlo y establecer nexos entre las partes.
- **Síntesis** y **reconocimiento de patrones**: Buscar similitudes entre las partes e integrar las características del problema para encontrar soluciones aplicables a este conjunto.
- **Abstracción** y **evaluación**: Centrarse los puntos fundamentales del problema para valorar soluciones generales que sean aplicables al mayor número de casos posibles.

> 1. Bibliografía: Amestoy de Sánchez, M. (2010). Desarrollo de habilidades del pensamiento: procesos básicos del pensamiento. 2ª edición. México: Editorial Trillas.

# El algoritmo

Para la consecución de un algoritmo se llevarán a cabo procesos inteligentes mediante los cuales la información que recibimos es transformada, reducida, elaborada, almacenada, recuperada y empleada en la solución de problemas y la toma de decisiones.

La inteligencia determina nuestra capacidad para adaptarnos: comprender, razonar y emplear recursos de forma efectiva para resolver problemas.
           
## ¿Cómo?

Todo algoritmo consta de tres partes: **entrada → proceso → salida**.

Para llegar a un algoritmo válido, debemos:

1. Hacer una adecuada recogida de información (_briefing_).
2. Tomarnos un tiempo para analizar el problema.
3. Idear una solución que se ajuste al problema.
4. Expresarla en un lenguaje intermedio que nos permita describir el algoritmo.
5. Programar el algoritmo usando un lenguaje de programación.
6. Ejecutar el programa para comprobar si se ha conseguido llegar a la solución.

## Características

Un algoritmo válido debe contar con una serie de características:

- Debe tener un punto de inicio bien definido.
- El algoritmo debe ser general y resolver el problema con distintos datos de entrada.
- Los procesos de entrada y salida descritos deben ser explícitos.
- Ante los mismos datos de entrada se deben obtener siempre los mismos resultados de salida.
- Los pasos deben ser secuenciales y ordenados.
- Cada paso debe quedar claro y no dar pie a dobles interpretaciones.
- El algoritmo debe ser finito respecto a su tamaño (pasos) y tiempo de ejecución.
- Ante varios algoritmos que resuelvan el mismo problema, siempre será preferible el que tenga un camino más corto.

La **práctica** y **la experiencia**, a través de los procesos de ensayo y error, son de gran ayuda en la consecución de algoritmos cada vez más refinados y en menor tiempo.

# Representación algorítmica

**Pseudocódigo**: Es una forma de descripción escrita de algoritmos que usa las convecciones estructurales de un lenguaje de programación. [+info](https://es.wikipedia.org/wiki/Pseudoc%C3%B3digo)  

**Diagrama de flujo**: Es una forma de representación gráfica de algoritmos que usa las convecciones estructurales de un lenguaje de programación. Es un tipo de representación más formal. Se usa para documentar y trabajar en equipo siguiendo normativas concretas. [+info](https://es.wikipedia.org/wiki/Diagrama_de_flujo)

Puedes utilizar la herramienta multiplataforma [PSeInt](https://pseint.sourceforge.net/) para crear pseudocódigo en español y sus diagramas de flujo asociados. La página cuenta con [documentación](https://pseint.sourceforge.net/index.php?page=documentacion.php) en línea para el uso de esta herramienta.

# Error, defecto, fallo

¿De qué hablamos cuando verificamos?

**Error**: equivocación realizada por una persona (en la actividad del desarrollo software).

**Defecto**: resultado de introducir un error en un programa.

**Fallo**: representación del defecto en el comportamiento del sistema.

La detección de errores implica la revisión del código (depuración) y posiblemente la re-evaluación del algoritmo en el que se basa.

# Verificación del algoritmo
> _«La prueba de un programa sólo puede mostrar la presencia de defectos, no su ausencia» - Edsger Wybe Dijkstra_

Un análisis «empírico» es el que se basa en experimentación y observación real de los resultados. Para ello sometemos al algoritmo a una serie de pruebas empíricas en la que, partiendo de ciertos valores de entrada, debemos obtener resultados ajustados a lo esperado o, en caso contrario, detectar defectos en el algoritmo.

Se suele traducir el algoritmo a código informático para efectuar sobre él pruebas denominadas «[de caja blanca](https://es.wikipedia.org/wiki/Pruebas_de_caja_blanca)» y «[de caja negra](https://es.wikipedia.org/wiki/Caja_negra_(sistemas))», y experimentar con valores de entrada de un rango representativo de la solución buscada, y también con un rango de valores límite y de valores aleatorios (_testing_).

Para la integración del algoritmo dentro de un programa de mayores dimensiones se llevan a cabo otro tipo de pruebas, por ejemplo de [integración](https://es.wikipedia.org/wiki/Prueba_de_integraci%C3%B3n).

## Verificación vs. validación

No es lo mismo verificar que validar. El algoritmo puede funcionar correctamente, pero puede que el algoritmo no resuelva correctamente el problema.

**Verificación**: ¿Estamos construyendo correctamente el algoritmo?

**Validación**: ¿Estamos construyendo el algoritmo correcto?

La validación de la solución que propone el algoritmo la efectúa el usuario que necesita resolver el problema una vez implementada la solución. Por eso es muy importante realizar un buen _briefing_ de requisitos, para que la solución resuelva exactamente el problema planteado y no otro.

# Ejercicios

Una vez entendidos los conceptos y pasos descritos anteriormente, te propongo que realices estos ejercicios:

1. Continua la secuencia: 1, 5, 9, 13, 17, ?
2. Relaciona «disciplina» y «éxito».
3. Clasifica e indica la categoría de: manzana, limón, naranja, sandía, pera, piña.
4. Enumera las partes de un coche.
5. ¿Cómo podemos garantizar la calidad de un producto de consumo?
6. Describe un perro.
7. ¿Cómo funciona un ascensor?
8. Inventa una máquina de untar tostadas.
9. Describe las **habilidades cognitivas** implicadas en los ejercicios anteriores.

# Reto: El barco

![Barco](@/assets/img/barco.png)

Intenta realizar el ejercicio considerando las instrucciones siguientes. Tienes la solución para consultar una vez lo hayas completado.

- [Instrucciones para realizar el ejercicio del barco (PDF)](/assets/doc/barco.pdf)  
- [Solución (TXT)](/assets/doc/barco_solucion.txt)  

# Saber más

- [Algortitmos](https://es.khanacademy.org/computing/computer-science/algorithms) - Ciencias de la computación, Habilidades. Khan Academy. Incluye material introductorio y también explicaciones sobre cómo funcionan distintos tipos de algoritmos y los algoritmos de ordenación.  