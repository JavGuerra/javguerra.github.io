---
route: loader-thymeleaft
title: Spinner loader en Thymeleaft
description: Esperando la respuesta del backend.
author: JavGuerra
pubDate: 2024-07-08
coverImage:
  image: '@/assets/img/spinner-loader.png'
  alt: Spin
tags: 
  - código
  - Java
  - Spring Boot
  - Thymeleaft
---

A veces, el tiempo de respuesta del servidor es alto, y el usuario puede sentir que la aplicación web no está funcionando bien. Aquí explico cómo usar un spinner loader o animación de carga propia, generada con CSS, que se active al cargar la página y permanezca activa hasta que se muestre completamente.

Esta entrada hace uso y adapta los contenidos ya explicados anteriormente en este blog en [Spinner loader asíncrono]({2022-05-30-spinner-loader-asincrono), pero en este caso se simplifica el proceso al plantear una solución que no se basa en eventos asíncronos.

# Manos a la obra

Lo que voy a hacer es mostrar el cargador cada vez que entramos en una página, y hasta que esta se carga completamente. Usaré JavaScript para activarlo y desactivarlo.

Necesitaré un espacio donde mostrar la animación de carga y el CSS que defina esta animación.

## El fragmento

Para incluir el código necesario en nuestras vistas con Thymeleaft, creo un fragmento que llamo `spinner.html` como este:

``` html
<div th:fragment="spinner">
    <dialog id="zone">
        <div class="spinner" aria-label="Cargando..."></div>
    </dialog>

    <script>
        const zone = document.querySelector('#zone');

        // Activa la ventana modal
        let domContentLoadedCallback = function() {
            zone.showModal();
            document.removeEventListener('DOMContentLoaded', domContentLoadedCallback);
        };

        // Desactiva la ventana modal
        let loadCallback = function() {
            zone.close();
            window.removeEventListener('load', loadCallback);
        };

        document.addEventListener('DOMContentLoaded', domContentLoadedCallback);
        window.addEventListener('load', loadCallback);
    </script>
</div>
```

Puedo incluir este fragmento en cualquier parte de la plantilla Thymeleaft con:

```html
<div th:replace="~{fragments/spinner :: spinner}"></div>
```

Realmente no importa en qué parte de la plantilla incluyamos el fragmento, pues va a hacer uso de `dialog`, una etiqueta HTML que define una ventana modal que se muestra en el centro exacto de la ventana del navegador.

```html
<dialog id="zone"><div class="spinner" aria-label="Cargando..."></div></dialog>
```

Este simple código define una ventana modal identificada como `zone` y un div que servirá para mostrar el cargador definido a través de la clase `spinner`.

Mediante el código JavaScript posterior, selecciono la ventana modal `zone` sobre la que voy a actuar, y luego defino dos eventos, el primero hará que se muestre el cargador y el segundo que se desactive.

El primer evento se dispara cuando el HTML se ha cargado completamente (`DOMContentLoaded`), y el segundo cuando todos los contenidos referenciados en la página son cargados (`load`). Entre el primer y el segundo evento, el cargador es visible. 

Con `zone.showModal();` se activa la ventana modal, y con `zone.close();` se desactiva. En realidad, el cargador está ahí en todo momento, pero no está visible en todo momento.

Dentro de cada función que gestiona el evento he incluido también el código para quitar el evento una vez usado.

## El CSS

Con el siguiente código:

```css
#zone {
  border: none;
  background: none;
}

#zone:focus {
  outline: none;
}

.spinner {
  margin: 0 auto;
  border: 5px solid moccasin;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: DarkOrange;

  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

No debemos olvidar incluir algo como:

 ``` html
 <link rel="stylesheet" href="/css/estilo.css">
 ```
 
en el `head` de las plantillas donde vayamos a usar el cargador, cambiando `estilo.css` y su ruta según corresponda.

El modal identificado como `#zone` se verá sin fondo y sin borde, osea, totalmente transparente. En él es donde se muestra el cargador. `#zone` tendrá el tamaño del cargador, y aparecerá centrado tanto vertical como horizontalmente en la pantalla, manteniéndose centrado aún haciendo _scroll_.

Con `.spinner` describo el aspecto del _spinner loader_, e indico que debe animarse infinitamente girando 360 grados cada segundo.

Realmente se trata de colorear el borde a un div, poner un color distinto al borde de uno de sus lados, redondear sus esquinas para que el div parezca un círculo y luego hacerlo girar constantemente. Simple y efectivo.

Y no necesitamos nada más. Ahora, cada vez que se cargue una página, veremos el cargador durante el tiempo que tarda en cargarse completamente.

No se recomienda abusar del cargador, ya que este puede centrar la atención del usuario, por lo que usado con moderación, en las páginas que son susceptibles de retrasar su carga, añadimos un efecto interesante y útil a nuestra aplicación y damos información al usuario de lo que ocurre.

# Uso en formularios

Cuando enviamos un formulario o hacemos una petición que el backend va a tardar en procesar, también podemos activar la visualización del cargador hasta que cambie la vista. Para ello podemos añadir un evento a nuestro formulario de la siguiente manera:

```html
<form id="myForm" th:action="@{/setCity}" method="POST">
    
    ...

    <button id="send" type="submit">Guardar</button>
</form>

<script>
    document.getElementById('send').addEventListener('click', function(event) {
        event.preventDefault();
        zone.showModal();
        document.getElementById('myForm').submit();
    });
</script>

```

Una vez identificados el formulario `myForm` y el botón de enviar `send`, mediante JavaScript asocio un evento que permitirá que, al hacer click en el botón de guardar, se active la ventana modal.

Con `event.preventDefault();` capturo el evento de envío del formulario para poder intercalar la activación de la ventana modal con `zone.showModal();` antes de enviar el formulario definitivamente con `document.getElementById('myForm').submit();`.

Es necesario que el fragmento `spinner.html` se haya incluido en la página. De otra forma podemos incluir el código del cargador ya mencionado en cualquier parte de nuestra página:

```html
<dialog id="zone"><div class="spinner" aria-label="Cargando..."></div></dialog>
```

Como ya sabemos que vamos a cambiar de vista al enviar el formulario, no es necesario desactivar el evento `click` del formulario, pero si estamos haciendo comprobaciones el en `frontend`, es posible que necesitemos hacerlo cunado mostremos errores, lo que implica código de comprobaciones adicional. Si estamos usando `@Valid` en nuestro `backend`, esto no será necesario.

# Un ejemplo

Puedes ver el código que implementa esta solución en el repositorio de la aplicación [Cartelera DAW](cartelera-daw).

- [Aplicación web Cartelera DAW](https://cartelera-daw.up.railway.app/)
- [Repositorio de Cartelera DAW](https://github.com/JavGuerra/cartelera-daw) 

# Enlaces recomendados

* Info sobre la etiqueta [`<dialog>`](https://twitter.com/Manz/status/1529836795130744834).
* Artículo «[Cómo crear un spinner loader con CSS](https://midu.dev/como-crear-un-spinner-con-css/)
