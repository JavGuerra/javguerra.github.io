---
route: api-mastodon
title: Accediendo a la API de Mastodon
description: Obtener y mostrar las publicaciones de la red social
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

En este artículo vamos a ver cómo se puede acceder a la API de Mastodon, un servicio que nos permite, entre otras cosas, obtener las publicaciones más recientes de un usuario concreto.

Recientemente la he usado para mostrar, en el apartado [social](/social) de esta página, las publicaciones que escribo en la red social, empleando JavaScript del lado del cliente en Astro, es decir, que en una página .astro he incluido un script que lee y muestra las publicaciones actualizadas de mi cuenta de Mastodon.

En este artículo me centro en la parte de javaScript y no tanto en la integración con Astro, ya que, de esta forma, será posible aprovechar la información para que pueda ser usada en otros frameworks o aplicaciones propias.

El lector debe conocer las funciones avanzadas de JavaScript como asincronía y llamadas a APIs para seguir correctamente esta entrada.

# API de Mastodon

Realizaré la consulta a la [API de Mastodon](https://docs.joinmastodon.org/api/rest/timelines/) mediante la función `fetch` de JavaScript.

El acceso a la API no requiere autenticación (aunque es posible), por lo que podemos acceder a ella sin ningún tipo de token. Voy a necesitar:

- La url de la instancia de Mastodon, es decir el servidor.
- El id de la cuenta de usuario que quiero consultar.
- El número de publicaciones que quiero obtener.

Cuando tengamos estos datos, podremos construir el `endpoint` o url de la API de Mastodon, que será la siguiente:

```
https://<server>/api/v1/accounts/<accountId>/statuses?limit=<limit>
```

Donde:

- `<server>` es la url de la instancia de Mastodon, por ejemplo `mastodon.social` o la de tu propia instancia.
- `<accountId>` es el id de la cuenta que queremos consultar, por ejemplo `1234567890`. Este id se obtendría de la url de la cuenta, ej.: `https://mastodon.social/@usuario`, como se verá enseguida.
- `<limit>` es el número de publicaciones que queremos consultar, por ejemplo `10`.

Para obtener el id de la cuenta, uso la siguiente url:

```
https://<server>/api/v1/accounts/lookup?acct=<username>
```

Donde hay que sustituir `<server>` por la url de la instancia de Mastodon y `<username>` por el nombre de usuario de la cuenta que queremos consultar.

Obtengo un json con el id de la cuenta, entre otros datos, como por ejemplo:

```json
{
  "id": "1234567890",
  "username": "usuario",

  ...

}
```

Si queremos consultar las 10 últimas publicaciones de la cuenta ficticia `@usuario`, que tiene el id ficticio: `1234567890`, en la instancia de Mastodon `https://mastodon.social`, tendríamos que usar la siguiente url:

```
https://mastodon.social/api/v1/accounts/1234567890/statuses?limit=10
```

## Fetch

Ya tenemos formado el endpoint de la API de Mastodon, y para llevar a cabo la consulta necesito usar la función `fetch` de JavaScript, que permite realizar peticiones HTTP, y obtener el resultado como un objeto json.

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

Como se aprecia, se trata de una función asíncrona con una estructura de los más común, que se ejecutará de manera independiente, y cuando se haya terminado de ejecutar, me permitirá seguir con la ejecución del código.

Para llamar a la función, uso:

```js
const posts = await getLatestPosts(route);
```

Con `await`, se espera a que la función `getLatestPosts` termine de ejecutarse, y luego es posible usar el array `posts` para mostrar las publicaciones en nuestra página, siempre que no se haya producido ningún error.

## Mostrando las publicaciones

Allí donde vamos a mostrar las publicaciones, voy a usar un elemento `<ul>` con el `id="posts"` para definir una lista de publicaciones, y un elemento `<li>` para cada publicación.

Incluyo el siguiente código HTML en la página:

```html
<ul id="posts">
  Cargando...
</ul>
```

Y luego, mediante el script de JavaScript, sustituiré el contenido del elemento `<ul>` con las publicaciones obtenidas y formateadas:

```js
function displayPosts(posts) {
  const postsElement = document.getElementById('posts');
  if (posts && posts.length > 0) {
    postsElement.innerHTML = `
        <h2>Últimas publicaciones</h2>
        ${posts.map(post => `
          <li class="post">
            ${post.reblog === null 
              ? post.content
              : `${post.reblog.content} <small>♻️ Republicado </small>`}
            ${post.reblog === null && post.content === ""
              ? `Contenido multimedia <a href="${post.url}">👁️ Ver en origen →</a><br />` : ''}
            <a href="${post.reblog === null ? post.url : post.reblog.url}">
              <small>📢 ${new Date(post.created_at).toLocaleString()}</small>              
            </a>
          </li>
        `).join('')}
      `;
  } else {
    postsElement.innerHTML = '<p>No se encontraron posts.</p>';
  }  
}
```

Vamos por partes:

Primero obtengo el elemento `<ul>` con el id `posts` del DOM, y lo guardo en una variable `postsElement` para poder referirme a él en el script.

```js
const postsElement = document.getElementById('posts');
```

Compruebo que hay publicaciones y que el array `posts` no esté vacío. Si no es así, defino el contenido del elemento `<ul>` con el siguiente código: 

```js    
postsElement.innerHTML = '<p>No se encontraron posts.</p>';
```

Si hemos obtenidos publicaciones, hago uso de la siguiente estructura:

```js
postsElement.innerHTML = `
    <h2>Últimas publicaciones</h2>
    ${posts.map(post => `

        // código para mostrar cada publicación

    `).join('')}
`;
```

Con la función `map` puedo iterar sobre cada elemento del objeto `posts` y acceder a cada una de las publicaciones, y luego junto todos los elementos formateados en una cadena de texto mediante la función `join`. El resultado se incluirá en el elemento `<ul>` con el id `posts` mediante el método `innerHTML` de postElement. Es decir, obtengo cada publicación, esta se formatea, y se concatena o añade a la cadena de texto que conforma el contenido del elemento `<ul>`; las publicaciones.

## Formatear la publicación

Para formatear las publicaciones, voy a usar una estructura de elementos `<li>` para cada publicación, como dije, y un elemento `<a>` para enlazar a la publicación original. Lo que quiero conseguir se parece a esto:

```html
<li class="post">
  Este es un ejemplo de una publicación en Mastodon.
  <a href="https://mastodon.social/@usuario/109292343224519197">
    <small>18/9/2024, 1:23:45</small>
  </a>
</li>
```

De cada post obtengo el contenido de la publicación, y el enlace a la publicación, y luego lo formateo para que se vea como se muestra arriba, mediante el siguiente código:

```js
<li class="post">
    ${post.reblog === null 
        ? post.content
        : `${post.reblog.content} <small>♻️ Republicado </small>`}
    ${post.reblog === null && post.content === ""
        ? `Contenido multimedia <a href="${post.url}">👁️ Ver en origen →</a><br />` : ''}
    <a href="${post.reblog === null ? post.url : post.reblog.url}">
        <small>📢 ${new Date(post.created_at).toLocaleString()}</small>              
    </a>
</li>
```

Como las publicaciones pueden ser republicaciones, es decir, publicaciones compartidas de otros, compruebo si este es el caso con `post.reblog === null` Si no hay republicación, osea, si es null, incluyo el contenido del post con `post.content`, y si hay republicación, incluyo el contenido de la republicación con `post.reblog.content`.

Luego compruebo si el contenido es multimedia y no incluye texto, mediante `post.reblog === null && post.content === "`, y si es así, incluyo un enlace a la versión original de la publicación con `post.url`. Si no es el caso, no incluyo nada `''`.

Por último, para enlazar a la publicación en Mastodon, también debo determinar si estoy ante una publicación original o republicada. En el primer caso uso el enlace a la publicación, y en el segundo caso uso el enlace a la republicación con `post.reblog === null ? post.url : post.reblog.url`.

Para mostrar la fecha, uso la función `toLocaleString` de JavaScript, que me permite obtener la fecha en formato local con `new Date(post.created_at).toLocaleString()`.

Es posible llamar a la función `displayPosts` mediante:

```js
displayPosts(posts);
```

Siendo `posts` el objeto de publicaciones en json obtenido de la API de Mastodon.

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

    <ul id="posts">
        Cargando...
    </ul>

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
        if (posts && posts.length > 0) {
            postsElement.innerHTML = `
                <h2>Últimas publicaciones</h2>
                ${posts.map(post => `
                <li class="post">
                    ${post.reblog === null 
                    ? post.content
                    : `${post.reblog.content} <small>♻️ Republicado </small>`}
                    ${post.reblog === null && post.content === ""
                    ? `Contenido multimedia <a href="${post.url}">👁️ Ver en origen →</a><br />` : ''}
                    <a href="${post.reblog === null ? post.url : post.reblog.url}">
                    <small>📢 ${new Date(post.created_at).toLocaleString()}</small>              
                    </a>
                </li>
                `).join('')}
            `;
        } else {
            postsElement.innerHTML = '<p>No se encontraron posts.</p>';
        }  
    }

    document.addEventListener("DOMContentLoaded", async () => {
      const posts = await getLatestPosts(route);
      displayPosts(posts);
    });
