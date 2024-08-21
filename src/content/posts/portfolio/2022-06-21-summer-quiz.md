---
route: summer-quiz
title: Summer Quiz
description: Un juego que obtiene sus preguntas a través de una API.
info: Juego SPA de preguntas y respuestas realizado en JavaScript Vanilla, que obtiene datos de una API y guarda resultados en Local Storage.
author: JavGuerra
pubDate: 2022-06-21
coverImage:
  image: '@/assets/portfolio/summer-quiz.png'
  alt: Summer Quiz
tags:
    - web
    - código
    - HTML
    - CSS
    - JavaScript
    - juego
    - accesibilidad
    - responsive 
---

«Fun 10-question quiz to test your knowledge». **Práctica final del módulo de JavaScript avanzado del Bootcamp de FSWD**, por Alejandro Rodríguez y Javier Guerra.

# El juego

[<button>Acceder al juego</button>](https://javguerra.github.io/summer-quiz/)

El [bootcamp de FSWD](/blog/beca-santander-fswd) que estoy realizando, consta de varios módulos. El de JavaScript avanzado termina ahora, y este es el ejercicio final de esta fase de mi formación.

Se trata de un ejercicio que comprende todos los conceptos generales aprendidos, y que, como siempre, incluye alguna que otra cosa más allá del enunciado.

# Enunciado

> El ejercicio consiste en elaborar una SPA que consulte una API de preguntas y respuestas y que cuente con tres partes: 1. bienvenida y gráficas de estadísticas, 2. mostrar diez preguntas, una a una, con sus respectivas opciones de respuesta, y 3. página de resultado.

Conceptualmente hablando, las estadísticas de la parte 1 bien podrían aparecer en la fase 3, la de resultados, pero este es, en resumidas cuentas, el enunciado.

Algunas características destacables del enunciado son que la aplicación se debe ejecutar en una sola página web (SPA), que realiza consultas a una API, que guarda las puntuaciones en localStorage y que muestra estadísticas. Esta última parte, aunque accesoria, pues no se ha visto en el bootcamp, supuso un reto interesante, ya que ha dado para escribir varias entradas previas en este blog: [Spinner loader asíncrono](/blog/spinner-loader-asincrono), [Creación de un contador de resultados](/blog/ontador-resultados), [Gráfica de lineas dinámica con SVG](/blog/grafica-lineas) y [Cargar SVG dinámicamente](/blog/carga-svg), todas ellas técnicas incluidas en el ejercicio.

Es un buen ejercicio para practicar, e igualmente espero que puedas disfrutarlo jugándolo. Este ejercicio lo he llevado a cabo con el apoyo del compañero Alejando.

# Características destacables

## Operativa de la aplicación

* Aplicación de una sola página (SPA).
* Integración de 25 preguntas propias en un JSON. Usa una en cada partida.
* Hace uso de localStorage pata guardar y leer las puntuaciones.
* Gráficas dinámicas en SVG de elaboración propia y uso de DOM para su gestión.  
    * Gráfica de líneas para mostrar estadísticas. Manejo del id ‘theline’.  
    * Contador visual para mostrar el resultado final del quiz. Manejo del id ‘hand’.
* Animaciones CSS de gráfica de líneas y personajes.
* Carga de las gráficas __SVG__ al inicio de la app con ```fetch``` para hacer uso de los ```id``` que incorporan y poder así hacer cambios dinámicos. Con ```<img>``` esto no funcionaría.
* Los posibles errores se muestran a través de una ventana modal ```<dialog>```.
* Usa JavaScript puro (Vanilla JS) sin _frameworks_.
* Recopila librería de funciones propia en el fichero ```js/functions.js```
* Repositorio compartido en Github y web alojada en Github pages.

## Usabilidad
* La web implementa los criterios del estándar XHTML (revisado con [Nu Html Checker](https://html5.validator.nu/)).
* El diseño es adaptable (_responsive_) según el dispositivo.
* Es accesible (revisado con el complemento del navegador [WAVE](https://wave.webaim.org/)):
    * Hace uso de etiquetas __WAI-ARIA__ para describir eventos interactivos.
* Tiene temática coherente y un cuidado aspecto visual trabajado con CSS.
* Interfaz en inglés acorde al contenido de la API.
* Emplea un ‘spin’ asíncrono para informar al usuario de que se está gestionado la consultas.
* Los botones no se activan hasta que terminan los procesos asíncronos: cargas, consultas...
* La selección de las opciones de cada pregunta se hace a través de botones de radio cuyo aspecto modificado con CSS simula el aspecto de botones de selección.
* Muestra barra de puntuaciones medias y barra de progreso del cuestionario.
* Implementa el protocolo [_Open Graph_](https://ogp.me/) (en el ```head```) para la correcta inserción de la web en RRSS.
* Es compatible con _Progessive Web Aplication_ (PWA) a través de fichero manifest.json, por lo que la página puede ser instalada en dispositivos móviles como una web app.
* Se dispone de un código QR para acceso rápido a la web a través de dispositivos móviles.
* Ha sido probada con los navegadores web Firefox y Chrome.
* Extra: La consola del navegador muestra ayuda con las respuestas.

# Enlaces

![QR Code](https://javguerra.github.io/summer-quiz/assets/img/qrcode.svg)

[<button>Acceder al juego</button>](https://javguerra.github.io/summer-quiz/)

* [Repositorio / Codigo](https://github.com/JavGuerra/summer-quiz)
* [Spinner loader asíncrono](/blog/spinner-loader-asincrono)
* [Creación de un contador de resultados](/blog/contador-resultados)
* [Gráfica de lineas dinámica con SVG](/blog/grafica-lineas)
* [Cargar SVG dinámicamente](/blog/carga-svg)