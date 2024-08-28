---
route: paginacion
title: Paginación
description: Cómo hacer una barra de navegación en JavaScript
author: JavGuerra
pubDate: 2022-05-30
coverImage:
  image: '@/assets/img/paginacion.jpg'
  alt: Paginación
tags:
    - código
    - CSS
    - HTML
    - JavaScript
    - usabilidad
---

Imaginemos una lista de entradas de un blog, o una galería de imágenes, con un número de items o elementos alto. Pongamos mil. Esto se hace difícil de manejar, tanto por las dimensiones de las pantallas como por el número de elementos al que el usuario prestará atención, y también existe un problema técnico, el consumo de memoria que implica mostrar todos los items de esa lista, y el tiempo que tarda en hacerlo. Ese retraso entre que se carga la página, se «pinta» y se devuelve el control al usuario supone un tiempo de espera incómodo.

Paginar es mostrar el contenido separado en páginas para, de esta forma, hacerlo más asequible al usuario, y esta es la solución de la que hablaré en esta entrada.

## Planteamiento

<span class="note">**Nota:** Para una mejor comprensión de la resolución de este ejercicio, algunas variables que podrían ser globales, como es el caso de ```longitud``` del vector y otras, se repiten en las disitntas funciones.</span>

En un vector o array tenemos una serie de elementos o items que queremos mostrar paginados, y queremos que estos items se muestren por ejemplo de diez en diez. Para hacerlo necesitaremos el vector, el número de elementos por página y deberemos averiguar el número de páginas que podemos mostrar. Luego recorreremos las páginas ayudandonos de una variable que hará las veces de índice.

Para mostrar el resultado, el HTML contendrá lo siguiente:

```html
<section id="galeria" role="region" aria-live="polite"></section>

<section id="navegacion">
    <button id="irInic" aria-label="Inicio">&lt;&lt;</button>
    <button id="anteri" aria-label="Anterior">&lt;</button>
    <span   id="pagina" role="region" aria-live="polite"></span>
    <button id="siguie" aria-label="Siguiente">&gt;</button>
    <button id="irFin"  aria-label="Fin">&gt;&gt;</button>
</section>
```
Una sección ```galeria``` donde mostrar los items. en este caso las imágenes.

Una sección de ```navegacion``` con los botones para recorrer las páginas y donde informar al usuario de la página donde nos econtramos.

Esto implica la siguiente configuración de valores iniciales en el fichero ```.js```:

```javascript
let nFotos  = 10;
let pagina  = 1;
let galeria = [];

/* Obtener los datos a incluir en galeria */

elGaleria = elemento('#galeria');
elPaginac = elemento('#pagina' );

btnIrInic = elemento('#irInic' );
btnAnteri = elemento('#anteri' );
btnSiguie = elemento('#siguie' );
btnIrFin  = elemento('#irFin'  );

btnIrInic.onclick = inicial;
btnAnteri.onclick = anterior;
btnSiguie.onclick = siguiente;
btnIrFin.onclick  = final;

paginacion(galeria, pagina, nFotos);

/* Devuelve un elemento */
function elemento(sel) { return document.querySelector(sel); }
```
La variable ```nFotos``` contiene el número de elementos por página.
Iniciamos la variable ```pagina``` a ```1```, y el vector galeria, que contendrá las rutas a las imagenes, a un vector vacío ```[]```.

Para cargar la lista de imágenes de la galería en el vector ```galeria```, podemos usar ```fetch()``` contra una **API** o un **JSON** guardado localmente, por ejemplo.

Seguidamente obtenemos los elementos ```elGaleria``` y ```elPagina``` y los cuatro botones para movernos por las páginas de la galería. A cada uno de ellos le asignamos un evento que ejecutará una función al hacer click que nos llevará a la primera página, a la anterior, a la siguiente o a la última respectivamente, alterando el valor de la variable ```pagina``` y llamando a la función que muestra la galería. Veamos estas funciones:

