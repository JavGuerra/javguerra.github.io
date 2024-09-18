---
route: api-mastodon
title: Accediendo a la API de Mastodon
description: Una API para acceder a los contenidos de Mastodon
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

En este artículo vamos a ver cómo se puede acceder a la API de Mastodon, un servicio de publicación social que permite a los usuarios publicar contenidos en su cuenta, y obtener de ella las publicaciones más recientes de un usuario concreto.

Recientemente he usado este servicio para mostrar, en el apartado [social](/social), las publicaciones que escribo en Mastodon, empleando JavaScript del lado del cliente en Astro, es decir, en una página .astro he incluido un script que lee y muestra las publicaciones actualizadas de mi cuenta de Mastodon.

En el artículo me centraré en la parte de javaScript y no tanto en la integración con Astro, ya que, de esta forma, será posible aprovechar esta entrada para su uso en otros frameworks o aplicaciones propias.

# API de Mastodon

Realizaré la consulta a la [API de Mastodon](https://docs.joinmastodon.org/api/rest/timelines/) mediante la función fetch de JavaScript.

El acceso a la API no requiere autenticación, por lo que podemos acceder a ella sin ningún tipo de token. Vamos a necesitar:

- La url de la instancia de Mastodon, es decir el servidor.
- El id de la cuenta que queremos consultar.
- El número de publicaciones que queremos consultar.

Cuando tengamos estos datos, podremos construir la url de la API de Mastodon, que será la siguiente:

```
https://<server>/api/v1/accounts/<accountId>/statuses?limit=<limit>
```

Donde:

- `<server>` es la url de la instancia de Mastodon, por ejemplo `mastodon.social` o la de tu propia instancia.
- `<accountId>` es el id de la cuenta que queremos consultar, por ejemplo `1234567890`. Este id se obtiene de la url de la cuenta, ej.: `https://mastodon.social/@usuario` tendría el id `1234567890`.
- `<limit>` es el número de publicaciones que queremos consultar, por ejemplo `10`.

Para obtener el id de la cuenta, podemos usar la siguiente url:

```
https://<server>/api/v1/accounts/lookup?acct=<username>
```

Donde hay que sustituir `<server>` por la url de la instancia de Mastodon y `<username>` por el nombre de usuario de la cuenta que queremos consultar.

Obtendremos un json con el id de la cuenta, entre otros datos, como por ejemplo:

```json
{
  "id": "1234567890",
  "username": "usuario",
...
}
```

Si queremos consultar las 10 últimas publicaciones de la cuenta `@usuario` en la instancia de Mastodon `https://mastodon.social`, tendríamos que usar la siguiente url:

```
https://mastodon.social/api/v1/accounts/1234567890/statuses?limit=10
```

# Fetch

Ya tenemos formada la url a la API de Mastodon, y para llevarlo a cabo necesitamos usar la función `fetch` de JavaScript, que nos permite realizar peticiones HTTP, y obtener el resultado como un objeto json.

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

En la función `getLatestPosts` defino la url de la API de Mastodon, y la función `fetch` me permite realizar la petición y obtener el resultado como un objeto json.

Como se aprecia, se trata de una función asíncrona con una estructura de los más común, que se ejecutará de manera independiente, y cuando se haya terminado de ejecutar, nos permitirá seguir con la ejecución del código siguiente.

Podemos llamar a la función mediante:

```js
const posts = await getLatestPosts(route);
```

Con `await`, se espera a que la función `getLatestPosts` termine de ejecutarse, y luego es posible usar el array `posts` para mostrar las publicaciones en nuestra página, si no se ha producido ningún error.

# Mostrando las publicaciones

Allí donde vamos a mostrar las publicaciones, voy a usar un elemento `<ul>` con el `id="posts"` para definir una lista de publicaciones, y un elemento `<li>` para cada publicación.

Incluyo el siguiente código en la página:

```html
<ul id="posts">
  Cargando...
</ul>
```

Y luego, en el script de JavaScript, sustituiré el contenido del elemento `<ul>` usando el siguiente código:

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

Primero obtengo el elemento `<ul>` con el id `posts` y guardo el contenido en una variable `postsElement`.

```js
const postsElement = document.getElementById('posts');
```

Compruebo que hay publicaciones y que el array `posts` no esté vacío. Si no es así, definimos el contenido del elemento `<ul>` con el siguiente código: 

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

Con la función `map` puedo iterar sobre cada elemento del array `posts` y acceder a cada una de las publicaciones del json `posts`, y luego juntar todos los elementos en una cadena de texto mediante la función `join`. el resultado se incluirá en el elemento `<ul>` con el id `posts` mediante el método `innerHTML` de postElement. Es decir, obtendremos cada publicación, esta se formateará, y se concatenará o añadirá a la cadena de texto que conforma el contenido del elemento `<ul>`.

# Formatear la publicación

Para formatear la publicación, vamos a usar una estructura de elementos `<li>` para cada publicación, y un elemento `<a>` para el enlace a la publicación. L oque quiero conseguir se parece a esto:

```html
<li class="post">
  Este es un ejemplo de una publicación en Mastodon.
  <a href="https://mastodon.social/@usuario/109292343224519197">
    <small>18/9/2024, 1:11:35</small>
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

Por último, para incluir el enlace a la publicación original, también debo determinar si estoy ante una publicación original o republicada. En el primer caso uso el enlace a la publicación, y en el segundo caso uso el enlace a la republicación con `post.reblog === null ? post.url : post.reblog.url`.

Para mostrar la fecha, uso la función `toLocaleString` de JavaScript, que me permite obtener la fecha en formato local con `new Date(post.created_at).toLocaleString()`.

Es posible llamar a la función `displayPosts` mediante:

```js
displayPosts(posts);
```

Siendo `posts` el array de publicaciones en json obtenido de la API de Mastodon.

# El código completo

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
    // Sustituye los tres valores siguientes para adaptarlo a tu propio uso
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

    const posts = await getLatestPosts(route);
    displayPosts(posts);
</script>

</body>
</html>
```

No olvides sustituir los valores de `server`, `profileId` y `limit` con los que correspondan a tu propio perfil de Mastodon.

# Estilos

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

La clase `.invisible` se aplica a los elementos que quiero que no se vean. Esto es necesario para evitar saltos de línea y espacios en blanco en el contenido de las publicaciones debido a su formateo original.

Se incluye también la clase `.invisible` para imágenes y vectores SVG. Si bien no se unsan en este ejemplo, pueden ser de utilidad si decides mostrar el contenido multimedia de las publicaciones.

Por su parte, la clase `.ellipsis` se usa para mostrar puntos suspensivos `…` en los enlaces acortados.

# Saber más

- [Mastodon](https://es.wikipedia.org/wiki/Mastodon)
- [Mastodon API](https://docs.joinmastodon.org/api/rest/timelines/)
- Ejemplo de uso: [Social](/social)