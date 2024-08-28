---
route: ancho-alto
title: Conocer el ancho y alto de una imagen con JavaScript antes de usarla en HTML
description: Ideas para evitar el «FOUC» de contenido cuando desconocemos las medidas de las imágenes
author: JavGuerra
pubDate: 2022-08-01
coverImage:
  image: '@/assets/img/img.png'
  alt: Imagen
tags:
    - código
    - JavaScript
    - Node.js
    - imágenes
---

Cuando una web está cargando, se producen cambios en el diseño conocidos como _Flash Of Unestiled Content_ (FOUC) que son visualmente molestos para el usuario y le hacen perder su punto de referencia en la página. Las imágenes son uno de los principales causantes de estos cambios. Hasta que no son cargadas no se conoce su ancho y alto, por lo que es un buen criterio de diseño indicar el ancho y alto de la imagen en el HTML. Pero ¿qué ocurre cuando no conocemos las medidas de las imágenes que vamos a cargar? Pongamos como ejemplo una galería de fotos que tomamos mediante fetch. En esta entrada veremos como afrontarlo.

# El código

Pongamos que tenemos un arreglo con un listado de URLs de fotos de adorables perritos que queremos mostrar en una galería de fotos. Este arreglo podemos definirlo u obtenerlo mediante ```fetch``` desde una API u otro lugar. Cada imagen tiene un tamaño distinto, osea, unas medidas para los valores ```width``` y ```height``` diferentes. Nuestro objetivo es conocer estos valores antes de mostrar las fotos en la galería, para asignarles su ancho y alto correctos y evitar de esa manera el FUOC. De otra forma, a medida que se carguen las imágenes en la galería, estas irán abriéndose hueco para ocupar su espacio «empujando» el diseño.

Con este código que seguramente encontré y adapté de StackOverflow o un sitio similar podemos hacerlo. Lo describo más abajo.

```javascript
const galeria = document.getElementById('galeria');

const fotos = [
    'https://images.dog.ceo/breeds/dachshund/Stretched_Dachshund.jpg',
    'https://images.dog.ceo/breeds/cattledog-australian/IMG_1211.jpg',
    'https://images.dog.ceo/breeds/dachshund/dachshund-7.jpg'
];

function medidas(urlFoto) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => {
            resolve({ ancho: img.width, alto: img.height });
        };
        img.onerror = () => {
            reject(new Error('Imagen no encontrada.'));
        };
        img.src = urlFoto;
    });
}

fotos.forEach((urlFoto, i) => {
    medidas(urlFoto)
        .then(mide => {
            galeria.innerHTML += `<img src="${urlFoto}" `
            + `width="${mide.ancho}" height="${mide.alto}" `
            + `alt="Foto ${i}" title="Foto ${i}" />`
        })
        .catch(err => console.error(err));
    }
)
```
Para usar este código, debemos tener algo como esto en el HTML:

```html
<div id="galeria"></div>
```

Vamos con JavaScript. Primero defino las variables con las que voy a trabajar. La referencia al elemento del DOM y el arreglo de URLs de fotos de perritos:

```javascript
const galeria = document.getElementById('galeria');

const fotos = [
    'https://images.dog.ceo/breeds/dachshund/Stretched_Dachshund.jpg',
    'https://images.dog.ceo/breeds/cattledog-australian/IMG_1211.jpg',
    'https://images.dog.ceo/breeds/dachshund/dachshund-7.jpg'
];
```

## Obtener las medidas

Aquí es donde se produce la magia. Veamos como:

```javascript
function medidas(urlFoto) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => {
            resolve({ ancho: img.width, alto: img.height });
        };
        img.onerror = () => {
            reject(new Error('Imagen no encontrada.'));
        };
        img.src = urlFoto;
    });
}
```
Esta función recibe como parámetro la URL de la imagen a calcular y envuelve una promesa que resolverá un objeto con las medidas ```ancho``` y ```alto``` o bien un error.

Para hacerlo, instancio una nueva imagen con ```const img = new Image();``` y declaro dos eventos asociados a ```img```, un evento que se disparará cuando se cargue la imagen en ```img``` con ```img.src = urlFoto;``` (```img.onload```), y otro que se disparará si se produce un error al cargar la imagen (```img.onerror```).

Es decir, cuando cargo la imagen con ```img.src = urlFoto;``` pueden pasar dos cosas, que se lance el evento ```onload``` si todo fue bien, o el evento ```onerror``` si algo falló.

Si todo fue bien, la imagen estará «cargada» en ```img```, y podemos obtener su ancho y alto. Mediante ```resolve({ ancho: img.width, alto: img.height });``` devuelvo estos valores dentro de un objeto.

Si algo falló, devuelvo un error con ```reject(new Error('Imagen no encontrada.'));```.

## Poner las imágenes en la galería

Si tenemos la función ```medidas()``` a la que podemos pasarle una URL, podemos recorrer el arreglo ```fotos``` y poner en nuestro HTML cada foto con sus medidas exactas:

