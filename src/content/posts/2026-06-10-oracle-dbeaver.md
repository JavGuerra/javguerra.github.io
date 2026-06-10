---
route: oracle-dbeaver
title: Acceder a BBDD Oracle con DBeaver
description: Configuración de la aplicación con los drivers originales.
author: JavGuerra
pubDate: 2026-06-10
coverImage:
  image: '@/assets/img/oracle-dbeaver.jpg'
  alt: Pantalla de ordenador con DBeaver conectado a BBDD Oracle
tags:
    - herramienta
    - servidor
    - BBDD
    - software libre
---

[DBeaver](https://dbeaver.io/) es una herramienta de gestión de bases de datos multiplataforma y de código abierto que permite conectarse y trabajar con distintos sistemas como Oracle, MySQL, PostgreSQL o SQL Server desde una única interfaz. Ofrece funcionalidades como ejecución de consultas SQL, exploración de estructuras, edición de datos y administración de conexiones, destacando por su flexibilidad y compatibilidad con múltiples drivers. En esta te explico cómo instalar los drivers originales de Oracle en DBeaver.

## Descargando DBeaver

Puedes descargar la última versión de la aplicación desde:

[Download DBeaver Community](https://dbeaver.io/download/)

Hay disponibles versiones para Windows, macOS y Linux.

Si vas a descargar la versión de Windows, dispones también de un fichero `.zip` que no requiere instalación en el sistema. Tan sólo descomprimes la carpeta en el lugar que decidas y la aplicación estará lista para usarse.

## El problema

Elegí esta herramienta porque, como otras, me permite acceder a la BBDD desde mi entorno local, pero empleando los drivers originales de Oracle, con lo que consigo la máxima compatibilidad, con un software versátil y abierto. Pero al seguir los pasos para descargar automáticamente los drivers:

1. Abrir DBeaver.
2. Ir a `Database` → `Driver Manager`.
3. Buscar `Oracle` en la lista y seleccionarlo.
4. Pulsar `Edit`.
5. Ir a la pestaña `Libraries`.
6. Y pulsar `Download/Update`.

Obtuve un error. Ocurre que Oracle no permite la descarga automática directa en muchos casos, así que DBeaver falla.

## La alternativa

Descargar los drivers directamente desde la página de Oracle:

[Oracle Database JDBC driver and Companion Jars Downloads](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html)

Deberás seleccionar los drivers adecuados. En mi caso decidí descargar el fichero `ojdbc11-full.tar.gz` bajo el título `Zipped JDBC driver (ojdbc11.jar) and Companion Jars` que viene con todos los ficheros necesarios y está certificado para las versiones JDK 11 de Java (en mi caso) y versiones superiores.

Una vea descargado, hay que descomprimir el contenido en la carpeta que desees. También puedes descomprimirlo en la carpeta `pluggins` dentro de la carpeta de DBeaver.

## Instalando los drivers

El siguiente paso es instalar los drivers en la aplicación. Por defecto, DBeaver carga cuatro de ellos.

- `ojdbc11.jar` (la versión para mi JDK.) Obligatorio. El driver JDBC principal de Oracle que permite la conexión a BBDD.
- `orai18n.jar` Recomendado. Es el soporte de internacionalización (i18n) que permite manejar caracteres especiales, codificaciones (UTF-8, etc.) y distintos idiomas correctamente.
- `xdb.jar` Opcional. Librería para XML DB de Oracle si se trabaja con XML almacenado en la base de datos y se requieren funcionalidades avanzadas tipo XMLType.
- `xmlparserv2.jar` Opcional. Parser XML de Oracle para procesar XML internamente y dar soporte a funcionalidades de xdb.jar.

Para ello debes estar en la pestaña `libraries` del driver Oracle en la en la opción `Driver manager` del menú `Database`. Ver pasos para llegar más arriba. Y una vez allí:

1. Pulsamos `Add File`, seleccionamos cada fichero mencionado, y le damos a `Open`.
2. Repetimos la opción por cada fichero.
3. Una vez tenemos todos los drivers abiertos, ya no necesitamos los drivers que aparecen por defecto. Los quitamos con `Delete` para que no den problemas.

## Conectar a la BBDD

Ahora ya podemos ver si todo ha ido bien.

En el menú `Database`, hacemos clic en la opción `New connection` e introducimos los datos de la conexión. La nueva conexión a BBDD aparecerá en el espacio de conexiones de la izquierda.

## TIPs

Podemos arrastrar el nombre de la BBDD a `Bookmarks` (Favoritos) en la lista de abajo, a la izquierda, para poder acceder de forma fácil a ella.

También podemos poner DBeaver en español. Para esto iremos a `Windows`, luego `Preferences`, y en la opción `User Interface` elegiremos el idioma español.

Para más información sobre el uso de DBeaver, puedes consultar la documentación en el Wiki:

[About DBeaver](https://github.com/dbeaver/dbeaver/wiki)

# Enlaces

- [DBeaver](https://dbeaver.io/)
- [About DBeaver](https://github.com/dbeaver/dbeaver/wiki)
- [Download DBeaver Community](https://dbeaver.io/download/)
- [Oracle Database JDBC driver and Companion Jars Downloads](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html)