---
route: docker-lamp
title: Docker LAMP
description: Linux, Apache, MySQL y PHP con Docker
author: JavGuerra
pubDate: 2024-09-11
coverImage:
  image: '@/assets/img/docker-lamp.jpg'
  alt: Logos de Docker y LAMP
tags:
  - BBDD
  - MySQL
  - PHP
  - Docker
  - servidor
  - Apache
  - programación
  - Internet
---

Entre las herramientas de desarrollo web más comunes no falta el entorno de ejecución. Se hace lento desplegar los cambios al servidor con cada modificación del código que queremos probar. Para evitar esto se creó [LAMP](https://es.wikipedia.org/wiki/LAMP), que es una combinación de Linux, Apache, MySQL (o MariaDB) y PHP que permite que se puedan ejecutar aplicaciones web en local. Este artículo pretende mostrar cómo se puede instalar y ejecutar este entorno de desarrollo web en un sistema Linux usando Docker.

La principal ventaja de usar Docker es la de poder contar en el desarrollo con una infraestructura análoga a la del despliegue, con el mismo versionado y configuraciones de los servicios.

Los contenedores son unidades ligeras y portátiles que empaquetan el código y todas sus dependencias para ejecutarse de forma independiente en cualquier sistema que soporte Docker.

El lector debe conocer Docker para seguir correctamente este artículo, no obstante, siguiendo los pasos indicados aquí se podrá levantar un entorno de desarrollo web LAMP en un sistema Linux sin mayor inconveniente.

# Instalación de Docker y Docker Compose

Será necesario tener instalado [Docker](https://es.wikipedia.org/wiki/Docker) en el sistema para poder ejecutar el entorno de desarrollo web.

Junto con Docker, vamos a instalar [Docker Compose](https://docs.docker.com/compose/), una herramienta que permite ejecutar varios servicios de Docker a la vez.

Una vez tengamos ambos instalados, necesitaremos crear un fichero de configuración llamado `docker-compose.yml` que contendrá la configuración de los servicios que se va a desplegar, y accesoriamente, un fichero `Dockerfile` que contendrá las configuraciones comple,entarias necesarias.

Por último, veremos como ejecutar y parar el entorno de desarrollo web.

## Docker

Para instalar Docker, necesitaremos cumplir con algunas dependencias:

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common
```

Podemos seguir la [documentación oficial](https://docs.docker.com/engine/install/) o usar el meta-paquete docker-ce, la última versión de Docker:

```bash
sudo apt-get install docker-io
```

Posteriormente se añade nuestro usuario al grupo docker. Esto nos permitirá ejecutar comandos de Docker sin necesidad de tener permisos de superusuario:

```bash
sudo usermod -aG docker $USER
```

Una vez instalado, se puede comprobar que se está ejecutando Docker usando el siguiente comando:

```bash
docker --version
```

## Docker Compose

Para instalar Docker Compose se puede usar el siguiente comando:

```bash
sudo apt install docker-compose
```

Luego se puede comprobar que se está ejecutando Docker Compose usando el siguiente comando:

```bash
docker-compose --version
```

Ya tenemos todo lo necesario para instalar el entorno de desarrollo web LAMP.

# Stack LAMP con Docker

Para facilitar su despliegue, uso un fichero llamado `docker-compose.yml` que contiene la configuración de los servicios que se va a desplegar.

## Contenido del fichero docker-compose.yml

Mediante el siguiente fichero se configuran y lanzan los diferentes contenedores, volúmenes y redes del entorno para tres servicios: `www`, `db` y `phpmyadmin`.

```yaml
version: "3.1"
services:
    www:
        build: .
        ports: 
            - 8081:80
        volumes:
            - www:/var/www/html
        depends_on:
            - db
        networks:
            - default
    db:
        image: mysql
        ports: 
            - 3306:3306
        command: --default-authentication-plugin=mysql_native_password
        environment:
            MYSQL_ROOT_PASSWORD: example 
        volumes:
            - ./dump:/docker-entrypoint-initdb.d
            - ./conf:/etc/mysql/conf.d
            - persistent:/var/lib/mysql
        networks:
            - default
    phpmyadmin:
        image: phpmyadmin/phpmyadmin
        depends_on: 
            - db
        ports:
            - 8080:80
volumes:
    persistent:
```

Este fichero está escrito en formato [YAML](https://es.wikipedia.org/wiki/YAML), que es un lenguaje de marcado de datos, que permite definir la estructura de un fichero de configuración de forma legible y fácil de entender. Como en Python, los espacios son importantes aquí.

El contenedor `www` será el encargado de gestionar el servidor web, y PHP. Por su parte, el contenedor `db` se ocupará de la base de datos MySQL y `phpmyadmin` lo hará del entorno de administración de la BBDD.

Por cada servicio, se detallan algunos valores de configuración, como los puertos o las claves de acceso. En el caso de `www` es destacable que se hace uso de un fichero dockerfile externo con:

```yaml     
build: .
```

El volumen (_volumes_) almacena y gestiona datos persistentes generados por los contenedores, permitiendo que los datos cruciales de la aplicación no se pierdan durante operaciones rutinarias, estando disponibles aunque los contenedores dejen de estar operativos, compartiendo los datos entre uno o varios contenedores.

Las redes (_networks_) permiten la comunicación entre contenedores y con el mundo exterior, facilitando la conexión entre contenedores en la misma red o con servicios externos, y proporcionando un entorno aislado para la red de contenedores.

## Contenido del fichero Dockerfile

Para su completo despliegue, el servicio `www` hace uso de un fichero Dockerfile que añade las configuraciones necesarias para obtener PHP, MySQL y varios compresores:

```bash
FROM php:8.0.0-apache
ARG DEBIAN_FRONTEND=noninteractive
RUN docker-php-ext-install mysqli
RUN apt-get update \
    && apt-get install -y libzip-dev \
    && apt-get install -y zlib1g-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install zip
RUN a2enmod rewrite
```

Lo guardo con el nombre `Dockerfile`. Tanto el fichero `docker-compose.yml` como el `Dockerfile` han de estar en la misma ruta.

## Ejecución del entorno de desarrollo web

Para poder probar su correcto funcionamiento uso:

```bash
docker-compose up -d
```

Esto levantará los contenedores. Si todo ha ido bien, se habrán descargado las imágenes correspondientes y lanzado los contenedores necesarios para disponer del entorno. Se puede obtener un listado de los contenedores levantados con:

```bash
docker-compose ps
```

Para probar su correcto funcionamiento, podemos copiar aquello que deseemos mostrar en el navegador a la carpeta `www` en la carpeta actual donde están los dos scripts, o bien podemos crear un fichero `index.php` con sólo el código siguiente:

```php
<?php phpinfo( ); ?>
```

Ahora debemos acceder al contenido mediante el navegador con la ruta:

```
localhost 8001
```

8001 es el puerto descrito en el fichero `docker-compose.yml` para el servidor web, pero podemos cambiarlo en el mismo fichero.

Una vez ejecutado, si podemos ver la información en el navegador, es que Apache y PHP están funcionando adecuadamente.

Para comprobar si MySQL y PHPMyAdmin están activos, accedemos a la misma dirección localhost pero por el puerto 8080:

```
localhost:8080
```

Para acceder podemos usar `root` como usuario y `example` como contraseña.

Cuando terminemos, podemos detener los contenedores mediante:

```bash
docker-compose stop
```

## Usando Docker LAMP en nuestros desarrollos

Ahora podemos levantar y detener los contenedores mediante simples comandos y ubicar estos script y el contenido que estemos desarrollando en la carpeta `www` de la misma manera que lo hicimos antes, y podemos mover toda esta estructura de ficheros a donde nos resulte más conveniente, o configurar el fichero `docker-compose.yml` para que sepa encontrar la carpeta `www` allá donde se ubique.

# BONUS: Portainer

Para una gestión más cómoda de los contenedores y su monitorización, se puede usar [Portainer](https://www.portainer.io/), un front end web local que se levanta como un contenedor más mediante:

```bash
sudo docker run -itd -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /docker/portainer:/data portainer/portainer-ce
```

Es posible acceder a él mediante la dirección localhost y el puerto 9443:

```
localhost:9443
```

![Portainer](@/assets/img/portainer.png)

Mediante este entorno se puede hacer una gestión de los contenedores y su monitorización, como se ve en la imagen.

# Saber más

- [LAMP](https://es.wikipedia.org/wiki/LAMP)
- [Docker](https://es.wikipedia.org/wiki/Docker) y [Docker Compose](https://docs.docker.com/compose/)
- [YAML](https://es.wikipedia.org/wiki/YAML)
- [MySQL](https://es.wikipedia.org/wiki/MySQL), [PHP](https://es.wikipedia.org/wiki/PHP) y [Apache](https://es.wikipedia.org/wiki/Apache_HTTP_Server)
- [XAMPP](https://es.wikipedia.org/wiki/XAMPP)
- [Portainer](https://www.portainer.io/)
