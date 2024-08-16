---
route: proyecto-final-bootcamp
title: Tienda 8 bits
description: Proyecto de graduación del Bootcamp Full Stack Web Developer.
author: JavGuerra
pubDate: 2022-11-18
coverImage:
  image: '@/assets/img/banner-tienda8bits.png'
  alt: Banner
tags:
    - web
    - formación
    - becas
    - Node.js
    - Express
    - React
    - MongoDB
    - JavaScript
    - accesibilidad
    - responsive
---

Durante el año 2022 cursé el [Bootcamp de Desarrollo Web Full Stack](beca-santander-fswd) que [Becas Santander](https://www.becas-santander.com/es/index.html) llevó a cabo en colaboración con [Fundación Universia](https://jobs.universia.net/), [Indra](https://www.indracompany.com/) y [The Bridge](https://www.thebridge.tech/).


[<button>Ir a la aplicación on-line</button>](https://javguerra.badared.com/proyecto/tienda8bits/)

El día 17 de noviembre finalizó la formación con un acto de entrega de diplomas on-line en el que tuve ocasión de mostrar mi proyecto final «Tienda 8 bits» junto con Alex, otro de mis compañeros, quien también expuso su proyecto.

A parte de los compañeros y los profesores, asistieron al evento Alejandra Cuenca y Diego Díaz por parte de The Bridge, Cristina Soriano por Minsait/Indra, y Beatriz Arribas y Carlos Sánchez por Universia.

# Video

El evento se llevó a cabo de forma presencial y on-line, y de él he rescatado el video de mi presentación que comparto a continuación.

![Video de presentación](@/assets/img/tienda.png)

[<button>Ver el video en YouTube</button>](https://youtu.be/XlswjqhxJZ8)

# Descripción técnica

## Back end

__Tecnologías empleadas__: Node.js + Express + MongoDB + Mongoose  
__Módulos__: compression, cors, helmet, dotenv, nodemon, mongoose-paginator-v2

__Características destacadas de la API__:
* Emplea módulos ESM. 
* Está preparada para el versionado de la API.  
* Está preparada para el uso de BBDD MongoDB local o en remoto (config.js).  
* Preserva la seguridad del acceso a la API con el uso del módulo helmet.  
* Devuelve las rutas de los enlaces a las fotos y logos dinámicamente.  
* Cuenta con documentación de la API.  

## Front end

__Tecnologías empleadas__: React + Vite, axios, react-router-dom, react-hook-form  
__Módulos propios__: setSpin, inactiveBtn, compareTwoObjects

__Características destacadas de la App__:
* El diseño es adaptable (responsive) según el dispositivo.  
* CSS propio. No usa frameworks.  
* Es accesible (revisado con el complemento [WAVE](https://wave.webaim.org/)).   
* Utiliza fuentes de Google Font en los títulos para preservar la accesibilidad.  
* Implementa el protocolo [Open Graph](https://ogp.me/) para la correcta inserción de la web en RRSS.  
* Es compatible con Progessive Web Aplication ([PWA](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)) a través de fichero [manifest.json](https://developer.mozilla.org/es/docs/Web/Manifest), por lo que la página puede ser instalada en dispositivos móviles como una web app.  
* Ha sido probada con los navegadores web Firefox y Chrome.  
* Tratamiento de imágenes con software libre: Gimp e InkScape.  

## Fuentes

* Wikipedia  
* Enciclopedia «Mi Computer», editorial Delta, 1984.  

## Licencias

Sobre el código fuente: [GNU GENERAL PUBLIC LICENSE Version 3](https://github.com/JavGuerra/tienda-8-bits/blob/main/LICENSE)  
Sobre el contenido de la web: [(CC) BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/es/)  
Sobre las fotos: Son propiedad de sus respectivos autores.  
Sobre las fuentes de letra: [Google Fonts](https://fonts.google.com/)  
Sobre los iconos: [Heroicons](https://heroicons.com/)  
Material usado sin ánimo de lucro bajo criterios didácticos y formativos.   

## Acceder a la aplicación

![Código QR](https://raw.githubusercontent.com/JavGuerra/tienda-8-bits/0d3d3a968787a438379d003fe31aaede91011e40/qrcode.svg)  

[<button>Ir a la aplicación on-line</button>](https://javguerra.badared.com/proyecto/tienda8bits/)  

## Enlaces
- [Aplicación on-line](https://javguerra.badared.com/proyecto/tienda8bits/)  
- [Documentación de la API](https://api-tienda8bits.up.railway.app/)  
- [Enunciado de la práctica en PDF](https://github.com/JavGuerra/tienda-8-bits/blob/main/enunciado.pdf)  
- [Repositorio en GitHub](https://github.com/JavGuerra/tienda-8-bits)  
- [Video de la presentación en YouTube](https://youtu.be/XlswjqhxJZ8)  
- [Presentación en PDF](https://github.com/JavGuerra/tienda-8-bits/blob/main/presentacion.pdf)  

__Artículos informativos elaborados por el autor relacionados con esta práctica:__:  

- [Usando populate con paginate y filtrando los resultados](populate-paginate-fitrado)  
- [Generar enlaces dinámicos de imágenes almacenadas en MongoDB](rutas-dinamicas-imagenes-mongodb)  
- [Ordenando resultados en React](ordenacion-react)  
- [Spinner loader asíncrono](spinner-loader-asincrono)  