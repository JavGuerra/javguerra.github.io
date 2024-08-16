---
route: logica-interactiva
title: Lógica interactiva
description: Opciones, eventos, disparadores y estados.
author: JavGuerra
pubDate: 2022-04-30
coverImage:
  image: '@/assets/img/decisiones.jpg'
  alt: Decisiones
tags:
    - código
    - JavaScript
    - lógica
---
Programar es una diversión difícil. En ocasiones las interacciones entre los disparadores de eventos y los estados de las variables y los objetos interelacionados multiplican sus opciones, haciendo complicado establecer, de memoria, todas las permutaciones posibles para no dejar ninguna de ellas sin implementar en nuestro código.

[<button>Página web de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/12-nodos.html)

En la página que he preparado para ilustrar esta entrada, tenemos cinco botones de un menú de opciones. Cada opción interactúa con los estados de los otros botones mientras se van añadiendo, quitando o cambiando elementos del DOM (en este caso artículos de una sección), y activando o desactivando los botones según sea necesario en cada momento. Es fácil entender la mecánica del ejemplo probándolo.

Los disparadores son los botones que generan eventos, y algunas condiciones del propio programa, como cuando hemos borrado todos los elementos del DOM o cuando añadimos el primer elemento tras ello. Los estados corresponden a los botones ON/OFF, y al valor de las variables que se emplean para llevar a cabo las acciones asignadas a cada botón.

![Decisiones](@/assets/img/opciones.png)

Imaginemos que con el botón «Cambiar» alteramos el contenido del último elemento de la lista de elementos que hemos añadido al DOM (como se ve en la imagen). Esto hará que el botón «Cambiar» se desactive en este momento, porque ya no tenemos que cambiar el elemento recien cambiado, y el botón «Limpiar» se active, si no lo estaba ya, para ofrecer al usuario la opción de limpiar los elementos cambiados. Si borramos seguidamente este último elemento con «Borrar», deberemos comprobar si el botón «Limpiar» debe desactivarse si ya no hay elementos cambiados, y si el botón «Cambiar» debe activarse de nuevo si el que ahora es el último elemento no fue cambiado anteriormente, o mantenerse desactivado en tal caso. Añadir nuevos elementos altera otra vez el estado del botón «Cambiar» que debe activarse ofreciendo la opción de cambiar este nuevo elemento. Estas son algunas de las permutaciones posibles.

## Tabla «disparadores/estados»

Mediante una tabla en una sencilla hoja de cálculo podemos contabilizar en el eje de las **Y** (primera columna) todos aquellos disparadores (eventos y condiciones) de nuestra aplicación, y en el eje de las **X** (filas) todos los estados, tanto de las variables como de los objetos (botones u otros), y ver cómo se interelacionan en tiempo de ejecución. <u>Lo difícil entonces será determinar con claridad cuáles son los disparadores y cuáles los estados</u>. Si lo hacemos bien, con esta herramienta podemos clarificar, sin olvidar nada, cada interacción lógica derivada de las opciones de la aplicación, de forma similar a como se ve en la siguiente imagen.

![Decisiones](@/assets/img/tabla-disparadores-estados.png)

En este ejemplo, «Arranque» se refiere al estado de los botones al inicio. «Click btn...» corresponde a la pulsación de cada uno de los cinco botones. «Sin elementos» corresponde a la situación en la que se han borrado todos los elementos. «Añadir primer elemento» corresponde a los cambios a realizar cuando esta condición se presenta. Por último, «Click de inicio» y «Click de parada» corresponden al estado de los botones cuando los pulsamos y cuando se termina de realizar su tarea asignada. Como se aprecia, los botones son desactivados al pulsarlos para impedir que puedan ser pulsados de nuevo en tanto no terminen su ejecución, momento en el que (algunos de ellos) son reactivados.

Esta tabla resumida incluye sólo la interacción de estados de los botones, -obviando el estado de las variables para no complicar el ejemplo-, anotando en las celdas de cada columna el estado del botón según los disparadores indicados al principio de cada fila. A la hora de pasar a la fase de codificación de nuestra aplicación, nos será fácil determinar si hemos implementado todas y cada una de las interacciones posibles reflejadas en la tabla simplemente cotejándola. Cuando tengas ante ti un abanico de opciones inabarcables, esta puede ser una solución para salir del atolladero.

De paso, este ejercicio sirve para mostrar el uso de JavaScript en el manejo de nodos del DOM.

[<button>Ver el ejercicio interactivo on-line</button>](https://javguerra.github.io/ejercicios-web-javascript/12-nodos.html)

Descargar la tabla de decisiones completa del ejercicio en formato [.ods (Open Document)](https://javguerra.github.io/ejercicios-web-javascript/12-nodos-tabla.ods) o [.xls (Excel)](https://javguerra.github.io/ejercicios-web-javascript/12-nodos-tabla.xls).

**Actualización**. Ver este ejemplo de uso de botonera aún más complicado: [Cronómetro en JavaScript](cronometro-js)