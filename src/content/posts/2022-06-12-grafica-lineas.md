---
route: grafica-lineas
title: Gráfica de lineas dinámica con SVG
description: Mostrar resultados gráficos con JavaScript.
author: JavGuerra
pubDate: 2022-06-12
coverImage:
  image: '@/assets/img/graficalineas.png'
  alt: Gráfica de líneas
tags:
    - código
    - CSS
    - HTML
    - JavaScript
    - SVG
    - usabilidad
---
Como comentaba en el anterior artículo sobre [la creación de un contador de resultados](/blog/contador-resultados), la representación visual ayuda a asumir mejor la información. En este artículo mostraré cómo elaborar una gráfica de líneas dinámica que represente, por ejemplo, las puntuaciones de las últimas cinco jugadas con valores en un rango entre cero y diez.

[<button>Ver gráfica de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/graficalineas.html)

## La gráfica de líneas

Primeramente toca diseñar una gráfica en .SVG que sirva de base para mostrar la línea de resultados que pretendo. Esto lo hago con [InkScape](https://inkscape.org/es/). La gráfica que muestra la imagen es muy sencilla, y de ella destaca la línea roja, que, inicialmente, dibujo en la posición de la línea de puntuación cero. como se puede ver aquí:

![Gráfica de líneas](https://javguerra.github.io/ejercicios-web-javascript/img/graficalineas.svg)

He rehecho a mano la línea roja para poder acceder a los nodos con más facilidad, empleando el elemento ```polyline``` con los siguientes valores:

```html
<polyline id="theline" points="11 73 33.5 73 56 73 78.5 73 101 73"
fill="none" marker-end="url(#dotLine)" marker-mid="url(#dotLine)" marker-start="url(#dotLine)"
stroke="#d8232a" stroke-linecap="round" stroke-linejoin="round"/>
```
En ```points="11 73 33.5 73 56 73 78.5 73 101 73"``` está toda la magia. Este parámetro contiene los valores de los puntos de la linea creada, diez valores en total que corresponden a la posición __x__ e __y__ de cada punto. Si tengo la ubicación de los puntos de la línea, y un identificador ```id="theline"``` para poder hacer cambios, ya puedo representar valores en la gráfica dinámicamente.

Para los círculos en los puntos de conexión de la línea, que son referenciados en marker-end, marker-mid y marker-start, hice los siguientes cambios en el SVG:

```html
<marker id="dotLine" overflow="visible" orient="auto">
    <circle transform="scale(.2) translate(-8 -8)" cx="8" cy="8" r="8"
        fill="#f0fff0" stroke="#d8232a" stroke-width="4"/>
</marker>
```

## Presentación

Como hicimos en [la creación de un contador de resultados](/blog/contador-resultados), para poder acceder al identificador dentro del SVG, este debe estar disponible en el DOM, por lo que no sería posible acceder a su __id__ haciendo uso del elemento ```<img>``` de HTML.

El código HTML para insertar «en linea» el SVG sería el siguiente:

```html
<div id="contenedor">

    <h1>Gráfica dinámica</h1>

    <svg id="grafica" version="1.1" viewBox="0 0 105.83 79.375" xmlns="http://www.w3.org/2000/svg">
        <title>Gráfica de líneas</title>
        <desc>Muestra una gráfica con dos ejes. En el eje horizontal, se muestran las últimas cinco partidas ordenadas de más antigua a más reciente. En el eje vertical, los ciertos de cada uno de los partidos. La línea une las diferentes puntuaciones del gráfico.</desc>
        <defs><marker id="dotLine" overflow="visible" orient="auto"><circle transform="scale(.2) translate(-8 -8)" cx="8" cy="8" r="8" fill="#f0fff0" stroke="#d8232a" stroke-width="4"/></marker></defs>
        ...
        <polyline id="laLinea" points="11 73 33.5 73 56 73 78.5 73 101 73" fill="none" marker-end="url(#dotLine)" marker-mid="url(#dotLine)" marker-start="url(#dotLine)" stroke="#d8232a" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <p id="arreglo"></p>

</div>
```
Para no ocupar espacio de esta entrada, el SVG no se muestra completo. Los puntos suspensivos corresponden a las etiquetas que deberían estar ahi. El SVG como se aprecia, estaría incrustado, y el elemento de la línea bien identificado con ```id="laLinea"```.

En el párrafo ```"arreglo"``` es donde se mostrarán los valores numéricos que se usarán para representar la gráfica.

Como dijimos en el anterior artículo, la gráfica en SVG ocupa lo suyo. Hay técnicas para [cargar dinámicamente la imagen](/blog/carga-svg) sin necesidad de colocar el SVG _in-line_ desde el principio.

Deliberadamente he eliminado los atributos ```width="400"``` y ```height="300"``` de la etiqueta ```svg``` porque voy a manejar estos valores desde CSS, aunque dejarlas tampoco sería un problema.

Los estilos CSS para mostrar correctamente estos elementos son los siguientes:

```css
#contenedor {text-align: center}

#grafica {
    width: 100%;
    max-width: 400px;
    height: auto}

#laLinea {animation: elevador 1s ease}

@keyframes elevador {
    0%   {transform: translateY(73px) scaleY(0)}
    100% {transform: translateY(0)    scaleY(1)}
}
```
Como se ve, he definido también una animación para mostrar el resultado. Al cargar los nuevos valores de la gráfica, los puntos de la línea estarán en la posición del eje de la puntuación cero, (en la posición 73px) con una escala de 0, es decir la línea estará totalmente aplastada. Durante un segundo, irá tomando su forma original ocupando toda la gráfica con las medidas correctas. Esto hace el efecto de que los nodos de la línea se elevan hasta la posición que debe ocupar en la gráfica. Se entiende mejor [viendo el ejemplo](https://javguerra.github.io/ejercicios-web-javascript/graficalineas.html).

## Dinamismo

Ya disponemos de la gráfica incrustada en el HTML, y en esta parte veremos el motivo de toda esta preparación.

El siguiente código en JavaScript permite obtener el resultado esperado:

```javascript
const elLinea = document.getElementById('laLinea');
const elArreg = document.getElementById('arreglo');
let ejesY = [];

for (let i = 0; i < 5; i++) {
    ejesY.push(Math.floor(Math.random() * 11)); // 0-10
}
elArreg.textContent = `Valores = [${ejesY}]`;
fijaLinea(ejesY);

function fijaLinea(ordenadas = []) {
    let numOrd = ordenadas.length;
    if(numOrd < 5) for (let i = 0; i < 5 - numOrd; i++) ordenadas.push(0);
    let ord = ordenadas.slice(-5).map(y => 73 - y * 7.1);
    elLinea.setAttribute('points',
        `11 ${ord[0]} 33.5 ${ord[1]} 56 ${ord[2]} 78.5 ${ord[3]} 101 ${ord[4]}`);
}
```
Primeramente obtengo los elementos que emplearé en el código ```elLinea``` y ```elArreg```, y declaro el arreglo ```ejesY``` que contendrá los valores a mostrar. Seguidamente relleno el arreglo con cinco valores al azar en un rango entre 0 y 10. Muestro los valores en la web, llamo a la función ```fijaLinea(ejesY)``` y le paso como parámetro el arreglo. Esta función es la responsable de que la línea tenga la forma deseada.

En la posición y = 73 está la línea de la puntuación 0. Cada línea de puntuación esta a una distancia de -7.1px. Así: 0 = 73, 1 = 65,9, .. 9 = 9,1, 10 = 2. Con estos datos, la función ```fijaLinea()``` funciona de la siguiente manera: Si el arreglo que le pasamos tiene un número de elementos menor que cinco, rellena a ceros el arreglo. Después toma los últimos cinco elementos del arreglo (pudiera ser que el arreglo recibido tuviese más de cinco elementos).

A cada elemento del array le aplica el cálculo necesario para convertir la puntuación a la coordenada «__y__» correspondiente. Con este nuevo arreglo, ya podemos pasar los datos de la línea al SVG con ```setAttribute```. El valor inicial del atributo ```points```:

```html
points="11 73 33.5 73 56 73 78.5 73 101 73"
```
pasa a ser:

```html
`11 ${ord[0]} 33.5 ${ord[1]} 56 ${ord[2]} 78.5 ${ord[3]} 101 ${ord[4]}`
```
siendo los valores del arreglo ```ord``` cada una de las cinco posiciones «__y__» de los puntos de la polilínea. Esto es todo lo que necesitamos para mostrar los datos.

## El código completo

Con cada recarga de la página, la gráfica mostrará valores distintos.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gráfica de líneas</title>

    <style>
        #contenedor {text-align: center}

        #grafica {
            width: 100%;
            max-width: 400px;
            height: auto}

        #laLinea {animation: elevador 1s ease}

        @keyframes elevador {
            0%   {transform: translateY(73px) scaleY(0)}
            100% {transform: translateY(0)    scaleY(1)}
        }
    </style>
</head>
<body>
    <div id="contenedor">

        <h1>Gráfica dinámica</h1>

        <svg id="grafica" version="1.1" viewBox="0 0 105.83 79.375" xmlns="http://www.w3.org/2000/svg">
            <title>Gráfica de líneas</title>
            <desc>Muestra una gráfica con dos ejes. En el eje horizontal, se muestran las últimas cinco partidas ordenadas de más antigua a más reciente. En el eje vertical, los ciertos de cada uno de los partidos. La línea une las diferentes puntuaciones del gráfico.</desc>
            <defs><marker id="dotLine" overflow="visible" orient="auto"><circle transform="scale(.2) translate(-8 -8)" cx="8" cy="8" r="8" fill="#f0fff0" stroke="#d8232a" stroke-width="4"/></marker></defs>
            <g transform="matrix(.99339 0 0 .97827 .43246 .039862)" fill="none"><g stroke="#ccc" stroke-width=".26839"><path d="m105.57 9.424h-99.395"/><path d="m105.57 16.73h-99.408"/><path d="m105.57 24.037h-99.309"/><path d="m105.57 31.343h-99.438"/><path d="m105.57 38.649h-99.515"/><path d="m105.57 45.956h-99.435"/><path d="m105.57 53.262h-99.416"/><path d="m105.57 59.999h-99.416"/><path d="m105.57 67.305h-99.469"/><path d="m10.957 1.98v72.528"/><path d="m100.96 1.9385v72.528"/><path d="m33.458 1.98v72.528"/><path d="m55.959 1.98v72.528"/><path d="m78.461 1.98v72.528"/></g><rect x="6.2237" y="2.1209" width="99.342" height="72.487" stroke="#3cb371" stroke-linecap="round" stroke-width=".53688"/></g><g transform="matrix(1.0003 0 0 1.0006 .44383 .038459)" fill="#3cb371" stroke-width=".26458" aria-label="109876543210"><path d="m1.1672 4.0498h-0.44855v-2.9735l-0.89951 0.33038v-0.40514l1.2781-0.4799h0.069935z"/><path d="m4.676 2.5522q0 0.78376-0.26768 1.1648-0.26768 0.38103-0.83681 0.38103-0.5619 0-0.83199-0.37138-0.2701-0.37379-0.27974-1.1141v-0.59566q0-0.77411 0.26768-1.1503 0.26768-0.3762 0.83923-0.3762 0.56672 0 0.8344 0.36415 0.26768 0.36174 0.27492 1.119zm-0.44614-0.61013q0-0.56672-0.15916-0.82476-0.15916-0.26045-0.50402-0.26045-0.34244 0-0.49919 0.25804t-0.16158 0.79341v0.71382q0 0.56913 0.16399 0.84164 0.1664 0.2701 0.50161 0.2701 0.33038 0 0.48955-0.25563 0.16158-0.25563 0.16881-0.80546z"/><path d="m4.1841 9.5492q-0.13987 0.1664-0.33521 0.26768-0.19293 0.10129-0.42444 0.10129-0.30386 0-0.53054-0.14952-0.22428-0.14952-0.34727-0.41961-0.12299-0.27251-0.12299-0.60048 0-0.35209 0.13264-0.63424 0.13505-0.28215 0.38103-0.43167t0.57395-0.14952q0.5209 0 0.81993 0.39067 0.30145 0.38826 0.30145 1.0611v0.13022q0 1.0249-0.40514 1.4976-0.40514 0.47026-1.2227 0.48231h-0.086816v-0.3762h0.094051q0.55225-0.0096 0.84887-0.28698 0.29662-0.27974 0.32315-0.88263zm-0.6873 0q0.22428 0 0.41238-0.13746 0.19051-0.13746 0.27733-0.34003v-0.17846q0-0.43891-0.19051-0.71382-0.19051-0.27492-0.48231-0.27492-0.29421 0-0.47267 0.22669-0.17846 0.22428-0.17846 0.59325 0 0.35932 0.17122 0.59325 0.17363 0.23151 0.46302 0.23151z"/><path d="m4.6037 15.541q0 0.26286-0.13987 0.46784-0.13746 0.20498-0.37379 0.32074 0.27492 0.11817 0.43408 0.34485 0.16158 0.22669 0.16158 0.51366 0 0.45579-0.30868 0.72588-0.30627 0.2701-0.80788 0.2701-0.50643 0-0.8127-0.2701-0.30386-0.27251-0.30386-0.72588 0-0.28456 0.15434-0.51366 0.15675-0.2291 0.43167-0.34727-0.23392-0.11576-0.36897-0.32074t-0.13505-0.46543q0-0.44373 0.28456-0.70418t0.75-0.26045q0.46302 0 0.74759 0.26045 0.28698 0.26045 0.28698 0.70418zm-0.36415 1.6375q0-0.29421-0.1881-0.4799-0.18569-0.18569-0.48714-0.18569t-0.48472 0.18328q-0.18087 0.18328-0.18087 0.48231t0.17604 0.47026q0.17846 0.17122 0.49437 0.17122 0.3135 0 0.49196-0.17122 0.17846-0.17363 0.17846-0.47026zm-0.67042-2.2355q-0.26286 0-0.42685 0.16399-0.16158 0.16158-0.16158 0.44132 0 0.26768 0.15916 0.43408 0.16158 0.16399 0.42926 0.16399t0.42685-0.16399q0.16158-0.1664 0.16158-0.43408t-0.1664-0.43649-0.42202-0.16881z"/><path d="m4.7411 21.918-1.4542 3.2604h-0.46784l1.4494-3.1447h-1.9003v-0.36656h2.373z"/><path d="m4.2251 28.707v0.37862h-0.081993q-0.5209 0.0096-0.82958 0.30868-0.30868 0.29903-0.35691 0.84164 0.27733-0.31833 0.75723-0.31833 0.4582 0 0.7307 0.32315 0.27492 0.32315 0.27492 0.8344 0 0.5426-0.29662 0.86816-0.29421 0.32556-0.79099 0.32556-0.50402 0-0.81752-0.38585-0.3135-0.38826-0.3135-0.99839v-0.17122q0-0.96945 0.41238-1.4807 0.41479-0.51366 1.2323-0.52572zm-0.58601 1.582q-0.2291 0-0.42202 0.13746-0.19293 0.13746-0.26768 0.34486v0.16399q0 0.43408 0.19534 0.69936 0.19534 0.26527 0.48714 0.26527 0.30145 0 0.47267-0.22186 0.17363-0.22186 0.17363-0.58119 0-0.36174-0.17604-0.5836-0.17363-0.22428-0.46302-0.22428z"/><path d="m2.6793 37.503 0.17846-1.7508h1.799v0.41238h-1.4204l-0.10611 0.95739q0.25804-0.15193 0.58601-0.15193 0.4799 0 0.76206 0.31833 0.28215 0.31592 0.28215 0.85611 0 0.5426-0.29421 0.85611-0.2918 0.31109-0.81752 0.31109-0.46543 0-0.75964-0.25804t-0.33521-0.71382h0.42202q0.040997 0.30145 0.21463 0.45579 0.17363 0.15193 0.4582 0.15193 0.31109 0 0.48714-0.21222 0.17846-0.21222 0.17846-0.58601 0-0.35209-0.19293-0.56431-0.19051-0.21463-0.50884-0.21463-0.2918 0-0.4582 0.12781l-0.11817 0.09646z"/><path d="m4.3577 45.127h0.48714v0.36415h-0.48714v0.81511h-0.44855v-0.81511h-1.5989v-0.26286l1.5723-2.4333h0.47508zm-1.541 0h1.0924v-1.7219l-0.053055 0.09646z"/><path d="m3.123 51.377h0.33521q0.31592-0.0048 0.49678-0.1664 0.18087-0.16158 0.18087-0.43649 0-0.61736-0.61495-0.61736-0.28939 0-0.46302 0.1664-0.17122 0.16399-0.17122 0.43649h-0.44614q0-0.4172 0.30386-0.69212 0.30627-0.27733 0.77652-0.27733 0.49678 0 0.77894 0.26286 0.28215 0.26286 0.28215 0.7307 0 0.2291-0.14952 0.44373-0.14711 0.21463-0.40273 0.32074 0.28939 0.09164 0.44614 0.30386 0.15916 0.21222 0.15916 0.51849 0 0.47267-0.30868 0.75t-0.80305 0.27733-0.80546-0.26768q-0.30868-0.26768-0.30868-0.70659h0.44855q0 0.27733 0.18087 0.44373t0.48472 0.1664q0.32315 0 0.49437-0.16881t0.17122-0.48472q0-0.30627-0.1881-0.47026t-0.5426-0.16881h-0.33521z"/><path d="m4.7749 60.392h-2.3006v-0.32074l1.2154-1.3505q0.2701-0.30627 0.37138-0.49678 0.1037-0.19292 0.1037-0.39791 0-0.27492-0.1664-0.45096t-0.44373-0.17604q-0.3328 0-0.51849 0.19051-0.18328 0.1881-0.18328 0.52572h-0.44614q0-0.48472 0.31109-0.78376 0.3135-0.29903 0.83681-0.29903 0.48955 0 0.77411 0.25804 0.28456 0.25563 0.28456 0.68247 0 0.51849-0.66077 1.2347l-0.94051 1.0201h1.7629z"/><path d="m3.9405 67.435h-0.44855v-2.9735l-0.89951 0.33038v-0.40514l1.2781-0.4799h0.069935z"/><path d="m4.676 72.98q0 0.78376-0.26768 1.1648-0.26768 0.38103-0.83681 0.38103-0.5619 0-0.83199-0.37138-0.2701-0.37379-0.27974-1.1141v-0.59566q0-0.77411 0.26768-1.1503 0.26768-0.3762 0.83923-0.3762 0.56672 0 0.8344 0.36415 0.26768 0.36174 0.27492 1.119zm-0.44614-0.61013q0-0.56672-0.15916-0.82476-0.15916-0.26045-0.50402-0.26045-0.34244 0-0.49919 0.25804t-0.16158 0.79341v0.71382q0 0.56913 0.16399 0.84164 0.1664 0.2701 0.50161 0.2701 0.33038 0 0.48955-0.25563 0.16158-0.25563 0.16881-0.80546z"/></g><g transform="translate(-.061333 -.081667)" fill="#3cb371" stroke-width=".26458"><g transform="translate(.46707)" aria-label="1"><path d="m11.524 79.312h-0.44855v-2.9735l-0.89952 0.33038v-0.40514l1.2781-0.4799h0.06993z" fill="#3cb371"/></g><g transform="translate(.33346)" aria-label="3"><path d="m55.289 77.34h0.33521q0.31592-0.0048 0.49678-0.1664 0.18087-0.16158 0.18087-0.43649 0-0.61736-0.61495-0.61736-0.28939 0-0.46302 0.1664-0.17122 0.16399-0.17122 0.43649h-0.44614q0-0.4172 0.30386-0.69212 0.30627-0.27733 0.77652-0.27733 0.49678 0 0.77894 0.26286t0.28215 0.7307q0 0.2291-0.14952 0.44373-0.1471 0.21463-0.40273 0.32074 0.28939 0.09164 0.44614 0.30386 0.15916 0.21222 0.15916 0.51849 0 0.47267-0.30868 0.75t-0.80305 0.27733-0.80546-0.26768q-0.30868-0.26768-0.30868-0.70659h0.44855q0 0.27733 0.18087 0.44373t0.48472 0.1664q0.32315 0 0.49437-0.16881t0.17122-0.48472q0-0.30627-0.1881-0.47026t-0.5426-0.16881h-0.33521z" fill="#3cb371"/></g><g transform="translate(.49737)" aria-label="2"><path d="m34.356 79.312h-2.3006v-0.32074l1.2154-1.3505q0.2701-0.30627 0.37138-0.49678 0.1037-0.19293 0.1037-0.39791 0-0.27492-0.1664-0.45096t-0.44373-0.17604q-0.3328 0-0.51849 0.19051-0.18328 0.1881-0.18328 0.52572h-0.44614q0-0.48472 0.31109-0.78376 0.3135-0.29904 0.83681-0.29904 0.48955 0 0.77411 0.25804 0.28456 0.25563 0.28456 0.68247 0 0.51849-0.66077 1.2347l-0.94051 1.0201h1.7629z" fill="#3cb371"/></g><g transform="translate(-.47277)" aria-label="5"><path d="m100.22 77.552 0.17846-1.7508h1.799v0.41238h-1.4204l-0.10611 0.95739q0.25804-0.15193 0.58602-0.15193 0.4799 0 0.76205 0.31833 0.28215 0.31592 0.28215 0.85611 0 0.5426-0.29421 0.85611-0.2918 0.31109-0.81752 0.31109-0.46543 0-0.75964-0.25804t-0.33521-0.71382h0.42202q0.041 0.30145 0.21463 0.45579 0.17364 0.15193 0.4582 0.15193 0.31109 0 0.48714-0.21222 0.17845-0.21222 0.17845-0.58601 0-0.35209-0.19292-0.56431-0.19052-0.21463-0.50884-0.21463-0.2918 0-0.4582 0.12781l-0.11817 0.09646z" fill="#3cb371"/></g><g transform="translate(-.13501)" aria-label="4"><path d="m79.29 78.133h0.48714v0.36415h-0.48714v0.81511h-0.44855v-0.81511h-1.5989v-0.26286l1.5723-2.4333h0.47508zm-1.541 0h1.0924v-1.7219l-0.05305 0.09646z" fill="#3cb371"/></g></g>
            <polyline id="laLinea" points="11 73 33.5 73 56 73 78.5 73 101 73" fill="none" marker-end="url(#dotLine)" marker-mid="url(#dotLine)" marker-start="url(#dotLine)" stroke="#d8232a" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <p id="arreglo"></p>

    </div>

    <script>
        const elLinea = document.getElementById('laLinea');
        const elArreg = document.getElementById('arreglo');
        let ejesY = [];

        for (let i = 0; i < 5; i++) {
            ejesY.push(Math.floor(Math.random() * 11)); // 0-10
        }
        elArreg.textContent = `Valores = [${ejesY}]`;
        fijaLinea(ejesY);

        function fijaLinea(ordenadas = []) {
            let numOrd = ordenadas.length;
            if(numOrd < 5) for (let i = 0; i < 5 - numOrd; i++) ordenadas.push(0);
            let ord = ordenadas.slice(-5).map(y => 73 - y * 7.1);
            elLinea.setAttribute('points',
                `11 ${ord[0]} 33.5 ${ord[1]} 56 ${ord[2]} 78.5 ${ord[3]} 101 ${ord[4]}`);
        }
    </script>
</body>
</html>
```

Con estas indicaciones, hacer tu propia gráfica de líneas no debería ser excesivamente complicado.

Para conocer más sobre SVG y cómo editarlo, te recomiendo el libro [SCALABLE](https://leanpub.com/scalable/) de Jorge Aznar.

## Enlaces

[<button>Ver gráfica de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/graficalineas.html)  

* Ver ejemplo de aplicación práctica. [Summer Quiz](https://javguerra.github.io/summer-quiz/) (Es necesario terminar una partida para obtener resultados.)
* Ver también: [Creación de un contador de resultados](/blog/contador-resultados)
* Ver también: [Cargar SVG dinámicamente](/blog/carga-svg)
* [Tutorial SVG](http://w3.unpocodetodo.info/svg/introduccion.php).
* Libro sobre SVG [SCALABLE](https://leanpub.com/scalable/) de Jorge Aznar.