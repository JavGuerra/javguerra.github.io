---
route: cronometro-js
title: Cronómetro en JavaScript
description: Gestiona cronometros y guarda sesiones de los cronometrajes.
author: JavGuerra
pubDate: 2022-05-22
coverImage:
  image: '@/assets/img/cronometro-digital.png'
  alt: Cronómetro digital
tags:
    - web
    - código
    - CSS
    - HTML
    - JavaScript
---
Ejercicio de programación realizado en el [bootcamp Full Stack Web Developer](beca-santander-fswd) que estoy haciendo.

[<button>Usar el cronómetro</button>](https://javguerra.github.io/CronometroJS/index.html)

## Enunciado

>Diseñaremos un HTML que represente un cronómetro con el formato que queramos, por ejemplo: 00:00.
>
>Añadiremos los botones:
>- Iniciar: Activará el cronómetro, incrementando el contador cada (1) segundo.
>- Parar: Detiene el cronómetro.
>- Continuar: Vuelve a activar el cronómetro.
>- Contar hasta 10: Inicia el cronómetro y lo para a los 10 segundos (y para el crono).
>- Guardar: Guarda el estado del crono en localStorage en el momento en que es pulsado (sin parar el crono).
>- Ver tiempos: Mostrará el listado de tiempos divido en sesiones que se ha guardado en localStorage.
>
>Queremos guardar en local Storage un conjunto de listados de tiempos divididos por sesiones, si es la primera vez que el usuario accede a la página web, la sesión será la número 1, y así sucesivamente.
>
>Añadiremos los botones pertinentes para borrar todos los datos de local Storage o solo los datos de una sesión en concreto.

## Resolución

Este ejercicio es un compendio de todo lo visto hasta ahora en el Bootcamp.

La aplicación que he desarrollado cumple con el enunciado, haciendo uso de las funciones de manejo de tiempos de JavaScript (```setInterval```, ```setTimeout```, ```clearInterval```), y las funciones de manejo de ```localStorage``` (```.setItem()```, ```.getItem()```, ```.clear()```…), e incluye algunas mejoras:

**Operativa de la aplicación**:

- Los botones del cronómetro se activan y desactivan según sean necesarios en cada función de la aplicación. Se recomienda leer mi entrada sobre [lógica interactiva](logica-interactiva).
- Implementa cuenta regresiva en el contador hasta 10.
- Al guardar un cronometraje, se muestra la lista de los cronometrajes de la sesión actual. Podemos listar también los cronometrajes de todas las sesiones, incluida la actual. El listado mostrará la sesión, el número del cronometraje dentro de esta sesión, el tiempo guardado (minutos y segundos), la fecha y hora, y el botón de borrar.
- Al borrar una sesión desde la lista de sesiones, si no se trata de la sesión actual, la aplicación reordena las sesiones para no dejar huecos entre ellas. Si tenemos cinco sesiones, y borramos la sesión tres, la sesión cuatro pasará a ser la tres, y la sesión cinco pasará a ser la cuatro. 

**Desde el punto de vista de la usabilidad**:

- Web adaptable según el dispositivo.
- Cuidado aspecto visual empleando CSS.
- El formateo básico se realiza mediante una clase CSS llamada [wysiwyg.css](https://jgthms.com/wysiwyg.css/) de la que hablé en [este post](wysiwyg-css).
- Usa [Bootstrap Icons](https://icons.getbootstrap.com/) y fuente personalizada llamada [Digit](https://www.dafont.com/digit.font) (_sin info del autor_).
- Es accesible, empleando etiquetas descriptivas y etiquetas [WAI-ARIA](https://en.wikipedia.org/wiki/WAI-ARIA) para señalar las regiones de la web que cambian durante la ejecución de la aplicación.
- Ha sido probada en los navegadores web **Firefox** y **Chrome**.

## Problemas resueltos:

La aplicación emplea una serie de funciones para activar y desactivar los botones e incluir las etiquetas WAI-ARIA correspondientes.

Con dos variables controlo los eventos del cronómetro (```cronometro```) y del final de la cuenta atrás (```parada10s```).

La variable ```tiempo``` guarda el tiempo en segundos que se llevan contabilizados en el cronometraje en cada momento.

En ```sesion``` guardo los cronometrajes de la sesión actual. Es un vector o Array de objetos, donde cada objeto es un cronometraje, que se guarda en el formato:

```javascript
{'segundos': tiempo, 'fechaHora': fechaHora}
```
En ```numSesion``` guardo el número de sesión actual. Las sesiones se guardan en **localStorage** con el nombre que corresponde a su número de orden.

Uso una sesión o clave guardada en **localStorage** con el nombre ```ultSesion``` que contiene el número de orden de la última sesión guardada. De esta forma puedo consultarla para saber si hay sesiones guardadas, y cuál es el número de orden de la última que se guardó.

A la hora de guardar y recuperar las sesiones guardadas en **localStorage** creí erróneamente que estas se guardaban en orden descendiente, que podía recorrer la lista de claves de **localStorage** con un bucle, como si se tratase de una pila de datos «**LIFO**» (_Last Input - First Output_), de tal forma que la última clave que añadimos a **localStorage** sería la primera en la lista, y su número de orden sería 0. Así, si recorría la lista con ```clave = localStorage.key(i)```, obtendría primero la clave 0, la última, luego la 1, la penúltima, la 2, la antepenúltima, etc… pero esto no funciona siempre así.

Parece que no podemos confiar en este orden, por lo que las sesiones deben guardarse y recuperarse sin tener en cuenta la posición que ocupan en **localStorage**, lo que me obligó a reescribir la función ```historLocal()``` (listado del historial) y las «delicadas» funciones ```borraClave(clave)``` (borra una sesión) y ```ordenaClaves(clave, numSesiones)``` (ordena las sesiones cuando hay un hueco) que, sinceramente, me llevaron más tiempo del que merecían hasta que volvieron a estar perfectamente ajustadas.

Otra cuestión que me sorprendió fue la del manejo de los tiempos en los intervalos empleados en la cuenta regresiva (Contar hasta 10). **Firefox** y **Chrome** no funcionan igual. Si contamos desde 10 segundos hasta 0, realmente hay 11 segundos. Pues bien, mientras en Firefox esto funcionaba bien empleando ```parada10s = setTimeout( parateCrono, 11000);``` (parateCrono es una función que para el cronómetro) en Chrome el resultado final de la cuenta regresiva, en vez de ```0``` es ```-1```, así que debí crear la siguiente función para corregir esto:

```javascript
function limite(miliSeg) {
    return navigator.userAgent.indexOf("Firefox") > -1 ? miliSeg + 1000 : miliSeg;
}
```
Que comprueba si estamos usando Firefox, entonces devuelve el valor ```11000``` (11 segundos), sino devuelve ```10000``` (10 segundos), para luego poder usarlo de esta forma:

```javascript
parada10s = setTimeout( parateCrono, limite(10000));
```
Los iconos empleados en los botones inicialmente eran confusos. Con la revisión del compañero del bootcamp **Francesc** cambié la combinación de iconos para hacer la aplicación más usable.

Por último, señalar que la aplicación maneja sólo minutos y segundos, hasta un máximo de 3.600 segundos (de 0 a 3.599). Inspirado por la presentación del compañero del bootcamp **Borja**, incluí el siguiente código dentro de la función que muestra el cronómetro:

```javascript
if (minSeg.minutos == 59 && minSeg.segundos == 59) {
    parateCrono();
    btnInactivo(btnContin, true);
}
```
Esto para el cronómetro y pone inactivo el botón de continuar cuando la aplicación llega a 59 minutos y 59 segundos.

## Enlaces

[<button>Usar el cronómetro</button>](https://javguerra.github.io/CronometroJS/index.html)  

[Ver el código fuente](https://github.com/JavGuerra/CronometroJS)

**Referencias**:  
* [setTimeout](https://www.w3schools.com/jsref/met_win_settimeout.asp)  
* [setInterval](https://www.w3schools.com/jsref/met_win_setinterval.asp)  
* [localStorage](https://es.javascript.info/localstorage)  

