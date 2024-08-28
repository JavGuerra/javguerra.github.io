---
route: el-cadaver-exquisito
title: El cadáver exquisito
description: Un juego de experimentación artística por ordenador
author: JavGuerra
pubDate: 2022-05-15
coverImage:
  image: '@/assets/img/lce.png'
  alt: El cadáver exquisito original
tags:
    - web
    - HTML
    - CSS
    - JavaScript
    - arte
    - MEIAC
    - juego
---
_Imagen: Victor Brauner, André Bretón, Jacques Hérold e Yves Tanguy (1935)_

>«El cadáver / exquisito / beberá / el vino / nuevo»

Alrededor de los años veinte, los pintores surrealistas inventaron un juego para «fabricar» figuras fantásticas. En realidad, era un derivado de un juego que ya se hacía con las palabras y que consistía en componer una frase entre varias personas: uno de los participantes en el juego escribe la primera palabra de una frase y luego pliega la hoja de forma que su palabra quede oculta; el que está a su lado hace lo mismo, pasa la hoja a su vecino y así sucesivamente... 

En Francia, el juego con las palabras se llama «[_Le cadavre exquis_](https://es.wikipedia.org/wiki/Cad%C3%A1ver_exquisito)» porque la primera frase escrita con este sistema rezaba: «El cadáver / exquisito / beberá / el vino / nuevo».

En lugar de jugar con palabras, los pintores surrealistas utilizaron las partes de una figura: el primer jugador dibuja la cabeza; el segundo, el cuerpo; el tercero, las piernas; y el último, los pies. Basta con indicar, sobre la línea plegada, los puntos donde se dejó el dibujo escondido. Con este sistema es posible dibujar personajes fantásticos, animales y plantas... ¡de otro mundo!

Tomando esta idea como referencia, en un «**Taller de experimentación artística por ordenador**» que impartí para el [Museo Extremeño e Iberoamericano de Arte Contemporáneo (MEIAC)](http://meiac.es) en 1997, llevamos a cabo una versión digital de dicho juego. Aquí el resultado:

[<button>Ver la página web</button>](http://badared.com/javguerra/contenidos/lce/juego.htm)

Visualmente, el resultado no está a la altura de los estándares de hoy día. Tampoco la codificación de la página es un prodigio, pero su código guarda algo interesante que ahora contaré.

La mecánica del juego es sencilla. Los alumnos hicieron un total de diez (10) dibujos completos de sus personajes fantásticos imaginarios, de cabeza a pies. Estas imágenes fueron escaneadas, divididas en tres partes y almacenadas en tres carpetas distintas: «arriba», «medio» y «abajo» todas con el mismo tamaño. Cada imagen fue numerada como ```image0.jpg``` a ```image9.jpg```, y todas ellas usaban los mismos puntos de corte para la cabeza, el cuerpo y las extremidades inferiores.

La página elige al azar una imagen de cada una de las tres carpetas mencionadas, mostrando una composición de ellas totalmente nueva e inesperada. ¡Ahora es el ordenador el que juega al cadáver exquisito!

## ¿Como funciona?

Esta es la parte sorprendente. En aquellos días los navegadores soportaban JavaScript limitadamente, y las versiones del lenguaje no estaban tan avanzadas. No se disponía de la función matemática ```Math.random()``` y el acceso al DOM estaba en pañales. Pero con el siguiente código que me ayudó a escribir en su momento un buen amigo, se hizo posible.

```javascript
var valor=9;
var fecha=new Date();
var mili=fecha.getTime();	    
var segundo=fecha.getSeconds();
var minuto=fecha.getMinutes();	    
var hora=fecha.getHours();
var numero;

numero=Math.round((mili/segundo)%valor);
document.write('<img src="arriba/image'+numero+'.jpg" width="250" height="130"><br>');
	    
numero=Math.round((mili/minuto)%valor);
document.write('<img src="medio/image'+numero+'.jpg" width="250" height="130"><br>');

numero=Math.round((mili/hora)%valor);
document.write('<img src="abajo/image'+numero+'.jpg" width="250" height="130"><br>');
```

Para mostrar imágenes al azar, usé los datos de fecha y hora para generar valores pseudo-aleatorios en un rango de enteros entre 0 y 9. Y para poner las imágenes emplee ```document.write()``` pasándole como parámetro el código HTML que mostraría cada una de las tres imágenes aleatorias. Para conseguir el número de imagen empleé ```Math.round()``` con la fórmula que puede verse en el código. Con dichas operaciones, cada vez que se genera la página se obtienen valores lo suficientemente distintos como para conseguir resultados que no se repiten.

El código JavaScript se inserta en la página en la posición donde se deben mostrar las imágenes, de esa forma el ```document.write()``` no requiere localizar el elemento dentro del cual poner las imágenes. El código ya está ahí.

Para generar un nuevo «cadáver exquisito» hacemos clic en el botón «Pulse» que recargará la página, generando un nuevo resultado, pues el momento en el tiempo entre la primera composición de imágenes y la nueva es distinto.

[<button>Ver el juego del cadáver exquisito</button>](http://badared.com/javguerra/contenidos/lce/juego.htm)

* [Ver la página de información del juego](http://badared.com/javguerra/contenidos/lce/index.htm)
* [El cadáver exquisito en Wikipedia](https://es.wikipedia.org/wiki/Cad%C3%A1ver_exquisito)