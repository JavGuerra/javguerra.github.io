---
route: parallax-simple
title: Un simple efecto Parallax
description: Programado con CSS
author: JavGuerra
pubDate: 2022-05-03
coverImage:
  image: '@/assets/img/css.png'
  alt: CSS
tags:
    - código
    - HTML
    - CSS
---

Parallax es un efecto que se aplica generalmente a las imágenes de fondo de una página web, y que consiste en mantener estático, o mover a una velocidad distinta, el resto de los elementos de la página al hacer _scroll_. Parecerá de esa forma que la página tiene profundidad. En mi [página de ejemplo](https://javguerra.github.io/conceptos-fswd/index.html) a la que hacía referencia en este [_post_](/blog/pagina-de-ejemplo), puede verse aplicado en la portada o zona «_Hero_».

esto se consigue de una forma muy sencilla. Sólo tienes que crear un div en el HTML y ponerle una clase, p. ej. «`.parallax`», y luego, en el CSS, en esa clase, incluir la altura que le darás al `div` y la imagen de fondo que le vas a poner. Por supuesto, dentro de ese `div` puedes incluir texto, imágenes... En el caso del ejemplo mencionado puse el título de la página.

```css
min-height: 100vh;
background: url("fondo.jpg") center/cover no-repeat fixed;
```

Estas son las dos líneas que he incluido en mi código para lograrlo. La primera le dice al navegador que el `div` va a tener la altura de la ventana del navegador, sea esta cual sea. Pero también se puede poner un valor fijo, por ejemplo `height: 300px`.

La segunda le dice al navegador que el `div` va a tener una imagen de fondo, en este caso `fondo.jpg`, y que la tiene que poner centrada vertical y horizontalmente (`center`), ocupando todo el ancho del div (`cover`), y poniéndola fija (`fixed`) para que no se mueva. Este es el efecto que buscamos.

El `fixed` lo hace todo. El fondo  del `div` permanecerá estático, y la página lo irá tapando a medida que hacemos _scroll_ hacia abajo.

En esta otra [página _landing_](https://badared.com/conectiva/evento/THTC2021/) que realicé para un evento, puede verse un uso parecido de efecto parallax a modo de cortinilla o separador de sus distintas secciones.

Este efecto tiene un inconveniente, y es que no funciona bien en el navegador Safari en iOS (iPad/iPhone), como se comenta [aquí](https://css-tricks.com/ios-13-broke-the-classic-pure-css-parallax-technique/), aunque es posible encontrar soluciones más o menos imaginativas buscando por Internet.

Mis páginas de ejemplo con este efecto Parallax:

[<button>página de ejemplo</button>](https://javguerra.github.io/conceptos-fswd/index.html) - [post](/blog/pagina-de-ejemplo)

[<button>página _landing_</button>](https://badared.com/conectiva/evento/THTC2021/)

El efecto Parallax puede complicarse aún más para conseguir resultados increibles. [Aquí](https://www.paellacreativa.com.ar/2012/05/24/efecto-parallax-diseno-web/) puedees ver algunos ejemplos.

**Actualización**. Francesc, un compañero del [bootcamp](/blog/beca-santander-fswd) que estoy realizando, me pasa un [interesante video](https://youtu.be/kN-eCBAOw60) de Walt Disney sobre cómo se aplica este efecto en las películas de animación. ¡Gracias por el aporte!