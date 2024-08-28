---
route: mysql-connect
title: Conexiones asíncronas a MySQL en Node.js
description: Usando util.promisify() para convertir en promesas conexiones síncronas de BBDD
author: JavGuerra
pubDate: 2022-09-14
coverImage:
  image: '@/assets/img/mysql.png'
  alt: MySQL
tags:
    - código
    - JavaScript
    - Node.js
    - MySQL
    - BBDD
---

El módulo `mysql` de Node.js lleva a cabo conexiones a la BBDD empleando _callback_ para obtener los datos de las consultas SQL y no permite, por defecto, el uso de async/await. Al abrir la conexión, el resultado de estas consultas permanecerá dentro de la función _callback_. En este artículo mostraré cómo convertir conexiones MySQL de Node.js en promesas que permitan el uso de async/await, pudiendo así extraer de la función el resultado de la consulta.

<span class="note">**Nota:** Esta entrada es un ejercicio sin un sentido práctico específico en el que se hace uso del módulo mysql de Node.js. Para producción se recomienda el uso de mysql2, que incluye soporte para promesas, o el uso de un ORM como Sequelize.</span>

Poder obtener los datos de la consulta SQL, en el flujo de nuestro programa, nos facilita la tarea de observar buenas prácticas que permitan separar las rutas de los controladores y los servicios. Con un módulo de conexión podemos realizar las consultas desde los servicios, y estos a su vez devolver el resultado al controlador que fue llamado desde la ruta.

```txt
├── controllers
│   └── searchControllers.js
├── modules
│   ├── connection.js
│   └── utils.js
├── routes
│   └── searchRoutes.js
├── services
│   └── searchServices.js
├── index.js
```
Pongamos que llega una consulta a la ruta de nuestra API que es gestionada por `searchRoutes.js`, esta emplea una función del controlador que importa de `searchControllers.js` que procesa la consulta, y que a su vez llama a una función del servicio `searchServices.js` que se encarga de hacer la petición SQL a la BBDD.

Dado que todas las peticiones a la BBDD son análogas (abrir conexión, hacer petición, devolver resultado) he creado una función llamada `getMysqlDbList()` que he colocado en un módulo llamado `utils.js` que importo y uso en `searchServices.js`.

La función `getMysqlDbList()` se encargará de hacer la conexión a la base de datos, realizar la consulta y cerrar la conexión, apoyándose en el módulo `connection.js`.

# Un ejemplo

Pongamos que tenemos un frontal desde el que queremos obtener todos los productos de la BBDD. Veamos ejemplos de cada uno de los ficheros mencionados sin tener mucho en cuenta en este caso las pertinentes comprobaciones de los datos recibidos para simplificar el código.

`searchRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const getAllProducts = require('../controllers/searchControllers');

router.get('/', getAllProducts);

module.exports = router;
```

Por supuesto, este módulo será importado en `index.js`.

`searchControllers.js`
```javascript
const searchServices = require('../services/searchServices');

const getAllProducts = async (req, res) => {
    const products = await searchServices.getAllProducts();
    res.json(products);
};

module.exports = getAllProducts;
```

`searchServices.js`
```javascript
const { getMysqlDbList } = require('../modules/utils');

const getAllProducts = () => {
    const request = 'SELECT * FROM products';
    return getMysqlDbList(request);
}

module.exports = { getAllProducts };
```

## La consulta

Para que esta línea `return getMysqlDbList(request);` en `searchServices.js` funcione, la función `getMysqlDbList()` en `utils.js` debe devolver el resultado de la consulta. El código debería ser algo como esto:

`utils.js` (no lo usaremos de esta forma)
```javascript
const client = require('../modules/connection');

const getMysqlDbList = async (request) => {
    try {
        const list = await client.query(request);
        return list;
    } catch (err) {
        console.error(err);
    }
}
```
El problema es que la consultas a mysql en Node.js no soportan async/await. Una conexión mysql entonces tendría esta forma, empleando una función _callback_:

`utils.js` (no lo usaremos de esta forma)
```javascript
const connection = require('../modules/connection');

const getMysqlDbList = async (request) => {
    connection.query(request, function (error, results, fields) {
        if (error) throw error;

        results.forEach(result => {
            console.log(result);
        });
    });
}
```
Como se aprecia, `results` está dentro de la función _callback_ que obtiene los datos de la consulta y desde dentro de esta función no puedo hacer un `return` para devolver los productos como resultado de la función `getMysqlDbList()`.

## La conexión

Una conexión típica a la BBDD, cuyo código estaría en `connection.js`, podría ser:

`connection.js` (no lo usaremos de esta forma)
```javascript
const mysql = require('mysql');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT
});

connection.connect(function(err) {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + connection.threadId);
});

module.exports = connection;
```
A continuación mostraré los cambios que sufrirá este fichero.