</script>

</body>
</html>
```

Mediante el evento asociado a la carga de la página `DOMContentLoaded`, se inicia la petición asíncrona a la API.

No olvides sustituir los valores de `server`, `profileId` y `limit` con los que correspondan a tu propio perfil de Mastodon o el del perfil que desees consultar.

## Estilos

Para que el contenido se vea correctamente, es necesario definir algunos estilos en el archivo `style.css`.

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
Estos estilos son los que usa el propio Mastodon para mostrar las publicaciones.

La clase `.invisible` se aplica a los elementos que quiero que no se vean. Esto es necesario para evitar saltos de línea y espacios en blanco en el contenido de las publicaciones debido a su formateo original.

Se incluye también la clase `.invisible` para imágenes y vectores SVG. Si bien no se usan en este ejemplo, pueden ser de utilidad si decides mostrar el contenido multimedia de las publicaciones.

Por su parte, la clase `.ellipsis` se usa para mostrar puntos suspensivos `…` al final de los enlaces acortados.

A partir de estos estilos es posible aplicar estilos propios al contenido mostrado.

# Saber más

- [Mastodon](https://es.wikipedia.org/wiki/Mastodon)
- [Mastodon API](https://docs.joinmastodon.org/api/rest/timelines/)
- Ejemplo de uso: [Social](/social)