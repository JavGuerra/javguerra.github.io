---
route: ql-scr-viewer
title: Sinclair QL SCR Viewer
description: Muestra pantallas del ordenador Sinclair QL
author: JavGuerra
pubDate: 2024-02-10
coverImage:
  image: '@/assets/img/qlscrview.png'
  alt: QL SCR Viewer
tags:
    - web
    - HTML
    - JavaScript
    - herramienta
    - código
    - retro
    - Sinclair QL
    - software libre
---

El QL original tiene dos modos de pantalla, el modo de 256×256 pixels a 8 colores, y el modo de 512×256 pixels a 4 colores.

La aplicación Sinclair QL SCR Viewer es un HTML que permite cargar en el navegador un archivo de imagen en estos formatos ubicado en local o en remoto, mediante un botón INPUT, para mostrar su contenido sin que ocurran errores de CORS, y sin usar un servidor.

La imagen resultante puede descargarse en formato PNG con un tamaño de 1024×768 pixels.

Se escribió un [artículo para QBlog](https://sinclairqles.wordpress.com/2024/02/10/ql-scr-viewer-en-linea/) con más información de cuál es la estructura de codificación de las pantallas en estos dos modos que puedes consultar.

El desarrollo se ha llevado a cabo a ratos, durante una semana, y se ha hecho uso de la IA [Phind](https://www.phind.com/) para consultas técnicas que han sido de gran utilidad. La aplicación acrtualmente está en la versión 1.0.

Hice uso de GitHub pages para alojar el desarrollo y también la aplicación que está disponible en:

[<button>QL SCR Viewer</button>](https://javguerra.github.io/Sinclair-QL-SCR-viewer/)

## Objetivo de la aplicación

Hagamos un poco de arqueología. En los tiempos del QL (años 80) era muy normal cargar y salvar a y desde memoria de pantalla las imágenes que querían mostrarse. Solía usarse para mantener al usuario atento con una pantalla colorida mientras terminaba la carga del programa desde algún medio de almacenamiento. ¡Esto podía demorar minutos!

Dado que las imágenes de pantalla del QL son datos con estructura, pero sin cabecera, es complicado poder visualizarlas en un PC si no se lleva a cabo una conversión, y eso es justamente lo que hace esta aplicación, además de permitir descargar la pantalla en formato PNG.

La idea era crear una herramienta que no dependiera de ningún sistema host, para que pudiera ser usada en cualquier sistema operativo actual. Emplear HTML + JavaScript era una opción interesante que permitía hacer uso de la aplicación en local, pero también ofrecer la aplicación como un servicio en línea.

## Características

- Maneja pantallas en modos 8 y 4.
- Detecta automáticamente el modo de pantalla.
- Permite el cambio de modo de la imagen cargada.
- Funciona en local evitando errores de CORS.
- Descarga la imagen visualizada en PNG.
- Es responsive.
- Es accesible.
- Detecta errores de carga.

## Info sobre el funcionamiento de la aplicación

El desarrollo inicialmente se centró en el _parser_ o analizador sintáctico que debía «entender» los dos modos. Mediante un botón de carga y un evento asociado se accede al fichero, y luego se procesa.

Igualmente se asocian eventos al botón de cambiar de modo y al botón de descargar archivos. Estos eventos llaman a sus correspondientes funciones.

El código ha sido optimizado para poder funcionar en local sin que se generen errores de CORS (Cross-Origin Resource Sharing en inglés), una funcionalidad de los navegadores que ayudan a evitar problemas relacionados con la seguridad de la información.

Para visualizar correctamente la imagen se hace uso de una función que revisa los datos cargados y determina si la imagen está en modo 8 o en modo 4 y, si corresponde, cambia el modo de visualización.

A la hora de visualizar la imagen se han empelado dos canvas, uno donde se dibuja la imagen y otro que contiene este primer canvas que lo muestra en la escala adecuada para que se vea completo y proporcional en cualquier dispositivo. La proporción de la imagen es 4:3 y el tamaño de la imagen es de 1024x768.

Se ha elegido esta resolución porque es múltiplo de las resoluciones de ambos modos. De hecho, para representar correctamente las imágenes de los modos 8 y 4, un pixel de una imagen en modo 8 ocupará cuatro pixeles de ancho y tres de alto en la imagen resultante, y un pixel de una imagen en modo 4 ocupará dos píxeles de ancho y tres píxeles de alto en la imagen resultante.

La representación de color de los modos se realiza de la siguiente forma: el modo 8 usa cuatro bits por pixel para representar cada color (GFRB - Green, Flash, Red, Blue), con una profundidad de color de 8 (negro, azul, rojo, magenta, verde, cian, amarillo, blanco). Hay un bit que no se usa, que corresponde al flash (F) o parpadeo, una característica que tiene este ordenador. El modo 4 usa 2 bits por pixel (GR - Green, Reed), con una profundidad de color de 4 (negro, rojo, verde, blanco). Pues bien, para poder mostrar los colores en formato RGB, si un bit R, G o B está a cero, el valor de su componente RGB será 0, si es 1, el valor de su componente RGB será 255. En el modo 4, para obtener el valor de B, si los valores G y R están a 1, el valor B será 1, y el valor de su componente, 255, en caso contrario, será 0.

La pantalla del QL clásica tiene un tamaño de 32.768 bytes en ambos modos. Al cargar la imagen esto se comprueba, así como si el archivo está vacío o si no se ha podido acceder al medio.

Con el botón de intercambio de modo, podemos cambiar el modo de visualización de la imagen, caso que puede ser de utilidad si la detección automática no terminó de funcionar correctamente. Esto se hace sin necesidad de volver a acceder a la imagen, aprovechando los datos que están almacenados en el _buffer_.

La descarga en PNG permite obtener una imagen que se guardará con el formato nombre + sufijo + extensión. El `nombre` corresponde al nombre del archivo original. La extensión será `_QL8` o `_QL4` según corresponda, y la extensión será `.png`.

Para el desarrollo se ha tenido en cuenta el uso accesible de la aplicación, mediante la incorporación de etiquetas WAI-ARIA en el código.

## Saber más

* [QL SCR Viewer en línea](https://javguerra.github.io/Sinclair-QL-SCR-viewer/)
* [Artículo sobre QL SCR Viewer para QBLog](https://sinclairqles.wordpress.com/2024/02/10/ql-scr-viewer-en-linea/)
* [Repositorio de QL SCR Viewer en GitHub](https://github.com/JavGuerra/Sinclair-QL-SCR-viewer)
* [Info sobre Sinclair QL](/blog/sinclair-ql)
