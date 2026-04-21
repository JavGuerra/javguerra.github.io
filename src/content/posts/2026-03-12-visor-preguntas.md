---
route: visor-preguntas
title: Visor para banco de preguntas
description: Aplicación web para recorrer y estudiar exámenes a través de sus preguntas y respuestas.
author: JavGuerra
pubDate: 2026-03-12
coverImage:
  image: '@/assets/img/visor-preguntas.png'
  alt: Screenshot
tags:
    - JavaScript
    - HTML
    - CSS
    - código
    - herramienta
---

Recientemente me presenté a una certificación en mi trabajo, y contábamos con un banco de preguntas y respuestas para repasar. Es frecuente también que, en nuevos exámenes se incluyan preguntas de exámenes anteriores, por lo que decidi prepararme una aplicación para estudiar y aprender las respuestas a las preguntas. En esta entrada verás cómo funciona y podrás acceder al código para descargarlo.

## El programa visor

El programa visor se ejecuta en un navegador web, y sirve para mostrar, de forma consecutiva o aleatoriamente, un conjunto de preguntas y respuestas para estudiarlas. Para ello:

- Usa `←` / `→` para navegar por las preguntas.
- Pulsa `S` para mostrar/ocultar la solución.
- Pulsa `R` para barajar las preguntas.
- Recarga la página para ordenarlas.

Mediante este programa es posible repasar las respuestas a las preguntas de los exámenes si mantienes activada la función de mostrar solución, reteniendo de esta forma la respuesta correcta, o bien recorrer las preguntas para intentar acertar las respuestas y ver inmediatamente el resultado mostrando/ocultando la solución a la pregunta.

[<button>Descargar el visor de preguntas</button>](https://github.com/JavGuerra/visor-preguntas) | [<button>Ver el programa visor en linea</button>](https://javguerra.github.io/visor-preguntas/).

El programa requiere que esté habilitado el soporte JavaScript en el navegador.

Eres libre de usarlo, modificarlo y redistribuirlo bajo las condiciones de la licencia es GPL v.3.

## Estructura de los datos

Al abrir la aplicación, esta importa un fichero llamado `bancoDePreguntas.js` que contiene:

- Cada una de las preguntas del banco de preguntas
- Las respuestas posibles asociadas a cada pregunta
- El número de respuesta correcta de entre las respuestas
- El número de examen al que corresponde la pregunta (opcional)

La estructura de los datos es la siguiente:

```javascript
window.bancoDePreguntas = [
  {
    "pregunta": "Texto de la pregunta",
    "opciones": [
      "Respuesta 1.",
      "Respuesta 2.",
      "Respuesta 3.",
      "Respuesta 4."
    ],
    "correcta": 0,
    "examen": 1
  },

  ...otras preguntas aquí...

]
```

El valor `correcta` indica la opción correcta de ente las opciones posibles. En el ejemplo, la primera opción es la 0 y la cuarta es la 3 (índice 0).

Cada pregunta debe tener, al menos, dos respuestas posibles.

## Bancos de preguntas

Se pueden incorporar nuevas preguntas al banco de preguntas o también intercambiar el fichero `bancoDePreguntas.js` con otras temáticas de estudio, en ese caso:

- El fichero `bancoDePreguntas.js` debe estar en la carpeta donde se encuentre el programa `visor.html`.
- El nuevo banco de preguntas debe tener el nombre `bancoDePreguntas.js`, por lo que se deberá renombar el fichero del banco de preguntas actual.
- El banco de preguntas debe tener al menos una pregunta con sus correspondientes opciones, e indicar la respuesta correcta.

## ToDo

Como todo programa, puede ser mejorado. Aquí algunas propuestas:

- Desordenar las respuestas.
- Añadir un selector interactivo de examen.
- Opción para mantener o no la solución a las preguntas al cambiar de pregunta.
- Añadir notas no obligatorias a las preguntas. 
- Opción para indicar que una pregunta no debe ser mostrada, aunque esté en el banco de preguntas.
- Seleccionar uno o varios exámenes para mostrar, excluyendo el resto, o bien seleccionar exámenes a excluir, mostrando el resto.
- Incluir un fichero de configuración para personalizar el visor.

## Consideración

Para su desarrollo básico se ha empleado la IA Copilot, y posteriormente ha sido modificado manualmente para añadir nuevas funcionalidades, para que sea accesible y para que se adapte a la ventana del dispositivo donde es abierto.

# Enlaces

- [Programa visor en linea](https://javguerra.github.io/visor-preguntas/)
- [Repositorio GitHub para descargar](https://github.com/JavGuerra/visor-preguntas)
