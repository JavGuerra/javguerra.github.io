---
route: populate-paginate-fitrado
title: Usando populate con paginate y filtrando los resultados
description: Cómo relacionar colecciones cuando se usa mongoose-paginate-v2
author: JavGuerra
pubDate: 2022-10-29
coverImage:
  image: '@/assets/img/mongoose.jpg'
  alt: mongoose-paginate-v2
tags:
    - código
    - JavaScript
    - Node.js
    - MongoDB
    - Mongoose
    - Paginate
---

Si bien mongodb tiene formas de obtener resultados paginados (limit, skip), el módulo mongoose-paginate-v2 de mongoose nos ahorra tiempo y código a la hora de preparar y usar los datos paginados obtenidos de las búsquedas en nuestras bases de datos, devolviendo información complementaria muy cómoda, pero ¿cómo podemos usar la paginación cuando tenemos relaciones entre colecciones? En esta entrada explicaré cómo paginar resultados agregados entre colecciones como si usásemos aggregate en mongodb o populate en mongoose, y además cómo filtrar búsquedas agregadas y paginadas con este módulo. 

# El ejemplo

Imaginemos que tenemos dos colecciones en una BBDD mongodb, una de `libros` y otra de `autores`, y un dato en cada documento de la colección libros llamado `autor` que sirve para contener la información agregada del autor en la colección libros. En el _schema_, el dato `autor` podría tener esta forma:

```javascript
    autor: { 
        ref: { type: Schema.Types.ObjectId, ref: 'Autor' },
        nombre: String
    }
```
La propiedad `ref` es la que «tenderá el puente» entre ambas colecciones, y contendrá el `_id` del documento a relacionar de la colección `autores`. La propiedad `nombre` contendrá, como se espera, el nombre del autor. Si bien este dato estará también en la colección `autores`, y puede ser redundante cuando agregamos los resultados, el dato tiene su utilidad, pues nos permite realizar el filtrado de libros por autor incluso sin realizar la agregación.

Una búsqueda haciendo uso de populate tendría esta forma:

```javascript
Libro.find( filtro ).populate( 'autor.ref' ).exec();
```
donde `filtro` es un objeto que contendrá los criterios de búsqueda, y `autor.ref` es la necesaria referencia para poder llevar a cabo la agregación de datos de la colección `autores` en `libros`.

Si queremos emplear el módulo `mongoose-paginate-v2` para paginar los resultados de la búsqueda, esta quedaría de la siguiente forma:

```javascript
Libro.paginate(filtro, { page, limit });
```

donde `page` indica la página de resultados a obtener y `limit` el número de resultados por página.

Pero sólo nos devolverá los datos de la colección `autores`, sin agregar los datos de la colección `libros`. ¿Cómo se haría esto?

# Agregando y paginando

Hemos visto que paginate acepta dos parámetros, los criterios de búsqueda (filtro) y las opciones (page, limit). Otra opción que podemos añadir a paginate es `populate`. Para hacer una búsqueda agregada como la del ejemplo, usaríamos:

```javascript
Libro.paginate(filtro, { page, limit, populate: 'autor.ref' });
```
de esta forma podemos obtener un resultado con la información de ambas colecciones.

La opción populate permite también otras opciones. Imaginemos que en la agregación queremos obviar el dato `nombre` de la colección `autores` que ya tenemos en la colección `libros`. Podemos pasarle a `populate` un objeto de la siguiente forma:  

```javascript
Libro.paginate(filtro, { page, limit, populate: {path: 'autor.ref', select: '-nombre'}' });
```
donde `select: '-nombre'`, que va con un signo menos (-) delante, indica que ese dato no será requerido. Véase también que, para incluir la referencia a la colección, dentro del objeto se usa `path: 'autor.ref'`. 

Puedes obtener más información sobre las [opciones de populate](https://mongoosejs.com/docs/api.html#query_Query-populate) en el manual on-line.

# Filtrando

Decía más arriba que nos puede interesar hacer un filtrado en la búsqueda sobre nuestra base de datos por el nombre del autor, que es un dato dentro de otro dato, pero antes recordaré cómo buscar por uno o varios datos de la colección.

```javascript
const filtro = {};
if (titulo) filtro.titulo = { $regex: `.*${titulo}.*` };
if (precio) filtro.precio = { $lte: precio };
```

Este código creará un objeto `filtro` que permitirá que busquemos en la colección `libros` por título y precio, ya que, si estos datos de búsqueda existen, con `filtro.titulo` y `filtro.precio` añadimos ambas propiedades al objeto filtro que usaremos en la búsqueda de la forma en que hemos visto en todos los ejemplos anteriores. (Nota: entiéndase que podríamos tener libros con el mismo título y distinto precio según la editorial o la colección editorial).

Con ```{ $regex: `.*${titulo}.*/` }``` buscamos por la expresión regular dada, en cambio con `$lte: precio` buscamos por un valor igual o menor al proporcionado. Ver más información sobre [operadores de búsqueda en mongodb](https://www.mongodb.com/docs/manual/reference/operator/) en el manual on-line.

Esto permitirá que:

```javascript
Libro.paginate(filtro, { page, limit, populate: {path: 'autor.ref', select: '-nombre'}' });
```

devuelva aquellos documentos de la colección `libros` que tengan coincidencias con el `filtro` indicado, es decir, que contengan en el título el texto `titulo` indicado y cuyo precio sea igual o menor al `precio` indicado.

## Consulta sobre datos anidados

Teniendo claro lo anterior, acceder al dato `nombre` dentro de `autor` no es complicado, pero para referenciar el dato tendremos que usar lo siguiente:

```javascript
const filtro = {};
if (nombre) filtro["autor.nombre"] = { $regex: `.*${nombre}.*` };
```

Uso aquí los corchetes `[]` porque para poder usar el filtro en mongodb debo pasarle la propiedad al objeto filtro de esta forma: ```{ "autor.nombre" : { $regex: `.*${nombre}.*` } }``` como se indica en la sección [consulta sobre documentos incrustados/anidados](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/) del manual online.

Este filtro devolverá aquellos documentos de la colección `libros` que, dentro del dato `autor`, contengan el nombre dado dentro del dato anidado `nombre`.

# Enlaces

* [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)
* [Opciones de populate](https://mongoosejs.com/docs/api.html#query_Query-populate)
* [Operadores de búsqueda en mongodb](https://www.mongodb.com/docs/manual/reference/operator/)
* [Consulta sobre documentos incrustados/anidados](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)