```javascript
fotos.forEach((urlFoto, i) => {
    medidas(urlFoto)
        .then(mide => {
            galeria.innerHTML += `<img src="${urlFoto}" `
            + `width="${mide.ancho}" height="${mide.alto}" `
            + `alt="Foto ${i}" title="Foto ${i}" />`
        })
        .catch(err => console.error(err));
    }
)
```

Mediante un ```.forEach()``` recorro cada elemento del arreglo. De él obtengo dos valores, cada una de las URLs y el índice que ocupa en el arreglo cada URL.

Llamo a la función ```medidas()``` a la que le paso como parámetro la URL de una foto (```urlFoto```).

La función devuelve una promesa que debe ser resuelta. Así mediante ```.then()``` obtengo el objeto ```mide``` que contiene el ancho y el alto de la imagen que indiqué mediante la URL, que es el resultado del ```resolve``` de la promesa. De otra forma, con ```.catch()``` se captura el error resultante del ```reject``` de la promesa.

Si tenemos las medidas de ancho y alto de la imagen a mostrar, ya podemos conectarla al DOM con:

```javascript
galeria.innerHTML += `<img src="${urlFoto}" `
+ `width="${mide.ancho}" height="${mide.alto}" `
+ `alt="Foto ${i}" title="Foto ${i}" />`
```
Esto insertará en el elemento del DOM identificado con ```#galeria``` una imagen (```img```) con el enlace a la foto (```src```), su ancho (```width```), alto (```height```) y una etiqueta ```alt``` que «describe» (vagamente) la foto. Con ```title``` podemos obtener la misma descripción al pasar con el ratón sobre la imagen.

Por supuesto a la imagen podemos aplicarle las clases CSS que deseemos para, por ejemplo, que aparezca correctamente si usamos flexbox o similar para mostrar la galería...

# El módulo image-size

Si realizamos el test [Page Speed de Google](https://pagespeed.web.dev/) a nuestra página y no indicamos el ancho y alto de las imágenes, esto nos penalizará en la puntuación de viabilidad en el apartado _```Cumulative Layout Shift```_ o ```CLS```. El «movimiento inesperado de contenido» en español, mide la estabilidad visual cuantificando la frecuencia con la que los usuarios experimentan cambios de diseño inesperados. Así pues, cuanto más bajo sea el CLS, mejor.

**Manz**, de [manz.dev](https://manz.dev/), en su canal de [Discord](https://discord.manz.dev/), cuenta lo siguiente:

>El navegador nunca va a saber las dimensiones (ancho y alto) de la imagen hasta descargar la imagen. Si la imagen es pesada va a tardar un rato y no es posible "reservar" ese espacio en la web porque no lo conoce. La única forma de evitar el CLS es indicarle tú previamente el tamaño para que no haya "salto".

Mediante la opción propuesta, podemos resolver este problema si somos nosotros los que desarrollamos todo el código, pero si estamos trabajando con _frameworks_, también hay soluciones disponibles. **Manz** sigue diciendo:

> Hay una forma de evitarlo, si estás usando SSG (eleventy, astro, next, etc...) y es que en la fase de "compilación" le pases algún plugin que vaya mirando las imágenes y sacando sus dimensiones con node y añadiendo automáticamente el width y height. Yo, por ejemplo, uso este: [image-size](https://www.npmjs.com/package/image-size)

Como indica **Manz**, [image-size](https://www.npmjs.com/package/image-size) es una opción que permite obtener las dimensiones de una imagen y que podemos instalar con npm.

# Un truco

Em Twitter **Manz** contaba:

> Otras soluciones más simples e ingeniosas pueden ser establecer un alto máximo para el contenedor, de modo que no haga reflow de elementos inferiores, y los items del interior (galería) los vas haciendo aparecer a medida que se carguen con CSS/JS.

Esta, sin duda, es otra opción.

# Resumen

En Twitter, **Manz** proponía también estas tres opciones para evitar el _reflow_ que podemos tomar a modo de resumen:

>1) Establecer siempre el width y height (tedioso)  
>2) Usar aspect-ratio de CSS (https://caniuse.com/mdn-css_properties_aspect-ratio)  
>3) Automatizar con alguna herramienta de preprocesado. Yo en 11ty uso image-size o soluciones parecidas

# Enlaces

* Ejemplo de uso de la solución propuesta: [Galería de perritos](https://javguerra.github.io/ejercicios-web-javascript/17-fetch.html).
* Módulo [image-size](https://www.npmjs.com/package/image-size).
* [Page Speed de Google](https://pagespeed.web.dev/).
* [¿Qué es el Cumulative Layout Shift (CLS)?](https://www.itdo.com/blog/que-es-el-cumulative-layout-shift-cls/).
* Twitter de @Manz: [¿Qué es «FUOC»?](https://twitter.com/Manz/status/1527681719964512256).
* Web de @Manz: [manz.dev](https://manz.dev/).
