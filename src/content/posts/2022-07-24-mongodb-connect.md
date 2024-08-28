---
route: mongodb-connect
title: Conexión persistente a MongoDB en Node.js
description: Abrir una única conexión a la base de datos a través de los distintos módulos de la aplicación
author: JavGuerra
pubDate: 2022-07-24
coverImage:
  image: '@/assets/img/mongodb.png'
  alt: MongoDB
tags:
    - código
    - JavaScript
    - Node.js
    - Express
    - MongoDB
---

Esta semana tocó aprender sobre **MongoDB**. Una de las cuestiones que me llamaron la atención en los ejercicios que realizamos era la necesidad de abrir y cerrar la conexión a la Base de Datos (en adelante «BBDD») en cada consulta, algo que supone una sobrecarga importante para el servidor, así que me puse a investigar la manera de hacer que la conexión a la BBDD permaneciese abierta y dando servicio a través de los distintos módulos de la aplicación. Esto es lo que descubrí, con ayuda de la comunidad.

## Cambiando el chip

Pasar de manejar datos embebidos en módulos como en el caso de la publicación sobre [filtrado múltiple](/blog/filtrado-multiple) a consultar una base de datos como **MongoDB** presenta retos importantes. el principal es que debo establecer la conexión al servicio y esperar una respuesta. Una consulta típica a MongoDB tendría esta forma:

```javascript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const mongoClient = require('mongodb').MongoClient;

const url = `${process.env.DB_HOST}:${process.env.DB_PORT}/`;
const db_name = process.env.DB_DATABASE;
const collection = "products";

(url, function(err, database) {
    if (err) throw err;
    const db = database.db(db_name);
    db.collection(collection).find().toArray(function(err, result){
        if (err) throw err;
        console.log(result);
        database.close();
    });
});
```
En la primera línea, en función de si la aplicación está funcionando en local, en modo desarrollo, o bien en producción en el servidor, cargo o no el módulo ```dotenv``` que me permite tener las variables globales que luego usaré en url y db_name por ejemplo definidas en un fichero ```.env```. Puedes ampliar conocimientos sobre este asunto en [.dovenv](https://www.npmjs.com/package/dotenv).

Tras importar mongoClient, y definir las variables que se emplearán en la conexión (url a la BBDD, nombre de la BBDD y nombre de la colección) lanzo un ```mongoClient.connect()``` que devuelve bien un error de conexión o abre la conexión (cliente) al gestor de BBDD MongoDB. Luego, con  ```const db = database.db(db_name);``` obtengo acceso a la BBDD, y seguidamente hago una consulta con ```db.collection(collection).find()```. Una vez obtengo el resultado de la búsqueda (en este caso todos los documentos dentro de la colección de la BBDD), los muestro por consola y cierro la base de datos con ```database.close();```.

Pero si deseo hacer otra búsqueda, o en el módulo tengo una serie de rutas, todas ellas apuntando a una consulta a la BBDD, el número de aperturas y cierres de la conexión se multiplica por el número de consultas. Esto en una página personal o con poco tráfico es sostenible, pero no lo es para grandes flujos de acceso o incluso para situaciones de picos concretos de acceso al servidor (horas de más tráfico, momentos del año donde las consultas se incrementan, por ejemplo cuando se solicitan los resultados de un evento, las notas de fin de curso, una noticia que ha tenido popularidad o alcance...).

Mantener la conexión abierta para distintas consultas en un módulo es fácil, pero, ¿cómo abrirla a través de los distintos módulos de la aplicación?

## Primer acercamiento: Importar y conectar

Mi primera opción fue que si voy a emplear la conexión en distintos módulos debía extraer el proceso de conexión a un módulo a parte y luego importarlo allá donde lo necesite, y dicho y hecho:

```javascript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const url = `${process.env.DB_HOST}:${process.env.DB_PORT}/`;
const db_name = process.env.DB_DATABASE;

const loadDB = async () => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(db_name);
        return db;
    } catch (err) {
        console.log(err);
    }
};

module.exports = loadDB;
```

Este módulo realiza lo mismo que en el ejemplo anterior, es decir, abre una conexión a MongoDB, pero lo hace exportando la función asíncrona ```loadDB``` para que pueda ser llamada desde otros módulos con:

```javascript
const loadDB = require('../services/DB');
let db;
const collection = "products";

(async () => db = await loadDB())();

db.collection(collection).find().toArray(function(err, result){
    if (err) throw err;
    console.log(result);
});
```

Tras cargar ```loadDB```, declaro la variable de ámbito global ```db``` que contendrá la conexión a la BBDD, y en la línea:

```javascript
(async () => db = await loadDB())();
```

Ejecuto la función asíncrona ```loadDB()``` para obtener la conexión que se guardará en ```db```, y ya puedo hacer la consulta con ```db.collection(collection).find()```.

Esta consulta podría formar parte de una ruta de **express**:

```javascript
const express = require('express');
const router = express.Router();
const loadDB = require('../services/DB');
let db;
const collection = "products";

(async () => db = await loadDB())();

router.get('/ejemplo', (req, res) => {
    db.collection(collection).find().toArray(function(err, result){
        if (err) throw err;
        res.json(result);
    });
})

module.exports = router;
```

Pero claro, esta forma de proceder implica abrir una conexión por cada módulo de rutas que use la función loadDB. No es lo que busco.

# Alternativa: función _callback_ al rescate

¿Qué tal si, en vez de intentar traer a cada módulo la conexión a la BBDD llevo las rutas a la función que abre la conexión directamente mediante una función _callback_? Veamos...

Para que todas las rutas puedan usar la variable ```db``` que se declara cuando se lleva a cabo la conexión, podría establecer una única conexión a la base de datos desde index.js (o app.js) osea, desde el fichero principal de la aplicación **Node.js**, y referenciar las rutas dentro de una función _callback_ que le pase al módulo encargado de abrir la conexión.

Esta idea fue la que me propuso **ZeroBl**, que se tomó el tiempo de responder a mis preguntas en un foro de Discord, y tras pasarme el código que él usa para establecer su conexión, y buscar un poco más de información en StackOverflow, el resultado fue el siguiente:

## Módulo de conexión a la BBDD

```javascript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const url = `${process.env.DB_HOST}:${process.env.DB_PORT}/`;
const db_name = process.env.DB_DATABASE;

let _db;
let _client;

const connectDB = function (callback) {
    try {
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, client) {
            _client = client;
            _db = client.db(db_name);
            return callback(err, client);
        });
    } catch (err) {
        throw err;
    }
}

const getDB = function () {
    if (_db) return _db;
    throw 'BBDD no encontrada.';
}

const disconnectDB = function () {
    if (_db) return _client.close();
    throw 'BBDD no encontrada.';
}

module.exports = { connectDB, getDB, disconnectDB };
```

Como se aprecia, este módulo devuelve tres funciones: ```connectDB``` que abre la conexión, ```getDB``` que obtiene la conexión a la BBDD, y ```disconnectDB```, que cierra la conexión a la BBDD.

A ```connectDB``` le paso un ```callback``` que se ejecutará en el ámbito donde está viva la conexión. Igual deberemos obtener la referencia a ```_db``` en cada módulo que usemos. Lo voy a explicar enseguida.

Con ```disconnectDB``` puedo cerrar la conexión a la BBDD desde cualquier parte del programa, pero también debo importarlo si queremos usarlo.

## El index.js

O cualquier otro js que haga las veces de inicio de nuestra app:

```javascript
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoDB = require('./services/DB');

mongoDB.connectDB(function (err, client) {
    if (err) throw err;

    // Ej. http:localhost:3000/ejemplo
    const RouteEjemplo = require('./routes/ejemplo');
    app.use('/ejemplo', RouteEjemplo);

    // otras rutas...

    // Ej. http:localhost:3000/exit
    app.get('/exit', function (req, res) {
        client.close();
        res.end('Fin');
        process.kill(process.pid, 'SIGTERM');
    });

    app.use((req, res) => {
        res.status(404).send('Error 404: No encontrado.');
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        const status = err.status || 500;
        res.status(status).send(`Error ${status}: ${err.message}.`);
    });

    const server = app.listen(port, function () {
        console.log(`Servidor levantado en el puerto ${port}.`);
    });

    process.on('SIGTERM', function () {
        server.close(() => console.log('Proceso terminado.'))
    });
});
```
Importo el módulo de ```mongoDB``` y conecto a la BBDD con:

```javascript
mongoDB.connectDB(function (err, client) {
    // Función callback
});
```

Función a la que le paso como _callback_ todo el manejo de rutas, e incluso levanto el servidor. Recuerda que esta función se ejecutará tras establecer la conexión en la línea:

```javascript
return callback(err, client);
```

Al ejecutar la función obtengo dos posibles valores, o bien un error, o bien el cliente para la conexión. Esto me va a permitir hacer uso del cliente desde la misma función _callback_, para, por ejemplo, cerrar la conexión, como ocurre en la ruta ```/exit``` en:

```javascript
client.close();
```
Usar una ruta para cerrar la aplicación por supuesto es un ejemplo ilustrativo, y no es la mejor forma de hacerlo. ;)

Si quiero cerrar la aplicación desde dentro de un módulo de, por ejemplo, una ruta, debo usar ```disconnectDB()```.

## La ruta de ejemplo

Como dije, para poder utilizar la BBDD en las distintas rutas o en los módulos de la aplicación, debo importar la referencia a ```db``` en cada módulo con:

```javascript
const mongoDB = require('../services/DB');
const db = mongoDB.getDB();
```
y a partir de ahí puedo usar ```db``` en todo el módulo. Así de simple.

Esto es posible porque, como hemos visto, estamos llamado a esta ruta dentro del _callback_ que pasamos a la función que abre la conexión.

# En resumen

Mediante un módulo que devuelve tres funciones podemos abrir la conexión a la BBDD (recibiendo y ejecutando un _callback_) obtener la referencia a la BBDD y cerrar la conexión a la BBDD.

Dentro del _callback_ definimos las rutas (```app.use```) que van a hacer uso de la BBDD, y en cada módulo donde se defina la ruta o las sub-rutas, deberemos obtener la referencia a la BBDD para poder usarla.

En este [enlace a StackOverflow](https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module) (_en inglés_) podrás obtener más información y alternativas a esta solución.
