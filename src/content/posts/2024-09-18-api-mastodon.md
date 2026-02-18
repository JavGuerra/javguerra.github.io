---
route: api-mastodon
title: Accediendo a la API de Mastodon
description: Cómo obtener y mostrar las publicaciones de esta red social
author: JavGuerra
pubDate: 2024-09-18
coverImage:
  image: '@/assets/img/mastodon.png'
  alt: Logo Mastodon
tags:
  - JavaScript
  - código
  - API
  - servidor
---

En este artículo vamos a ver cómo se puede acceder a la API de Mastodon, un servicio que nos permite, entre otras cosas, obtener las últimas publicaciones de un usuario concreto.

Recientemente la he usado para mostrar, en el apartado [social](/social) de esta página, las publicaciones que escribo en la red social, empleando JavaScript del lado del cliente en Astro, es decir, que en una página .astro he incluido un script que lee y muestra las publicaciones actualizadas de mi cuenta de Mastodon.

Me centraré en la parte de JavaScript y no tanto en la integración con Astro, ya que, de esta forma, será posible aprovechar la información para que pueda ser usada en otros frameworks o aplicaciones propias.

El lector debe conocer las funciones avanzadas de JavaScript como asincronía y llamadas a APIs para seguir correctamente esta entrada.

# API de Mastodon