```javascript
/* Va a la primera página */
function inicial() {
    pagina = 1;
    paginacion(galeria, pagina, nFotos);
}

/* Va a la página anterior */
function anterior() {
    pagina--;
    paginacion(galeria, pagina, nFotos);
}

/* Va a la página siguiente */
function siguiente() {
    pagina++;
    paginacion(galeria, pagina, nFotos);
}

/* Va a la última página */
function final() {
    let longitud = galeria.length;
    pagina = Math.ceil(longitud / nFotos);
    paginacion(galeria, pagina, nFotos);
}
```

Cada una de estas cuatro funciones llama a la función ```paginacion```, para acutalizar el contenido de la galería con tres valores: el vector, la página a mostrar y el número de fotos por página.

En la función ```final``` calculo el número de páginas posibles atendiendo a la longitud del vector, así, obteniendo el valor entero resultante de dividir la longitud del vector entre el número de imágenes por página devolverá el número de la última página (o el número total de páginas) que guardo en ```pagina```, valor que necesito para llamar a la función ```paginacion```.

## Paginando

```javascript
/* Pagina los elementos de un vector en función de página y elementos por página */
function paginacion(vector, pagina, elementos) {
    let longitud, numPags, inicio;
    longitud = vector.length;
    if (longitud) {
        // Averigua el elemento de inicio
        numPags = Math.ceil(longitud / elementos);
        if (pagina > numPags) pagina = numPags;
        if (pagina < 1) pagina = 1;
        inicio = (pagina - 1) * elementos;
        // Ajusta el número de elementos si se requiere
        if (longitud < elementos) {
            elementos = longitud;
        } else if (longitud - inicio < elementos) {
            elementos = longitud - inicio;
        }
        // Resuelve
        ctrlBotonesPag(pagina, numPags);
        listaElementos(vector, inicio, elementos); 
    }
}
```

Esta es la función donde se produce la «magia». Tras hallar la longitud del vector recibido, si esta es mayor que cero, paso a calcular primeramente el elemento de ```inicio``` de la página que vamos a mostrar. Si la pagina es 1, elemento del vector que guardará ```inicio``` será ```0``` (cero), si la página es la ```2``` el valor será ```10```, -pues cabe recordar que el número de elementos por página (```nFotos```) es ```10```-, y así sucesivamente.

Realizo una serie de comprobaciones para obtener el valor de ```inicio``` adecuado: Si la página que recibimos por parámetros es mayor que el número de páginas posibles del vector, la página a mostrar será la última. Si el valor de página es menor que ```1```, el valor de página será ```1```, evitando de esta forma que el programa intente mostrar elementos del vector que no existen.

Una vez tengo el valor de ```inicio``` veo si es necesario ajustar el número de ```elementos``` que se mostrarán en la página. Así, si el número de ```elementos``` por página (```nFotos```) es mayor que el número de items del vector, el valor de ```elementos``` se ajusta al número total de items del vector. Sino, se comprueba si el número de items que quedan por mostrarse en esta página ```(longitud - inicio)``` es menor que el número de ```elementos``` (```nfotos```), y si es así, se ajusta el valor de ```elementos```. Este caso ocurre cuando la última página tiene un número de elementos menor que el de ```nFotos```.

Como ya tengo todo lo que necesito, llamo consecutivamente a dos funciones, la encargada de activar o desactivar los botones ```ctrlBotonesPag(pagina, numPags);``` y la encargada de «pintar» la galería ```listaElementos(vector, inicio, elementos);``` mostrando las fotos y la información relativa a la página. Veamos la primera de ellas:

```javascript
/* Activa o desactiva los botones según la página */
function ctrlBotonesPag(pagina, numPags) {
    btnInactivo(btnIrInic, false);
    btnInactivo(btnAnteri, false);
    btnInactivo(btnSiguie, false);
    btnInactivo(btnIrFin,  false);
    if (pagina == 1) {
        btnInactivo(btnIrInic, true);
        btnInactivo(btnAnteri, true);
    }
    if (pagina == numPags) {
        btnInactivo(btnSiguie, true);
        btnInactivo(btnIrFin,  true);
    }
}
```

