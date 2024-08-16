---
route: spinner-loader-asincrono
title: Spinner loader asíncrono
description: Manrtiene el spinner activo mientras terminan todos los procesos asíncronos.
author: JavGuerra
pubDate: 2022-05-30
coverImage:
  image: '@/assets/img/spinner-loader.png'
  alt: Spin
tags:
    - código
    - CSS
    - HTML
    - JavaScript
    - usabilidad
---
Durante los procesos asíncronos que se llevan a cabo, por ejemplo al usar ```fetch()``` para consumir una **API** remota, se producen retrasos al mostrar los resultados en el navegador. El uso de _spinner loader_ ayuda a informar al usuario de que uno o varios procesos están en marcha y se está procesando la información que solicitó tal vez mediante un campo de búsqueda.

## Girando...

Para mostrar un _spinner loader_ por pantalla cuando uno o varios de estos procesos se estén ejecutando necesitaré:

1. Una función que active o desactive el _spinner loader_ según un valor de status **true/false**.
2. Una función que compruebe si hay o no procesos asíncronos activos aún.
3. Ubicar en pantalla el _spinner loader_.

El **HTML** deberá contener la siguiente línea:

```html
<dialog id='zona'><div class="spinner"></div></dialog>
```
La etiqueta ```<dialog>``` es relativamente desconocida, pero de gran utilidad. La descubrí en [este twitt](https://twitter.com/Manz/status/1529836795130744834) de [@Manz](https://twitter.com/Manz). Esta etiqueta permite crear ventanas modales con **HTML**. ```<dialog>``` muestra una ventana por encima del contenido de la página y aplica un efecto de fondo sombreado al resto de la página.

Para dibujar el _spinner loader_, seguí las indicaciones de la entrada «[Cómo crear un spinner loader con CSS](https://midu.dev/como-crear-un-spinner-con-css/)» Este es el código **CSS** que incluye también el del diálogo.

```css
#zona {
  border: none;
  background: none;
}

#zona:focus {
  outline: none;
}

.spinner {
  margin: 0 auto;
  border: 5px solid LightGray;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: LightSeaGreen;

  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
```

El modal identificado como ```#zona``` se mostrará sin fondo y sin borde, osea, totalmente transparente. En él muestro el _spinner loader_. ```#zona``` tendrá el tamaño del  _spinner loader_, y aparecerá centrado tanto vertical como horizontalmente en la pantalla, manteniéndose centrado aún haciendo _scroll_.

Con ```.spinner```se describe el aspecto del _spinner loader_ y se indicará que debe animarse infinitamente girando 360 grados cada segundo.

## Activando / desactivando

Como estamos trabajando con procesos asíncronos, se puede dar el caso de que, al lanzar un proceso asíncrono, el _spinner loader_ ya esté mostrado, por tanto no tendremos que mostrarlo. Debo controlar si hay procesos asíncronos en marcha. Esto lo hago con una simple variable ```spin``` que va incrementando o decrementando su valor según el número de procesos asíncronos lanzados.

Inicializo también la variable ```intervalo``` que usaré para controlar un ```setInterval()``` que comprueba periódicamente el estado de los procesos asíncronos, osea, la variable ```spin```.

Capturo la ```#zona``` donde se mostrará el diálogo modal con el _spinner loader_, como se muestra a continuación:

```javascript
let spin = intervalo = 0;
elZona   = document.querySelector('#zona');
```
Veamos cómo funciona la activación o desactivación asíncronas mediante el siguiente código:

```javascript
/* Activa o desactiva el spin */
function ponSpin(estado) {
    estado ? spin++ : spin--;

    if (estado && !intervalo) {
        intervalo = setInterval(compruebaSpin, 300);
        elZona.showModal();
    }
}


/* Comprueba si el spin ha llegado a cero y desactiva comprobación */
function compruebaSpin() {
    if (!spin) {
        clearInterval(intervalo);
        intervalo = 0;
        elZona.close(); 
    }
}
```

Cuando iniciamos un proceso asíncrono, se debe llamar a la función ```ponSpin(true)``` con el valor ```true```, esto incrementará en ```1``` el valor de ```spin```. Sólo si estoy incrementando ```spin``` (```estado = true```), y es la primera vez que se activa (```!intervalo```), lanzo ```compruebaSpin()``` cada 300 milisegundos con ```intervalo = setInterval(compruebaSpin, 300);```y muestro la ventana modal que contiene el _spinner loader_ con ```elZona.showModal();```.

Es necesario lanzar el ```setInterval()``` porque desconocemos en qué momento los procesos asíncronos terminarán, por lo que se debe comprobar el estado de los procesos cada cierto tiempo.

Al finalizar un proceso asíncrono debemos llamar de nuevo a la función con ```ponSpin(false)```, y el valor ```false``` decrementará en ```1``` el valor de ```spin```, que irá decreciendo hasta llegar a ```0```.

La función ```compruebaSpin()```, como vimos, es lanzada cada 300 milisegundos, y su función es comprobar si ```spin``` ha llegado a ```0```, y si es así, desactiva el ```setInterval()``` y oculta la ventana modal que contiene el _spinner loader_ con ```elZona.close();```.

**Importante**: Hay que ser cuidadoso para indicar tantos cierres del _spinner loader_ como aperturas se llevan a cabo, es decir, por cada ```ponSpin(true)``` debe haber un ```ponSpin(false)```, de otra forma, podemos quedarnos con un _spinner loader_ girando indefinidamente o que se cerró antes de haber concluido todos los procesos asíncronos.

Este podría ser un ejemplo de código para poner en marcha y concluir un _spinner loader_:

```javascript
/* Consulta la API en la ruta dada y ejecuta la función callback() */
function consultaAPI(ruta, callback) {
    ponSpin(true);
    fetch(ruta)
        .then(respuesta => { // fetch() no maneja errores de conexión, luego...
            if (!respuesta.ok) throw Error(respuesta.statusText);
            return respuesta.json();
        })
        .then(data => callback(data))
        .catch(err => {
            console.error(err);
        })
        .finally( ponSpin(false) );
}
```

## Enlaces

* Podemos ver un caso de uso en esta [<button>galería de perritos</button>](https://javguerra.github.io/ejercicios-web-javascript/17-fetch.html)  

El ejemplo anterior usa la API [Dog CEO](https://dog.ceo/dog-api/).

* Info sobre la etiqueta [```<dialog>```](https://twitter.com/Manz/status/1529836795130744834).
* Artículo «[Cómo crear un spinner loader con CSS](https://midu.dev/como-crear-un-spinner-con-css/)».
