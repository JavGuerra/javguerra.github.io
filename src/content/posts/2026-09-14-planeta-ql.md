---
route: planeta-ql
title: Sinclair QL Planet
description: Construyendo un agregador de noticias en línea sobre Sinclair QL
author: JavGuerra
pubDate: 2026-09-14
coverImage:
  image: '@/assets/img/ql-planet.png'
  alt: Captura de pantalla de QL Planet
tags:
- herramienta
- retro
- Sinclair QL
---

En el mundo de la informática retro, la información sobre un sistema tan de nicho pero apasionante como el [Sinclair QL](/blog/tag/sinclair%20ql/) suele estar dispersa en múltiples blogs, foros y sitios personales. Para intentar solucionar esto y centralizar las novedades del universo QL en un solo lugar, he puesto en marcha un Planet (agregador de feeds) con un diseño marcadamente retro. En esta entrada os cuento cómo funciona por dentro y los pasos que he seguido para implementarlo y desplegarlo.

## ¿Qué es Pluto?

[Pluto](https://github.com/feedreader/pluto) es un motor de feed estático y agregador de noticias en línea de código abierto que recopila artículos desde múltiples fuentes [RSS](https://es.wikipedia.org/wiki/RSS) o [Atom](https://es.wikipedia.org/wiki/Atom_(formato_de_redifusi%C3%B3n)) para combinarlos en una única página web personalizada. Utiliza Ruby porque se beneficia de la flexibilidad de su sintaxis y del maduro ecosistema de procesamiento de textos y plantillas ERB (Embedded Ruby) característico de este lenguaje, lo que permite transformar datos estructurados en sitios web de forma limpia e intuitiva. En el entorno de Ruby, las gemas (gems) son paquetes de software o librerías independientes reusables (similares a los paquetes de npm en JavaScript o pip en Python) que permiten añadir funcionalidades específicas a una aplicación —como en el caso de la propia gema pluto, que encapsula todas las herramientas necesarias para descargar, parsear y compilar tus feeds automáticamente.

## ¿Cómo funciona el agregador?

El sitio opera como un generador de sitios estáticos ([SSG](https://es.wikipedia.org/wiki/Generador_de_sitios_est%C3%A1ticos)) alimentado por fuentes web. No requiere un servidor dinámico con base de datos tradicional, PHP o Node.js ejecutándose continuamente. Así funciona:

1. Recopilación: Usa Pluto, diseñado para descargar feeds XML de las fuentes suscritas (blogs en WordPress, Blogger, subforos de phpBB, etc.) y unificarlos en una base de datos local SQLite temporal.

2. Filtrado dinámico: A través de plantillas ERB, se procesa el contenido capturado:

    - Elimina ruido (por ejemplo, descartando respuestas repetitivas Re: en foros como phpBB para mostrar solo temas nuevos).
    - Ajusta los límites de visualización (hasta 50 artículos recientes).
    - Formatea las fechas y horas en formato GMT relativo y absoluto.

3. Genera HTML/CSS: Se compila un único archivo index.html optimizado, con soporte para modo oscuro/claro basado en las preferencias del sistema y estilos CSS retro.

4. Genera RSS/Atom: Se genera un feed RSS/Atom con los artículos recientes a partir de sus correspondientes plantillas.

5. Despliegue automatizado (GitHub Actions): Un workflow programado ejecuta el proceso de generación periódicamente y publica el resultado directo en GitHub Pages.

Puedes acceder a [<button>Sinclair QL Planet</button>](https://javguerra.github.io/Sinclair-QL-planet/) y a su [reposirorio en GitHub](https://github.com/JavGuerra/Sinclair-QL-planet/).

## Pasos para ponerlo en funcionamiento

### 1. Definición de fuentes (planet.ini)

El primer paso fue crear el archivo de configuración donde se listan las fuentes a las que el planeta está suscrito. Aquí podemos incluir blogs completos o filtrar por etiquetas/subforos específicos.

### 2. Personalización de la plantilla (planet.starter.html.erb)

Para lograr la estética CRT deseada y solucionar limitaciones de algunos feeds, adaptamos la plantilla ERB:

- Sencillez en los metadatos: Dado que muchos feeds no estandarizan el autor de cada entrada, simplificamos los metadatos para mostrar la hora de publicación y el tiempo transcurrido (14:30 GMT (hace 2 horas)).

- Filtro anti-respuestas para foros: Como los feeds de phpBB suelen devolver todas las respuestas cuando el servidor tiene deshabilitado el modo de solo temas, añadimos una condición Ruby para saltar cualquier publicación cuyo título contenga `Re:`.

```erb
  <% next if item.title.downcase.include?('re:') %>
```

- Límite de artículos: Ajustamos el bucle a .limit(100) al consultar la base de datos y un contador para mostrar un máximo de 50 artículos principales limpios en portada.

### 3. Automatización continua con GitHub Actions

Para evitar tener que compilar el sitio a mano en local cada vez que hay noticias, creo un flujo de trabajo en .github/workflows/static.yml que:

1. Se ejecuta periódicamente (por ejemplo, cada pocas horas mediante un cron de GitHub).
2. Instala Ruby y la gema pluto.
3. Ejecuta el comando de compilación: `pluto build planet.ini -t planet-starter`.
4. Sube el directorio generado a la rama de GitHub Pages.

## Resultado final

El resultado es un agregador ultrarrápido, ligero, de bajo mantenimiento y con una estética que evoca la era dorada de la microinformática de los 80. Todo el contenido relevante del Sinclair QL se actualiza solo y está disponible a un par de clics.

## Enlaces

- [Sinclair QL Planet](https://javguerra.github.io/Sinclair-QL-planet/)  
- [reposirorio en GitHub](https://github.com/JavGuerra/Sinclair-QL-planet/)  
- [Pluto](https://github.com/feedreader/pluto)  
- [Plantilla base empleada](https://github.com/feedreader/pluto.starter)
- [Static Site Generator (SSG)](https://es.wikipedia.org/wiki/Generador_de_sitios_est%C3%A1ticos)
- [RSS](https://es.wikipedia.org/wiki/RSS) y [Atom](https://es.wikipedia.org/wiki/Atom_(formato_de_redifusi%C3%B3n))  
- [Entradas sobre el Sinclair QL](/blog/tag/sinclair%20ql/)