Esta función primeramente activa todos los botones, por si fuese el caso de que alguno de los ellos hubiera sido desactivado previamente, y luego comprueba si estamos en la primera página, desactivando entonces los botones de **ir al inicio** de la galería (```btnIrInic```) e **ir a la página anterior** (```btnAnteri```) o si estamos en la última página, desactivando entonces **ir al a página siguiente** (```btnSiguie```) e **ir al final** de la galería (```btnIrFin```).

Para activar y desactivar los botones, empleo la siguiente función:

```javascript
/* Cambia el estado de un botón dado */
function btnInactivo(boton, estado) {
    boton.disabled = estado;
    boton.setAttribute('aria-disabled', estado);
}
```
Recibe como parámetros el botón y el estado que deseamos ponerle: ```true = inactivo```  o ```false = activo```.

Una vez tengo los botones en sus estados correctos, sólo queda mostrar la galería.

## Mostrando

```javascript
/* Muestra la cantidad de elementos de un vector desde la posición dada */
function listaElementos(vector, inicio, elementos) {
    let longitud = vector.length;
    let primero  = inicio + 1;
    let fin = inicio + elementos;

    elGaleria.textContent = '';
    elPaginac.textContent = '';
    botonera(false);

    vector.slice(inicio, fin).forEach(
        (urlFoto, i) => {
            /*
             * Código para mostrar la galería
             */
        }
    )

    elPaginac.innerHTML = `Fotos: ${primero} a ${fin} de ${longitud}`;
    botonera(true);
}
```

Los parámetros que recibimos son el vector (```galeria```), el número del item inicial (```ìnicio```) y los elementos por página (```nFotos```) a mostrar. Con ellos obtengo la ```longitud```, el número de orden del elemento ```primero``` de la página ```inicio + 1``` y el elemento final del vector que debemos mostrar ```inicio + elementos```.

Seguidamente limpio la página para: el contenido de la galería, el contenido de la info de la paginación, y oculto la botonera. Esto último lo hago con la función ```botonera(status)``` que veremos al finalizar.

Con ```vector.slice(inicio, fin).forEach((urlFoto, i) => { // })``` primeramente obtenemos los elementos del vector que necesitamos con ```.slice(inicio, fin)``` y mediante el ```.forEach()``` itero los elementos a mostrar, obteniendo del vector la url de la foto (```urlFoto```) y el índice (```i```) de elementos del ```.forEach()```. Dentro de la función flecha se debe incluir el código para mostrar las imágenes dentro del elemento ```elGaleria``` del **HTML**, por ejemplo:

```javascript
elGaleria.innerHTML +=`<div><a href="${urlFoto}" target="_blank">`
    + `<img src="${urlFoto}" alt="Foto ${primero + i}" /></a></div>`
```

Al terminar de recorrer el vector resultante de aplicar ```.slice()```, incluyo la información de la página en el elemento ```elPagina``` del **HTML**, y muestro la botonera que anteriormente oculté. Esta sería la función para hacerlo que mencioné antes: 

```javascript
/* Activa o desactiva la botonera */
function botonera(status) {
    btnIrInic.style.display = status ? 'initial' : 'none';
    btnAnteri.style.display = status ? 'initial' : 'none';
    btnSiguie.style.display = status ? 'initial' : 'none';
    btnIrFin.style.display  = status ? 'initial' : 'none';
}
```

Como se aprecia, ```true = activa``` y ```false = desactiva``` la botonera mostrándola u ocultándola.

Con esto ya tendríamos presentada la página de la galería con el número de elementos indicado, la información de la página y los botones para movernos por la galería, que era el objetivo de esta entrada.

## Enlaces

* Podemos ver un caso de uso en esta:

[<button>galería de perritos</button>](https://javguerra.github.io/ejercicios-web-javascript/17-fetch.html)

El ejemplo anterior usa la API [Dog CEO](https://dog.ceo/dog-api/).