Realizaré la consulta a la [API de Mastodon](https://docs.joinmastodon.org/api/) mediante la función `fetch` de JavaScript.

Las consultas a la API no requieren autenticación (aunque es posible), por lo que podemos acceder a ella sin ningún tipo de token, pero voy a necesitar:

- La url de la instancia de Mastodon, es decir el servidor.
- El id de la cuenta de usuario que quiero consultar.
- El número que indique la cantidad de publicaciones que quiero obtener.

Cuando tengamos estos datos, podremos construir el `endpoint` o url de la API de Mastodon, que será la siguiente:

```
https://<server>/api/v1/accounts/<accountId>/statuses?limit=<limit>
```

Donde:

- `<server>` es el nombre de dominio de la instancia de Mastodon, por ejemplo `mastodon.social` o la de tu propia instancia.
- `<accountId>` es el id de la cuenta que queremos consultar, por ejemplo `1234567890`. Este id se obtendría de la url de la cuenta, ej.: `https://mastodon.social/@usuario`, como se verá enseguida.
- `<limit>` es el número de publicaciones que queremos consultar, por ejemplo `10`.

Para obtener el id de la cuenta, debo usar la siguiente url:

```
https://<server>/api/v1/accounts/lookup?acct=<username>
```

Donde hay que sustituir `<server>` por el nombre de la instancia de Mastodon y `<username>` por el nombre de usuario de la cuenta que queremos consultar.

Obtengo un json con el id de la cuenta, entre otros datos, como por ejemplo:

```json
{
  "id": "1234567890",
  "username": "usuario",

  ...

}
```

Si queremos consultar las 10 últimas publicaciones de la cuenta ficticia `@usuario`, que tiene el id ficticio: `1234567890`, en la instancia de Mastodon `mastodon.social`, tendríamos que usar la siguiente url:

```
https://mastodon.social/api/v1/accounts/1234567890/statuses?limit=10
```

## Fetch

Ya tenemos formado el endpoint de la API de Mastodon, y, para llevar a cabo la consulta, usaré la función `fetch` de JavaScript, que permite realizar peticiones HTTP, y obtener el resultado como un objeto `json`.

```js
const server = 'https://mastodon.social';
const profileId = '1234567890';
const limit = 10;

const route = `${server}/api/v1/accounts/${profileId}/statuses?limit=${limit}`;

async function getLatestPosts(route) {
  try {
    const response = await fetch(route);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
```

Como se aprecia, se trata de una función asíncrona con una estructura de lo más común, que se ejecutará de manera independiente, y cuando se haya terminado de ejecutar, me permitirá seguir con la ejecución del código.

Para llamar a la función, uso:

```js
const posts = await getLatestPosts(route);
```

Con `await`, se espera a que la función `getLatestPosts` termine de ejecutarse, y luego es posible usar el array `posts` para mostrar las publicaciones en nuestra página, siempre que no se haya producido ningún error.

## Mostrando las publicaciones

Allí donde vamos a mostrar las publicaciones, voy a usar un elemento `<div>` con el `id="posts"` para definir una lista de publicaciones, un `<ul>`, y un elemento `<li>` para cada publicación.

Incluyo el siguiente código HTML en la página:

```html
<div id="posts">
  Cargando...
</div>
```

Y luego, mediante el script de JavaScript, sustituiré el contenido del elemento `<div>` con las publicaciones obtenidas y formateadas:

```js
function displayPosts(posts) {
  const postsElement = document.getElementById('posts');

  if (!posts || posts.length === 0) {
    postsElement.innerHTML = '<p>No se encontraron posts.</p>';
    return;
  }

  postsElement.innerHTML = `
    <h2>Últimas publicaciones</h2>
    <ul>
    ${posts.map(post => {
      const isReblog = post.reblog != null;
      const originalPost = isReblog ? post.reblog : post;
      const contentIsEmpty = !originalPost.content || originalPost.content.replace(/<[^>]*>/g, '').trim() === '';
      const hasMedia = originalPost.media_attachments && originalPost.media_attachments.length > 0;
      const multimediaLink = hasMedia ? `<small>Incluye contenido multimedia <a href="${originalPost.url}">👁️ Ver en origen →</a></small><br />` : '';

      return `
        <li class="post">
          ${isReblog 
            ? `${originalPost.content} <small>♻️ Republicado </small>`
            : contentIsEmpty && hasMedia
              ? multimediaLink
              : originalPost.content + multimediaLink}

          <a href="${originalPost.url}">
            <small>
              📢 ${new Date(originalPost.created_at).toLocaleString('es-ES', {dateStyle: 'medium', timeStyle: 'short'})}
            </small>
          </a>
        </li>
        `
      }).join('')}
    </ul>
  `;
}   
```

Vamos por partes.

Primero obtengo el elemento `<div>` con el id `posts` del DOM, y lo guardo en una variable `postsElement` para poder referirme a él en el script.

```js
const postsElement = document.getElementById('posts');
```

Compruebo que hay publicaciones y que el array `posts` no esté vacío. Si no es así, defino el contenido del elemento `<div>` con el siguiente código: 

```js    
postsElement.innerHTML = '<p>No se encontraron posts.</p>';
```

Si hemos obtenidos publicaciones, hago uso de la siguiente estructura:

```js
postsElement.innerHTML = `
    <h2>Últimas publicaciones</h2>
    <ul>
    ${posts.map(post => `

        // código para mostrar cada publicación

    `).join('')}
    </ul>
  `;
```

Con la función `map` puedo iterar sobre cada elemento del objeto `posts` y acceder a cada una de las publicaciones, y luego puedo juntar todos los elementos formateados en una cadena de texto mediante la función `join`. El resultado se incluirá en el elemento `<div>` con el id `posts` mediante el método `innerHTML` de `postElement`. Es decir, obtengo cada publicación, esta se formatea, y se concatena o añade a la cadena de texto que conforma el contenido del elemento `<div>`; las publicaciones.

## Pintando...

Para formatear las publicaciones, voy a usar una estructura de elementos `<li>` por cada publicación, como dije, y un elemento `<a>` para enlazar a la publicación original. Lo que quiero conseguir se parece a esto:

```html
<li class="post">
  Este es un ejemplo de una publicación en Mastodon.
  <a href="https://mastodon.social/@usuario/109292343224519197">
    <small>18 sep 2024, 1:23:45</small>
  </a>
</li>
```

De cada publicación obtengo el contenido de la publicación, y el enlace a la publicación. Con esta información defino una serie de variables:


```js
const isReblog = post.reblog != null;
const originalPost = isReblog ? post.reblog : post;
const contentIsEmpty = !originalPost.content || originalPost.content.replace(/<[^>]*>/g, '').trim() === '';
const hasMedia = originalPost.media_attachments && originalPost.media_attachments.length > 0;
const multimediaLink = hasMedia ? `<small>Incluye contenido multimedia <a href="${originalPost.url}">👁️ Ver en origen →</a></small><br />` : '';
```

Como las publicaciones pueden ser republicaciones, es decir, publicaciones compartidas de otros usuarios o propias, compruebo si este es el caso.

Si es una republicación, obtengo su contenido, sino, obtengo el contenido de la publicación original.

Compruebo si el texto de la publicación está verdaderamente vacío, es decir, si no contiene, por ejemplo, alguna etiqueta HTML.

Compruebo también si la publicación tiene contenido multimedia.

Por último, si la publicación tiene contenido multimedia, preparo el enlace a la publicación original, y si no lo tiene, dejo el aviso vacío.

Seguidamente, formateo el texto de la publicación mediante el siguiente código:

```js
  <li class="post">
    ${isReblog 
      ? `${originalPost.content} <small>♻️ Republicado </small>`
      : contentIsEmpty && hasMedia
        ? multimediaLink
        : originalPost.content + multimediaLink}

    <a href="${originalPost.url}">
      <small>
        📢 ${new Date(originalPost.created_at).toLocaleString('es-ES', {dateStyle: 'medium', timeStyle: 'short'})}
      </small>
    </a>
  </li>
```

¿Se trata de una republicación?, entonces publico el texto de la republicación con el aviso de `♻️ Republicado`.

En caso contrario, compruebo si el texto de la publicación está vacío y si tiene contenido multimedia.

Si ambas condiciones se cumplen, entonces publico el aviso de ver `👁️ Ver en origen →` con su enlace, ya que será una publicación sin texto pero con video o imagen...

Si no se cumple alguna o ambas condiciones, entonces publico el contenido de la publicación y el aviso de ver `👁️ Ver en origen →` con su enlace, pues o bien la publicación tiene contenido, tiene texto y contenido multimedia o sólo texto.

Para mostrar la fecha, uso la función `toLocaleString` de JavaScript, que me permite obtener la fecha en formato local.

Es posible llamar a la función `displayPosts` mediante:

```js
displayPosts(posts);
```

Siendo `posts` el objeto de publicaciones en json obtenido de la API de Mastodon.

## Una advertencia

Si bien las instancias de Mastodon se encargan de limpiar las publicaciones de los usuarios ante potenciales peligros, no estaría de más implementar una función propia que se ocupe de limpiar el contenido de las publicaciones antes de hacer uso de `originalPost.content` para evitar sorpresas por la inclusión de etiquetas o atributos dañinos que pudieran llegar de publicaciones de instancias de Mastodon poco confiables.

# El código completo

El código siguiente incluye el contenido mostrado hasta ahora en el artículo:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Publicaciones de Mastodon</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    
    <h1>Mastodon</h1>

    <div id="posts">
        Cargando...
    </div>

<script>
    // Sustituye los valores siguientes para adaptarlo a tu propio uso
    const server = 'https://mastodon.social';
    const profileId = '1234567890';
    const limit = 10;

    const route = `${server}/api/v1/accounts/${profileId}/statuses?limit=${limit}`;

    async function getLatestPosts(route) {
        try {
            const response = await fetch(route);
            if (!response.ok) throw new Error(response.statusText);
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function displayPosts(posts) {
      const postsElement = document.getElementById('posts');

      if (!posts || posts.length === 0) {
        postsElement.innerHTML = '<p>No se encontraron posts.</p>';
        return;
      }

      postsElement.innerHTML = `
        <h2>Últimas publicaciones</h2>
        <ul>
        ${posts.map(post => {
          const isReblog = post.reblog != null;
          const originalPost = isReblog ? post.reblog : post;
          const contentIsEmpty = !originalPost.content || originalPost.content.replace(/<[^>]*>/g, '').trim() === '';
          const hasMedia = originalPost.media_attachments && originalPost.media_attachments.length > 0;
          const multimediaLink = hasMedia ? `<small>Incluye contenido multimedia <a href="${originalPost.url}">👁️ Ver en origen →</a></small><br />` : '';

          return `
            <li class="post">
              ${isReblog 
                ? `${originalPost.content} <small>♻️ Republicado </small>`
                : contentIsEmpty && hasMedia
                  ? multimediaLink
                  : originalPost.content + multimediaLink}

              <a href="${originalPost.url}">
                <small>
                  📢 ${new Date(originalPost.created_at).toLocaleString('es-ES', {dateStyle: 'medium', timeStyle: 'short'})}
                </small>
              </a>
            </li>
            `
          }).join('')}
        </ul>
      `;
    }

    document.addEventListener("DOMContentLoaded", async () => {
      const posts = await getLatestPosts(route);
      displayPosts(posts);
    });
</script>

</body>
</html>
```
No olvides sustituir los valores de `server`, `profileId` y `limit` con los que correspondan a tu propio perfil de Mastodon o el del perfil que desees consultar.

# Cargando las publicaciones

Aquí confluye todo. Mediante el evento asociado a la carga de la página `DOMContentLoaded`, que se incluye al final del script, se inicia la petición asíncrona a la API de Mastodon con `getLatestPosts(route)` y se muestran las publicaciones con `displayPosts(posts)`.

# Estilos

Para que el contenido se vea correctamente, es recomendable definir algunos estilos en el archivo `style.css`. Un ejemplo:

```css
.invisible {
  display: inline-block;
  font-size: 0;
  height: 0;
  line-height: 0;
  position: absolute;
  width: 0;
}
.invisible img,
.invisible svg {
  border: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 0 !important;
}
.ellipsis:after {
  content: "…";
}
```
Los estilos aquí mostrados son los que usa el propio Mastodon para presentar las publicaciones en su página.

La clase `.invisible` se aplica a los elementos que quiero que no se vean. Esto es necesario para evitar saltos de línea y espacios en blanco en el contenido de las publicaciones debido a su formateo original.

Se incluye también la clase `.invisible` para imágenes y vectores SVG. Si bien no se usa en este ejemplo, pueden ser de utilidad si decides mostrar el contenido multimedia de las publicaciones.

Por su parte, la clase `.ellipsis` se usa para mostrar puntos suspensivos `…` al final de los enlaces acortados.

A partir de estos estilos es posible aplicar estilos propios al contenido mostrado.

# Experimenta por tu cuenta

Como has podido comprobar a lo largo de este artículo, acceder a la API de Mastodon es un proceso sencillo que nos permite integrar el contenido de una cuenta en nuestros propios proyectos mediante código JavaScript. Desde la construcción del endpoint y la gestión de la respuesta asíncrona con fetch, hasta el formateo final de los datos considerando casos como las republicaciones o el contenido multimedia, has visto los fundamentos para crear tu propio visor de publicaciones.

Te animo a que tomes el código completo, lo adaptes con tus propios datos y experimentes modificando la lógica de displayPosts y el css para personalizar aún más la presentación. Y si te surgen dudas o mejoras, no dudes en explorar la documentación oficial de la API, donde encontrarás muchas más posibilidades.

# Saber más

- [Mastodon](https://es.wikipedia.org/wiki/Mastodon_(red_social))
- [Mastodon API](https://docs.joinmastodon.org/api/)
- Ejemplo de uso: [Social](/social)