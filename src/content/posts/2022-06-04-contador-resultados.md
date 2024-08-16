---
route: contador-resultados
title: Contador de resultados
description: Gráfica SVG dinámica en JavaScript con aguja indicadora de resultados.
author: JavGuerra
pubDate: 2022-06-04
coverImage:
  image: '@/assets/img/contador.png'
  alt: Contador
tags:
    - código
    - CSS
    - HTML
    - JavaScript
    - SVG
    - usabilidad
---
La información visual es percibida con más claridad que la escrita. A la hora de mostrar resultados, por ejemplo los aciertos o fallos de un examen on-line, podemos complementar la información escrita con una gráfica dinámica que muestre los resultados de un vistazo, aportando además valor al resultado.

[<button>Ver contador de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/contador.html)

## El contador

Para mostrar la información de este ejemplo, he elaborado una gráfica en formato .SVG que contiene un contador en semicírculo con paneles descriptivos. La aguja apunta a los paneles rotulados con el texto: «insuficiente», «regular», «bien» y «excelente» según un resultado numérico entre 0 y 10, donde 0 es ninguna pregunta acertada y diez corresponde a un total de diez sobre diez preguntas contestadas correctamente.

El fichero SVG lo he creado con [InkScape](https://inkscape.org/es/), una herramienta libre de dibujo vectorial. el diseño asemeja algunas imágenes que encontré haciendo una búsqueda por Internet. Para su elaboración, he tenido en cuenta dos cuestiones importantes:

1. El tamaño del dibujo tiene las proporciones (ancho x alto) de la imagen que se mostrará en la página. En el caso de este contador, 400px x 240px. Es importante guardar el documento con la medida en píxeles, para poder trabajar después con el tamaño de la imagen desde CSS, si queremos aplicarle distintos tamaños, por ejemplo para la visualización de esta gráfica en diferentes tipos de pantalla (móviles, tablets...).
2. La gráfica cuenta con una aguja indicadora. Para poder acceder a ella desde JavaScript y que la aguja apunte adecuadamente, he incluido una etiqueta ID (```id="aguja"```) en el elemento SVG que agrupa las líneas del dibujo que corresponden a la aguja. Esto podemos hacerlo directamente desde InkScape. En este caso, el elemento quedaría así:

```html
<g id="aguja" transform="matrix(.28946 0 0 .28839 126 -138.93)">
```
El atributo «transform» dentro del SVG indica la posición de la aguja, su tamaño y ángulo de giro. El que se muestra aquí corresponde a la aguja en posición vertical, equivalente a un resultado de 5, entre 0 y 10. Para cubrir todo el rango de puntuaciones, la aguja debe girar 18 grados en un sentido y en otro, es decir, que irá girando de 0 a 180 grados en saltos de 18 grados.

Calcular los valores de la posición de la aguja en cada uno de esos intervalos no es tarea fácil. Para acortar camino, guardé la misma gráfica con la aguja en las distintas 11 posiciones y obtuve el valor de transform en cada una de ellas. Este será el valor que luego pasaremos a la gráfica para indicar qué posición debe tener la aguja en función de la puntuación obtenida. Esta es la tabla obtenida:

![Contadores](https://javguerra.github.io/ejercicios-web-javascript/img/contadores.png)

| Puntos | Valores de la aguja |
| :------ |:--- |
| 0 | transform="matrix(0 -.28946 .28839 0 -139.16 -20.501)" |
| 1 | transform="matrix(.089449 -.2753 .27428 .089119 -107.1 -76.177)" |
| 2 | transform="matrix(.17014 -.23418 .23332 .16951 -59.407 -119.22)" |
| 3 | transform="matrix(.23418 -.17014 .16951 .23332 -.74583 -145.42)" |
| 4 | transform="matrix(.2753 -.089449 .089119 .27428 63.14 -152.21)" |
| 5 | transform="matrix(.28946 0 0 .28839 126 -138.93)" |
| 6 | transform="matrix(.2753 .089449 -.089119 .27428 181.67 -106.87)" |
| 7 | transform="matrix(.23418 .17014 -.16951 .23332 224.72 -59.174)" |
| 8 | transform="matrix(.17014 .23418 -.23332 .16951 250.92 -.51273)" |
| 9 | transform="matrix(.089449 .2753 -.27428 .089119 257.71 63.373)" |
| 10 | transform="matrix(0 .28946 -.28839 0 244.42 126.23)" |

Teniendo el SVG y esta información, usando JavaScript podemos mostrar una gráfica dinámica de resultados.

## Presentación

En el ejemplo, la gráfica aparece con un recuadro de texto debajo que indica también el resultado. Mediante CSS posiciono la gráfica con un valor de margen superior negativo para que esta quede justo por encima del recuadro, lo que consigue el efecto de que la gráfica y el recuadro está unidos por la intersección de la aguja.

El código html sería el siguiente:

```html
<div id="resultados">

    <svg version="1.1" viewBox="0 0 105.83 58.208" xmlns="http://www.w3.org/2000/svg">
        <title>Contador con aguja</title>
        <desc>La aguja indica los aciertos de 0 a 10 en un contador en forma de semicírculo que tiene cuatro zonas rotuladas con el texto: «insuficiente», «regular», «bien» y «excelente».</desc>

        ...

        <g id="aguja" transform="matrix(.28946 0 0 .28839 126 -138.93)">

        ...

    </svg>

    <p><span id="nota">0</span> de 10 aciertos</p>
</div>
```
Para no ocupar espacio de esta entrada el SVG no se muestra completo. Los puntos suspensivos corresponden a las etiquetas que deberían estar ahi. El SVG como se aprecia, estaría incrustado, completo, y el elemento que agrupa a los elementos que dibujan la aguja bien identificado.

En el párrafo se mostraría el resultado de forma textual. ambos, imagen y resultado, están dentro de un DIV contenedor llamado «resultados».

La gráfica en SVG ocupa lo suyo. Hay técnicas para [cargar dinámicamente la imagen](carga-svg) sin necesidad de colocar el SVG in-line desde el principio. Por ahora el SVG aparecerá incrustado en la página, ya que si lo enlazamos como una imagen (```<img src="contador.svg" alt="Contador"/>```) no podremos acceder a la etiqueta «aguja» que necesitamos para hacer la gráfica interactiva.

Deliberadamente he eliminado las etiquetas ```width``` y ```height``` de ```svg``` para poderlas manejar desde CSS.

Los estilos CSS para mostrar correctamente estos elementos son los siguientes:

```css
#resultados {
    width: 480px;
    margin: 220px auto;
    text-align: center;
    background-color: lightblue;
    border-radius: 15px;
    border-bottom: 5px solid lightslategray;
}

#resultados svg {
    margin-top: -220px;
    width: 400px;
    height: 220px;
}

#resultados p {
    margin-top: 0.25em;
    margin-bottom: 0.5em;
    font-family:Arial, Helvetica, sans-serif;
    font-size: xxx-large;
    color: red;
    text-shadow: 2px 2px 0 DimGray;
}
```
## Dinamismo

Ya disponemos de la gráfica incrustada en el HTML correctamente representada con CSS, y la tabla de posiciones de la aguja, y en esta parte veremos el motivo de toda esta preparación.

El siguiente código en JavaScript permite obtener el resultado esperado:

```javascript
const nota = document.getElementById('nota');
let aciertos = Math.floor(Math.random() * 10);

nota.textContent = aciertos;
ponAguja(aciertos);

function ponAguja(aciertos) {
    const aguja = document.getElementById('aguja');
    const posicionAguja = [
        '0 -.28946 .28839 0 -139.16 -20.501',
        '.089449 -.2753 .27428 .089119 -107.1 -76.177',
        '.17014 -.23418 .23332 .16951 -59.407 -119.22',
        '.23418 -.17014 .16951 .23332 -.74583 -145.42',
        '.2753 -.089449 .089119 .27428 63.14 -152.21',
        '.28946 0 0 .28839 126 -138.93',
        '.2753 .089449 -.089119 .27428 181.67 -106.87',
        '.23418 .17014 -.16951 .23332 224.72 -59.174',
        '.17014 .23418 -.23332 .16951 250.92 -.51273',
        '.089449 .2753 -.27428 .089119 257.71 63.373',
        '0 .28946 -.28839 0 244.42 126.23'
    ]

    aguja.setAttribute('transform', `matrix(${posicionAguja[aciertos]})`);
}
```
Obtengo el elemento «nota» donde pondremos el número de aciertos.

La variable «aciertos», en este ejemplo, se obtiene aleatoriamente en un rango entero entre 0 y 10.

Pongo los aciertos y llamo a la función ```ponAguja(aciertos)``` y le paso el parámetro «aciertos».

La función obtiene el elemento del SVG identificado con «aguja», y contiene un arreglo ```posicionAguja[]``` con todos los valores posibles para la aguja, desde 0 a 10.

En la última línea, cambiamos el valor del atributo 'transform' del SVG con el valor correspondiente a los aciertos guardado en el arreglo ```posicionAguja[]```;

## El código completo

Con cada recarga de la página, la gráfica y el cuadro de texto mostrarán un valor distinto.

```html
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contador</title>

    <style>
        #resultados {
            width: 480px;
            margin: 220px auto;
            text-align: center;
            background-color: lightblue;
            border-radius: 15px;
            border-bottom: 5px solid lightslategray;
        }
        
        #resultados svg {
            margin-top: -220px;
            width: 400px;
            height: 220px;
        }

        #resultados p {
            margin-top: 0.25em;
            margin-bottom: 0.5em;
            font-family:Arial, Helvetica, sans-serif;
            font-size: xxx-large;
            color: red;
            text-shadow: 2px 2px 0 DimGray;
        }
    </style>
</head>

<body>
    <div id="resultados">
       
        <svg version="1.1" viewBox="0 0 105.83 58.208" xmlns="http://www.w3.org/2000/svg">
            <title>Contador con aguja</title>
            <desc>La aguja indica los aciertos de 0 a 10 en un contador en forma de semicírculo que tiene cuatro zonas rotuladas con el texto: «insuficiente», «regular», «bien» y «excelente».</desc>
            <g clip-path="url(#a)"><path d="m52.914-0.001674c-4.7395 0-9.4778 0.63742-14.085 1.9017-0.06321 0.01729-0.12652 0.03416-0.18965 0.05168-0.24752 0.0689-0.49482 0.1388-0.74157 0.21136-0.29501 0.08651-0.58912 0.17555-0.88262 0.26716-0.16716 0.05233-0.33398 0.10566-0.50075 0.15968-0.35229 0.1138-0.70374 0.23024-1.0537 0.3514-0.09768 0.03392-0.19494 0.06936-0.2925 0.10387-0.40857 0.14415-0.81597 0.2918-1.2211 0.44596-0.0026 6.09e-4 -0.0032 0.0015-0.0048 0.0021-2.598 0.98893-5.1231 2.1832-7.5494 3.576-3.2712 1.8893-6.2375 4.028-9.0004 6.5319-10.096 9.0697-16.394 21.745-17.385 35.433-0.01191 0.16487-0.0085 0.32633 0.0026 0.48575-0.07855 1.0993-0.12549 2.2058-0.13951 3.3186l106.09 2.7e-5c-0.01-1.1385-0.0541-2.2702-0.13229-3.3946 6e-3 -0.13439 5e-3 -0.27062-5e-3 -0.40876-0.93929-12.97-6.6434-25.03-15.827-33.976l7e-3 -0.0072c-3.2035-3.1564-6.6655-5.7325-10.563-7.984-4.1446-2.3803-8.5755-4.1793-13.168-5.3666-0.0541-0.01402-0.10813-0.02852-0.16227-0.04237-0.40282-0.10279-0.80713-0.20018-1.2123-0.29352-0.12364-0.02855-0.24725-0.05658-0.37105-0.08423-0.37005-0.08246-0.74075-0.16212-1.1126-0.23668-0.15193-0.03054-0.30417-0.05865-0.4563-0.08785-0.27332-0.05233-0.54692-0.10285-0.82114-0.1509-0.24984-0.04391-0.50001-0.08526-0.75033-0.12557-0.21667-0.03478-0.43346-0.06866-0.65061-0.10077-0.41838-0.06208-0.83732-0.11847-1.2568-0.17053-0.07014-0.0087-0.14015-0.01845-0.21032-0.02687-0.0066-7.93e-4 -0.01323-0.0013-0.01958-0.0021-0.27715-0.03317-0.55448-0.06421-0.832-0.09302-1.8286-0.18982-3.6647-0.28891-5.501-0.28891z" fill="#fff" stroke-width=".26458"/><g stroke-width=".28892"><path d="m14.799 16.135c-9.531 9.9166-14.753 22.823-14.928 36.701h31.392c0.09043-5.5163 2.2581-10.797 6.0732-14.796z" fill="#f97301"/><path d="m51.864 0.020187c-8.951 0.16984-17.713 2.594-25.47 7.0468-3.8979 2.2513-7.365 4.8542-10.568 8.0106l22.427 22.033c3.7181-3.4716 8.5272-5.555 13.612-5.8964z" fill="#ffe900"/><path d="m91.031 16.135c9.5273 9.8511 14.813 22.791 14.928 36.701h-31.392c-0.090433-5.5163-2.2581-10.797-6.0732-14.796z" fill="#0cb200"/><path d="m53.271 0.0057678v31.169c5.333 0.1904 10.417 2.2988 14.309 5.9351l22.422-22.06c-3.2035-3.1564-6.6654-5.7323-10.563-7.9838-7.9616-4.5724-16.979-7.0059-26.168-7.0615z" fill="#9bd701"/></g><path d="m53.118 8.6805c-11.772 0.0020187-23.065 4.6483-31.409 12.922-8.3434 8.2745-13.059 19.504-13.115 31.233h3.1687c-0.0035-0.08667-0.0067-0.17336-0.0097-0.26006 0-10.911 4.3503-21.375 12.094-29.09 7.7436-7.715 18.246-12.049 29.198-12.049 10.951-3.7e-5 21.454 4.3342 29.198 12.049 7.7436 7.715 12.094 18.179 12.094 29.09-3e-3 0.0867-0.0062 0.17339-0.0097 0.26006h3.3207c-0.056473-11.73-4.7727-22.96-13.118-31.236-8.3448-8.2759-19.639-12.92-31.412-12.92z" fill="#808080" fill-opacity=".5" stroke-linecap="round" stroke-width=".079454"/><path d="m53.286 0v8.6857c11.439 0.052083 22.391 4.479 30.636 12.384l6.0792-6.0175c-3.1719-3.091-6.7207-5.773-10.563-7.9838-7.9573-4.577-16.97-7.0047-26.154-7.0684zm-1.3525 0.020101c-8.9701 0.16618-17.759 2.5737-25.538 7.0483-3.9002 2.2434-7.431 4.9511-10.568 8.0106l6.2254 6.2024c8.0259-7.7926 18.696-12.272 29.881-12.571zm-37.062 16.013c-9.4804 9.73-14.999 22.87-14.999 36.804h8.7223c0.055006-11.435 4.5492-22.387 12.506-30.598zm76.125 0.01402-6.0416 6.0193c8.0762 8.2283 12.627 19.261 12.693 30.768h8.3133c-8.6e-4 -13.734-5.3674-26.929-14.964-36.79z" fill="#e5e5e5" stroke-linecap="round" stroke-width=".079454"/><path d="m12.171 24.438 0.99192-1.3687 0.2474 0.17797-0.77966 1.0758 0.64324 0.46272 0.7471-1.0309 0.2474 0.17797-0.7471 1.0309 0.78733 0.56637 0.79859-1.1019 0.2474 0.17797-1.0108 1.3948zm-1.511 2.3014 1.2275-1.899 0.25655 0.16461-0.51509 0.79688 1.9966 1.281-0.19729 0.30523-1.9966-1.281-0.51509 0.79688zm-1.2563 2.1918 0.24028-0.42344 2.5365 0.06864-1.9517-1.0993 0.17314-0.30514 2.3329 1.314-0.24028 0.42344-2.5365-0.06864 1.9517 1.0993-0.17314 0.30514zm-1.1115 2.2062 0.74762-1.515 0.27384 0.13414-0.58763 1.1908 0.71198 0.34875 0.56309-1.1411 0.27384 0.13413-0.56309 1.1411 0.87148 0.42688 0.60187-1.2197 0.27384 0.13413-0.76186 1.5439zm-0.4834 1.0786 0.14749-0.33 2.4482 1.086-0.14748 0.33zm-0.083943 0.6806 0.3552 0.14092q-0.22616 0.10662-0.38157 0.26826-0.15474 0.15998-0.24107 0.37597-0.16999 0.42535 0.00145 0.75518 0.16984 0.32917 0.66347 0.52498 0.49197 0.19516 0.84409 0.07307 0.35045-0.12275 0.52045-0.54808 0.086326-0.21599 0.084311-0.43815-0.00145-0.22382-0.092045-0.45615l0.35187 0.13959q0.049683 0.22375 0.030697 0.44527-0.018323 0.21987-0.10597 0.43919-0.22511 0.56326-0.6998 0.75028-0.47636 0.18638-1.0751-0.05113-0.60034-0.23817-0.81607-0.69912-0.21738-0.4616 0.00773-1.0249 0.08898-0.22264 0.22737-0.39486 0.13739-0.17456 0.32486-0.30039zm-1.3344 2.8983 0.12082-0.34062 2.5268 0.88968-0.12082 0.34059zm-0.68313 2.0879 0.46418-1.4631 0.29097 0.09163-0.35491 1.1186 0.75306 0.23717 0.32029-1.0095 0.29097 0.09163-0.32029 1.0095 1.2203 0.38431-0.10928 0.34445zm-0.75549 2.7512 0.092676-0.35109 1.5745 0.41254q0.41662 0.10916 0.64037 0.0069 0.22199-0.10271 0.31102-0.43997 0.088566-0.33554-0.05399-0.53375-0.14429-0.19869-0.56092-0.30786l-1.5745-0.41254 0.092676-0.35109 1.6179 0.42393q0.5069 0.13282 0.69936 0.45139 0.19292 0.31683 0.064176 0.80455-0.1292 0.48946-0.45405 0.67247-0.3244 0.18128-0.8313 0.04847zm-0.095522 0.81326 0.34599 0.07269q-0.13919 0.18094-0.22438 0.34947-0.085197 0.16852-0.12038 0.33476-0.061105 0.28874 0.017976 0.46984 0.079448 0.17935 0.2867 0.22289 0.17388 0.03653 0.28531-0.0479 0.11004-0.08655 0.22596-0.36559l0.08909-0.20426q0.15922-0.37961 0.39028-0.52663 0.22969-0.14914 0.54934-0.08199 0.38113 0.08007 0.52378 0.37687 0.14302 0.29505 0.038953 0.78679-0.039254 0.18549-0.12585 0.38662-0.086221 0.19938-0.21617 0.40602l-0.36533-0.07675q0.16674-0.18978 0.27191-0.38336t0.14739-0.39305q0.064066-0.30272-0.020552-0.49231-0.084624-0.18958-0.30593-0.23607-0.1932-0.04059-0.32726 0.05553-0.13371 0.09437-0.24518 0.35241l-0.087706 0.20638q-0.16273 0.37886-0.36874 0.5202-0.20601 0.14132-0.50635 0.07822-0.34776-0.07305-0.49651-0.35835-0.14838-0.28705-0.057652-0.71576 0.038886-0.18374 0.11262-0.36747 0.073737-0.18373 0.1827-0.3692zm-0.90022 4.3749 0.077792-0.48023 2.4026-0.81286-2.2133-0.3559 0.056057-0.34604 2.6457 0.42543-0.077795 0.48023-2.4026 0.81286 2.2133 0.3559-0.05606 0.34604zm-0.14762 1.1651 0.045312-0.35841 2.6589 0.33367-0.045312 0.35841zm97.927-3.1896 0.24568 1.6704-0.30194 0.04407-0.19312-1.3129-0.78501 0.11461 0.18504 1.2581-0.30194 0.04408-0.18504-1.2581-0.96082 0.14028 0.19779 1.3448-0.30194 0.04408-0.25036-1.7022zm-0.49787-2.682 0.42747 2.2182-0.29968 0.05732-0.17938-0.93084-2.3322 0.44611-0.06871-0.35654 2.3322-0.44611-0.17939-0.93084zm-0.58818-2.434 0.11608 0.47247-1.8951 1.681 2.1776-0.5311 0.0836 0.34047-2.6031 0.63486-0.11609-0.47247 1.8951-1.681-2.1776 0.5311-0.08365-0.34047zm-0.6953-2.3561 0.48974 1.6162-0.29212 0.08787-0.38496-1.2703-0.75951 0.22846 0.36886 1.2173-0.29212 0.08787-0.36886-1.2173-0.92966 0.27964 0.3943 1.3012-0.29212 0.08787-0.49909-1.647zm-0.71033-2.0476 0.1211 0.3405-2.2384 0.79025 0.43587 1.2255-0.28762 0.10155-0.55698-1.566zm-0.90804-2.2725 0.64298 1.5619-0.28233 0.11536-0.5054-1.2277-0.73404 0.29993 0.48427 1.1764-0.28233 0.11536-0.48427-1.1764-0.89846 0.36712 0.51764 1.2575-0.28233 0.11536-0.65522-1.5917zm-0.46632-0.55948-0.34509 0.16395q0.07511-0.23777 0.06165-0.46119-0.01271-0.22182-0.11314-0.43166-0.19778-0.41323-0.55724-0.51192-0.35783-0.09945-0.83741 0.12839-0.47796 0.22707-0.62726 0.56746-0.14768 0.33961 0.0501 0.75284 0.10044 0.20985 0.26544 0.3593 0.16577 0.15107 0.3985 0.2426l-0.34185 0.16242q-0.19855-0.11568-0.34883-0.28007-0.1495-0.16276-0.25148-0.37583-0.26191-0.54722-0.07718-1.0213 0.18635-0.47489 0.768-0.75123 0.58326-0.2771 1.0693-0.12167 0.48765 0.15466 0.74959 0.70188 0.10353 0.21631 0.13636 0.43449 0.03523 0.21904 5.78e-4 0.44158zm-1.8763-4.1153 0.18709 0.34039-0.55394 1.0587 1.1954 0.10835 0.18709 0.34039-1.5427-0.13704-0.7803 1.4697-0.18709-0.34039 0.63762-1.2042-1.3644-0.11806-0.18795-0.34194 1.7143 0.15146zm-1.2157-1.9899 0.89293 1.4348-0.25934 0.16021-0.70185-1.1278-0.6743 0.41655 0.67253 1.0807-0.25934 0.16021-0.67253-1.0807-0.82531 0.50984 0.71887 1.1551-0.25934 0.16021-0.90995-1.4621zm-20.071-17.151 0.44154 0.20757 0.11797 2.5253 0.95669-2.0201 0.31818 0.14958-1.1436 2.4147-0.44154-0.20757-0.11797-2.5253-0.9567 2.0201-0.31817-0.14958zm-2.2809-0.94304 1.5694 0.63659-0.11507 0.28158-1.2336-0.50039-0.29919 0.73211 1.182 0.47948-0.11507 0.28158-1.182-0.47948-0.36617 0.89609 1.2635 0.51253-0.11507 0.28158-1.5993-0.64873zm-1.1057-0.40663 0.34052 0.12414-0.92092 2.5074-0.34052-0.12413zm-2.5733 0.60562-0.30266 0.93061 0.55324 0.17861q0.27833 0.089862 0.44861 0.018861 0.17252-0.072138 0.24943-0.30861 0.07746-0.23818-0.0209-0.394-0.09612-0.15699-0.37444-0.24684zm0.33974-1.0446-0.24899 0.76556 0.51055 0.16483q0.25272 0.081588 0.40611 0.027714 0.15564-0.05503 0.21872-0.24897 0.06252-0.19224-0.03114-0.32776-0.09196-0.13496-0.34469-0.21655zm-0.25308-0.39377 0.88112 0.28446q0.39445 0.12734 0.55478 0.35956 0.16033 0.23223 0.06239 0.53335-0.0758 0.23307-0.22991 0.3356-0.1541 0.10252-0.3769 0.068187 0.23672 0.13658 0.32032 0.35533 0.08584 0.21758 0.0017 0.47619-0.11066 0.34024-0.40322 0.45072-0.29253 0.11046-0.72116-0.027916l-0.91523-0.29548zm-25.533-0.24008q0.12254 0.01243 0.25808 0.11367 0.13729 0.10082 0.29618 0.29577l0.5219 0.62961-0.37971 0.086471-0.48742-0.5916q-0.18948-0.23202-0.33158-0.28954-0.14034-0.057935-0.35033-0.010122l-0.38498 0.087665 0.25238 1.1001-0.35349 0.080495-0.59716-2.6029 0.79792-0.18171q0.44797-0.10201 0.71123 0.034324 0.26328 0.13633 0.34967 0.5129 0.05639 0.24582-0.02191 0.43426-0.07655 0.18804-0.28088 0.30062zm-1.1362-0.89147 0.21198 0.924 0.44447-0.10121q0.25548-0.058183 0.35818-0.20448 0.10404-0.14843 0.05165-0.37681-0.0524-0.22838-0.21003-0.31357-0.15629-0.087319-0.41176-0.029139zm-2.0189 0.58866-0.11033 1.412 0.94827-0.26718zm-0.29412-0.28697 0.39555-0.11145 1.7121 2.2923-0.36272 0.1022-0.42198-0.5929-1.1624 0.32752-0.04782 0.72527-0.3679 0.10366zm-2.8118 0.88683 0.34385-0.11462 0.75349 2.2437 1.2375-0.41251 0.09682 0.28831-1.5814 0.52712zm-2.6804 1.0151 0.33936-0.13217 0.59273 1.5107q0.15684 0.39974 0.37155 0.51965 0.21406 0.11825 0.54007-0.00871 0.32434-0.12631 0.40116-0.35783 0.07617-0.2332-0.08067-0.63296l-0.59272-1.5107 0.33936-0.13217 0.60908 1.5523q0.19082 0.48637 0.04578 0.82895-0.14337 0.34194-0.61481 0.52553-0.47312 0.18426-0.81292 0.03048-0.33812-0.15442-0.52893-0.64077zm-0.08394 2.5292-0.30055-0.65162-0.53822 0.24642-0.12442-0.26975 0.86444-0.39579 0.48045 1.0416q-0.12862 0.22225-0.32637 0.3974-0.1985 0.17354-0.45946 0.293-0.57084 0.26136-1.0467 0.07772-0.47495-0.18602-0.74854-0.77914-0.27432-0.59475-0.10591-1.0734 0.16929-0.48098 0.74015-0.74234 0.23813-0.10902 0.47877-0.14834 0.24228-0.040072 0.47579-0.00908l0.16114 0.34938q-0.25388-0.070739-0.49535-0.05465-0.24148 0.016092-0.4682 0.11989-0.4469 0.2046-0.5573 0.55628-0.10878 0.35091 0.11833 0.84328 0.22635 0.49075 0.56448 0.63708 0.33977 0.14557 0.78666-0.059034 0.17452-0.079901 0.29803-0.17188 0.12277-0.093603 0.20281-0.20701zm-4.8108-0.18745 1.4983-0.78852 0.14253 0.26882-1.1777 0.61978 0.37057 0.69894 1.1285-0.59391 0.14253 0.26882-1.1285 0.59391 0.45358 0.85548 1.2062-0.63483 0.14253 0.26882-1.5268 0.80357zm-0.50656 1.9236q0.1204-0.0259 0.28071 0.02861 0.16185 0.05359 0.37343 0.19008l0.69169 0.43804-0.3343 0.19918-0.64709-0.41251q-0.25219-0.1623-0.40519-0.17325-0.15144-0.01185-0.3363 0.09828l-0.3389 0.20194 0.58135 0.96847-0.31117 0.18542-1.3755-2.2915 0.70246-0.41857q0.39436-0.23498 0.68706-0.18641 0.29267 0.04857 0.49168 0.3801 0.1299 0.21641 0.11391 0.41972-0.01444 0.2024-0.17385 0.3724zm-1.3572-0.49788 0.48829 0.81346 0.39129-0.23315q0.22492-0.13401 0.27718-0.30477 0.05289-0.17321-0.0678-0.37427t-0.29704-0.23352q-0.17573-0.03491-0.40064 0.09911z" stroke-width=".076444"/></g><g id="aguja" transform="matrix(.28946 0 0 .28839 126 -138.93)"><path d="m-253.45 566.27c-1.858 2e-3 -3.7288 2.2916-3.7828 5.1506l-14.79 85.096c-0.58463 3.3637-0.30092 4.8301-0.31528 8.1508 0 10.432 8.4567 18.888 18.888 18.888 10.432 0 18.888-8.9443 18.888-19.376 0-3.3866 0.21618-4.1153-0.4047-7.5835l-15.237-85.113c1.5e-4 -2.8995-1.4061-5.2129-3.2465-5.213z"/><path d="m-253.45 566.27c-1.858 2e-3 -3.7288 2.2916-3.7828 5.1506l-14.79 85.096c-0.58463 3.3637-0.61848 4.7142-0.31528 8.151 0 10.432 8.4567 18.888 18.888 18.888z" fill="#666"/><circle cx="-253.45" cy="664.67" r="9.7464" fill="#666"/><path d="m-253.45 654.92a9.7464 9.7464 0 0 0-9.7464 9.7464 9.7464 9.7464 0 0 0 9.7464 9.7464z"/></g><defs><clipPath id="a"><path d="m23.149 9.0991c-13.438 9.0736-21.972 23.8-23.14 39.93-0.15217 2.1011 1.5767 3.8119 3.6915 3.8119h23.734c2.1149 0 3.8162-1.7234 4.2038-3.792 1.684-8.9862 8.8444-16.036 17.883-17.606 2.0808-0.36161 5.5414-0.36701 7.6197 7e-3 8.8097 1.5835 15.08 8.6234 16.556 17.595 0.34174 2.0774 2.0454 3.7972 4.1604 3.7972h24.273c2.1149 0 3.8437-1.7107 3.6915-3.8119-1.1682-16.131-9.7021-30.858-23.14-39.931-1.7503-1.1818-4.7243-2.8926-6.6269-3.8119-14.606-7.0578-31.673-7.0578-46.279 0-1.9025 0.91927-4.8765 2.63-6.6269 3.8119z" fill="#0f0" stroke-linecap="round" stroke-width=".079454"/></clipPath></defs>
        </svg>

        <p><span id="nota">0</span> de 10 aciertos</p>
    </div>

    <script>
        const nota = document.getElementById('nota');
        let aciertos = Math.floor(Math.random() * 10);

        nota.textContent = aciertos;
        ponAguja(aciertos);

        function ponAguja(aciertos) {
            const aguja = document.getElementById('aguja');
            const posicionAguja = [
                '0 -.28946 .28839 0 -139.16 -20.501',
                '.089449 -.2753 .27428 .089119 -107.1 -76.177',
                '.17014 -.23418 .23332 .16951 -59.407 -119.22',
                '.23418 -.17014 .16951 .23332 -.74583 -145.42',
                '.2753 -.089449 .089119 .27428 63.14 -152.21',
                '.28946 0 0 .28839 126 -138.93',
                '.2753 .089449 -.089119 .27428 181.67 -106.87',
                '.23418 .17014 -.16951 .23332 224.72 -59.174',
                '.17014 .23418 -.23332 .16951 250.92 -.51273',
                '.089449 .2753 -.27428 .089119 257.71 63.373',
                '0 .28946 -.28839 0 244.42 126.23'
            ]
            
            aguja.setAttribute('transform', `matrix(${posicionAguja[aciertos]})`);
        }
    </script>
</body>
</html>
```

## Enlace

[<button>Ver contador de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/contador.html)  

* Ver ejemplo de aplicación práctica. [Summer Quiz](https://javguerra.github.io/summer-quiz/) Es necesario terminar una partida para obtener resultados.
* Ver también: [Creación de gráfica de lineas dinámica con SVG](grafica-lineas)
* Ver también: [Cargar SVG dinámicamente](carga-svg)
* [Tutorial SVG](http://w3.unpocodetodo.info/svg/introduccion.php).
* Libro sobre SVG [SCALABLE](https://leanpub.com/scalable/) de Jorge Aznar.