# Promisificación

Node.js tiene un módulo `util` con algunas funciones, entre ellas `promisify()` que permite la conversión de una función que acepta un _callback_ a una función que devuelve una promesa. A este cambio se le conoce con el aparatoso y extraño nombre de `Promisificación`.

Con esta función podemos convertir nuestra consulta a la base de datos basada en _callback_ a una promesa que puede usar async/await para devolver la info resultante de la consulta, pero esto no está exento de inconvenientes. Como necesito cerrar la conexión tras la consulta SQL, lo que haré es crear una función en `connection.js` que exportaré junto con los datos de conexión para ser usados por `getMysqlDbList()`.

`connection.js`
```javascript
const util = require('util');
const mysql = require('mysql');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}
module.exports = {config, makeDb};
```

Como se aprecia, importo el módulo `util` del que utilizaré su función `promisify()`. Nótese que este `util` no se refiere a mi módulo `utils.js` en la carpeta `modules`, sino al módulo por defecto de Node.js.

Defino los datos de configuración en un objeto, y creo una función `makeDb()` que recibe como parámetro la configuración para establecer la conexión (`mysql.createConnection(config)`) y que devuelve mediante _return_ dos funciones en un objeto: `query()` y `close()`. Con `.call()` indico los parámetros de la función que va a ser convertida en promesa.

Con la exportación de `config` y `makeDb()` tengo lo necesario para realizar una consulta a la BBDD desde `getMysqlDbList()` en `utils.js`.

# La función getMysqlDbList()

{: .box-warning}
**Advertencia:** En líneas generales no es buena idea conectar y desconectar a la BBDD en cada _request_ ya que se introduce esa latencia en cada solicitud, por tanto esta es una solución que puede y debe ser mejorada en el futuro.

El siguiente código muestra cómo ha quedado la función `getMysqlDbList()` dentro del fichero `utils.js` definitivo (Obviar los anteriores ejemplos de utils.js):

`utils.js`
```javascript
const { config, makeDb } = require('./connection');

/**
 * Obtiene un listado de la BBDD MySQL mediante consulta SQL.
 * @param {String} request 
 * @returns Object
 */
const getMysqlDbList = async (request) => {
    let list = '';
    const db = makeDb(config);

    try {
        list = await db.query(request);
    } catch (err) {
        console.error(err);
    } finally {
        await db.close();
    }

    return list;
}
```

Importo `config` y `makeDb()` para poder establecer la conexión a la BBDD mediante: `const db = makeDb(config);`. Al llamar a `makeDb()` pasándole el parámetro `config` se inicia la conexión a la BBDD, y en `db` se guarda el objeto con las funciones `query()` y `close()` que uso a continuación.

Con `list = await db.query(request);` realizo la consulta a la BBDD. Por supuesto `request` es un parámetro que nos llega desde el servicio en `searchServices.js`.

Por último, con `await db.close()` cierro la conexión a la BBDD.

Ahora, con `return list` puedo devolver el resultado obtenido de la BBDD al servicio;

# Resumiendo

Al hacer una petición a la ruta de nuestra API, esta llama a una función en el controlador encargada de procesar los datos recibidos en la petición que a su vez llama a una función en el servicio encargado de hacer la consulta a la BBDD.

La función del servicio llama a una función en el fichero utils.js que se ocupa de establecer la conexión, realizar la consulta a la BBDD y cerrar la conexión. Esta función se externaliza porque, generalmente, su funcionalidad es la misma para cada consulta a la BBDD en cada servicio, cambiando sólo la consulta SQL a realizar.

Para poder ejecutar esta función en el fichero utils.js se requiere del módulo de conexión que exporta tanto los datos de conexión como una función que permite realizar la conexión a la BBDD, la consulta y el cierre de la conexión, de tal forma que pueda usarse con async/await.

# Enlaces

* Página de la que he obtenido la pista para resolver esta cuestión [Node.js, MySQL and async/await](https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628)
* La función util.promisify() en Node.js [util.promisify()](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original)
* Usando el método .call [¿Para qué sirven los métodos .call() y .apply() en JavaScript?](https://dev.to/imsergiobernal/para-que-sirven-los-metodos-call-y-apply-en-javascript-4bj2)
* Libreria alternativa que incluye promesas (Aportada por borja) [Node MySQL 2](https://www.npmjs.com/package/mysql2)
* ORM: [Sequelize](https://sequelize.org/)
* Ejemplo de uso de pool de conexiones mysql, aportado por Jose, de «Desarrollo útil». [Node.js Rest APIs with Express & MySQL example](https://github.com/bezkoder/nodejs-express-mysql)