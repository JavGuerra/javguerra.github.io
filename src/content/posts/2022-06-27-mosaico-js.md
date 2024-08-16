---
route: mosaico-js
title: Mosaico JS
description: Juego de colorear pixel art
author: JavGuerra
pubDate: 2022-06-27
coverImage:
  image: '@/assets/img/mosaico.png'
  alt: Mosaico JS
tags:
    - web
    - código
    - CSS
    - HTML
    - JavaScript
    - DOM
    - juego
---
Ejercicio que combina lógica de programación en JavaScript, y el uso de eventos asociados a los elementos del DOM que consiste en elegir un pincel y pintar las celdas de una tabla para construir un mosaico de colores.

[<button>Probar el juego</button>](https://javguerra.github.io/MosaicoJS/)

# El juego

La página muestra ocho botones redondos de otros tantos colores de una gama que va de los colores oscuros, empezando por el negro, a los colores claros, terminando con el blanco. Al hacer clic en cada botón elegimos el color deseado.

Debajo de estos botones está la tabla de 16x16 celdas sobre las que vamos a pintar con el color seleccionado. Al hacer clic sobre una celda, esta cambia su color de fondo al nuevo color. Podemos componer dibujos con esta técnica como el que se ve en la imagen.

Para borrar emplearemos el color blanco, ya que este es el color por defecto de cada celda de la tabla, o bien podemos corregir errores pintando con otro color distinto.

Para borrar todo el dibujo deberemos recargar la página. Dada la simplicidad del ejemplo, no se han implementado opciones para guardar y cargar los mosaicos creados.

# Lo básico, el HTML

El código html es una fuente de información para la aplicación que voy a desarrollar.

```html
<body>
    <header>
        <h1><img id="logo" src="assets/img/mosaico.png" alt="logo" />Mosaico</h1>
        <small>¡Elije un color y haz clic en el mosaico para pintar!</small>
        <nav>
            <button id="btnNegro" class="negro"></button>
            <button id="btnAzul"  class="azul" ></button>
            <button id="btnRojo"  class="rojo" ></button>
            <button id="btnMagen" class="magen"></button>
            <button id="btnVerde" class="verde"></button>
            <button id="btnCian"  class="cian" ></button>
            <button id="btnAmari" class="amari"></button>
            <button id="btnBlanc" class="blanc"></button>
        </nav>
    </header>

    <main></main>
</body>
```
Dentro de ```<nav>``` indico el identificador ```id``` y la clase ```class``` que definirá el color de cada botón ```<button>```. Esta clase me va a servir para simplificar la codificación del juego, ya que, como veremos más adelante, voy a aprovechar esta información para seleccionar el color del pincel con el que pintaremos, es decir, cuando hagamos clic en cada uno de los botones, dispararemos un evento que me permitirá ejecutar una función que leerá la clase asociada a este. Como la clase indica el color del botón, podemos usarla para saber qué color hemos elegido. Al pulsar el botón rojo estaremos obteniendo la clase ```.rojo``` que luego podemos aplicar en las celdas del mosaico.

Por supuesto, en el CSS cada clase definirá el color, por ejemplo:

```css
.rojo {
  background-color: #f00;
}
```

Sencillo, ¿verdad? Veamos cómo funciona.

# El programa en JS

Básicamente el programa hará lo siguiente:

1. Asociará un evento que llama a la función ```color()``` en cada uno de los ocho botones para poder elegir el color con el que pintar.
2. Dibujará una tabla con las dimensiones deseadas (inicialmente 16x16, pero se puede cambiar), y a cada celda de la tabla le asociará un evento que llama a la función ```pinta()``` cuya tarea es cambiar el color de la celda sobre la que se ha echo clic.
3. Inicializará las dos variables que usaremos en el juego.

Esto último paso es simple:

```javascript
let btnSel = el('#btnNegro');
let pincel = btnSel.className;
```
Estas variables servirán para:

| Variable | Uso |
| :------ |:--- |
| ```btnSel``` | Contendrá la referencia al botón que hemos seleccionado. Esto nos permitirá mostrar el botón como seleccionado y desmarcar el botón cuando cambiemos nuestra selección por otro botón seleccionado. |
| ```pincel``` | Contendrá la clase relativa al color seleccionado que hemos obtenido al hacer clic en alguno de los botones de la barra de navegación. |

## Asociando el evento de la función color

Para que los ocho botones de colores funcionen, debo asociarles un evento de tal forma que, al hacer clic en ellos, realicen su función, nunca mejor dicho:

```javascript
el('#btnNegro').onclick = color;
el('#btnAzul' ).onclick = color;
el('#btnRojo' ).onclick = color;
el('#btnMagen').onclick = color;
el('#btnVerde').onclick = color;
el('#btnCian' ).onclick = color;
el('#btnAmari').onclick = color;
el('#btnBlanc').onclick = color;
```
La función ```el()``` es una forma de abreviar:

```javascript
function el(el) { return document.querySelector(el); }
```
Como se aprecia, lo que hace la función ```el()```  es devolver un elemento de nuestro HTML tomando como referencia su selector, usando para ello la función ```querySelector()```;

Como ya tenemos el elemento HTML que corresponde a cada botón, podemos asignarle un escuchador de evento con ```.onclick``` que llame a la función ```color()``` al hacer click en ese botón.

¿Y qué hace la función ```color()```?

```javascript
function color() {
    btnSel.classList.remove('seleccion');
    btnSel = this;
    pincel = this.className;
    btnSel.classList.add('seleccion');
}
```

Primeramente elimina la clase ```.seleccion``` que es la encargada de dar el efecto hundido del botón seleccionado (```btnSel```).

Seguidamente obtiene la referencia del botón que acabamos de seleccionar haciendo uso de ```this```. Aquí ```this``` hace referencia al objeto que llama a la función, es decir, al botón que lanzó el evento. Ahora ya sabemos cual es el botón sobre el que hemos hecho clic.

Para obtener el color del ```pincel``` con el que vamos a pintar, leo la clase asociada al botón con ```.className```. Esta clase, como vimos cuando creamos el HTML, es la encargada de definir el color de fondo del botón, y es la que usaremos para pintar las celdas a partir de ahora cuando llamemos a la función ```pinta()```.

Para indicar visualmente al usuario el color que ha seleccionado, ponemos la clase ```.seleccion``` en el nuevo botón.

En resumen, como sabemos cual fue el botón que seleccionamos anteriormente, quitamos la clase que indica visualmente que el botón está seleccionado, porque ya ha dejado de estarlo, asociamos a la variable ```btnSel``` el nuevo botón, y a la variable ```pincel``` la clase asociada al botón que indica su color, y finalmente ponemos la marca de selección en el nuevo botón seleccionado.

## Dibujando la tabla con las celdas sobre las que pintaremos

Creo la tabla y la conecto al DOM mediante:

```javascript
el('main').appendChild( creaTabla(numCols, numFils) );
```

La función ```creaTabla()``` recibe dos parámetros que indican su altura y anchura en celdas. Si lo deseamos, podemos cambiar el valor de estas variables para hacer que el mosaico tenga otras dimensiones cambiando los valores en:

```javascript
const numCols = 16;
const numFils = 16;
```

Esta función ```creaTabla()``` no destaca especialmente si no es por dos cosas:

```javascript
function creaTabla(numCols, numFils) {
    let table, tbody, tr, td;
    tbody = creaEl('tbody');
    for (let i = 1; i <= numFils; i++) {
        tr = creaEl('tr');
        for (let i = 1; i <= numCols; i++) {
            td = creaEl('td');
            td.classList.add('blanc');
            td.onclick = pinta; // ¡Magia!
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table = creaEl('table');
    table.appendChild(tbody);
    return table;
}
```  

Hago uso de la función ```.creaEl()``` para acortar la instrucción encargada de la creación de elementos del DOM:

```javascript
function creaEl(el) { return document.createElement(el); }
```

Cada vez que creo un ```<td>``` (celda) le asigno un evento que llama a la función ```pinta()```:

```javascript
    td = creaEl('td');
    td.classList.add('blanc');
    td.onclick = pinta; // ¡Magia!
```
Estas tres líneas dentro del bucle anidado crean las celdas de cada fila, les asignan la clase ```.blanc``` que pone el fondo de las celdas de color blanco por defecto, y luego asocia la función ```pinta()``` al evento ```.onclick``` de cada celda de forma que al hacer click en ella su fondo se pintará del color que indique ```pincel```:

```javascript
function pinta() { this.className = pincel; }
```
De nuevo aquí ```this``` es fundamental para poder trabajar con la celda seleccionada, que es la que lanzó el evento. Al hacer clic en la celda, cambiamos de color esa misma celda. Así de simple.

# En resumen

Esto sería todo. Resumiendo la operativa de la aplicación, partiendo de un HTML con las clases que indican el color de cada uno de los botones del juego que sirven para seleccionar el color, asocio un evento a cada botón para saber el color del pincel con el que vamos a pintar las celdas. Inicialmente, el color seleccionado es el negro, y el botón seleccionado es el que corresponde a ese color.

Al hacer clic en cada celda, hacemos que el fondo de esta cambie al color seleccionado.

Puedes jugar al juego y ver el código completo en el repositorio haciendo clic en los siguientes enlaces.

¿Te animas a hacer tus propios dibujos pixel art?

# Enlaces

[<button>Probar el juego</button>](https://javguerra.github.io/MosaicoJS/)  

Repositorio [JavGuerra/MosaicoJS ](https://github.com/JavGuerra/MosaicoJS)