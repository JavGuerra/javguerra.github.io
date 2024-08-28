---
route: validacion
title: Validación de formularios
description: Combinando validaciones propias con las de HTML5
author: JavGuerra
pubDate: 2022-05-13
coverImage:
  image: '@/assets/img/validacion.png'
  alt: Validación de formularios
tags:
    - código
    - HTML
    - JavaScript
    - formularios
    - usabilidad
---
¿Cómo procesar un formulario antes de enviarlo, realizando validaciones propias en sus campos y aprovechando simultáneamente la validación de restricciones implícita en HTML5?

Que ambos tipos de validaciones se den al mismo tiempo es importante, ya que si esto se hiciera consecutivamente, es decir, una a continuación de la otra, llevando a cabo primero nuestra validación y luego la de HTML5, correríamos el riesgo de que los campos propios ya validados pudieran ser alterados por el usuario una vez pasada la primera validación, si en la segunda validación hay campos erróneos que obligan al usuario a editarlos, y por tanto el formulario se enviaría con errores. Veamos cómo se haría.

[<button>Formulario de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/validacion.html)

Tenemos un formulario con tres campos requeridos (obligatorios): «nombre», «edad» y «correo», y al campo «edad» le añado una restricción propia, que su valor debe ser mayor o igual a 16, y si esto no se cumple, deberé mostrar un mensaje de error personalizado en el mismo campo (al estilo de los mensajes de error de HTML5). El formulario cuenta con dos botones: «Borrar» y «Enviar».

Si no tuviésemos que realizar nuestra validación, el proceso sería sencillo, ya que HTML se ocupa de todo por nosotros. Al hacer click en el botón enviar de tipo submit (```<button type="submit">Enviar</button>```), se lanza el evento ```submit()```, y el formulario se envía si no hay errores tras validarlo, o nos muestra los errores de validación de campos implícita en HTML5. Pero para poder realizar nuestras propias validaciones debemos romper este flujo, y tomar el control de la validación.

## Tomando el control

Esto podemos hacerlo de dos formas:

1. Capturamos el evento ```submit()``` asociado al botón «Enviar» con ```form.onsubmit = validaForm;``` en JavaScript, incluyendo en ```function validaForm(evento)``` un ```evento.preventDefault();``` que evite que el ```action``` del formulario se procese, y realizando por nuestra cuenta todas las validaciones (las propias y las de HTML5), usando su ([API](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api)), para terminar lanzando el evento ```form.submit()``` que retomará el curso del formulario. 
2. Usamos un botón «Enviar» que no incluya el ```type="submit"```, y asociamos este botón a un evento que llame a la función de validación ```validaForm()``` desde la cual, al final, lanzaremos también el ```form.submit()``` si se cumplan las dos condiciones de este ejemplo: edad correcta y campos obligatorios rellenados.

La opción elegida aquí es la segunda por ser la más simple para cumplir el objetivo marcado de llevar a cabo ambas validaciones. Desde la mencionada función ```validaForm()``` comprobamos la edad con la función ```validaEdad()``` que debe devolver ```True``` o ```False```, y comprobamos si el formulario tiene errores con ```form.checkValidity()```, que también devuelve ```True``` o ```False```. Si ambas comprobaciones son ```True```, el formulario se envía.

A diferencia del evento ```submit``` asociado al botón ```type="submit"```, cuando usamos ```form.submit()``` no se lleva a cabo la validación del formulario, por lo que debemos realizarla nosotros mismos con ```form.checkValidity()```.

Veamos el código JavaScript:

```javascript
01. const enviar = document.querySelector('#enviar');
02. const form   = document.formulario;
03. 
04. enviar.onclick = validaForm;
05. 
06. function validaForm() {
07.   if ( validaEdad() && form.checkValidity() ) {
08.     alert('Ambas validaciones son correctas.');
09.     form.submit();
10.   } else {
11.     alert( 'El formulario contiene errores.' );
12.   }
13. }
14. 
15. /* Comprueba que el usuario tenga más de 16 años */
16. function validaEdad() {
17.   let valida = true;
18.   let error  = '';
19.   if (form.edad.value < 16) {
20.       valida = false;
21.       error  = 'Demasiado joven.';
22.   }
23.   form.edad.setCustomValidity(error);
24.   return valida;
25. }
```

Para llegar a esta solución me inspiré en una [pregunta](https://stackoverflow.com/questions/45789010/how-to-use-html-form-checkvalidity) realizada en **StackOverflow**, y en el [enlace](https://www.w3schools.com/js/js_validation_api.asp) de **W3Schools** que aparece en la señalada como mejor respuesta de esa pregunta.

En caso de tener que llevar a cabo más validaciones propias, bastaría con encadenarlas en el ```ìf()``` de la línea **7**, o crear una función a parte que incluya todas nuestras validaciones, que sustituya a ```validaEdad()``` y que devuelva ```True``` o ```False```.

## La función validaEdad()

En la línea **18** inicializamos la variable ```error``` con ```''``` que luego usaremos en la línea **23** con ```.setCustomValidity()```. Cuando se ejecuta la línea **23** pasan dos cosas: se marca un error (o no) en el campo edad, y se asigna un mensaje de error personalizado que le pasamos a ```form.edad.setCustomValidity(error);```. Si el mensaje de error es ```''``` (cadena vacía) estaremos indicando que no hay ningún error en el campo edad, por tanto la validación de restricciones de HTML5 sabrá que el formulario es correcto. En caso contrario, estaríamos enviando el mensaje de error personalizado (que definimos en la línea **21**) y marcando entonces un error en ese campo. 

Es importante que, una vez el contenido del campo edad sea el correcto, es decir, la edad introducida sea **mayor o igual a 16**, pasemos ```''``` como parámetro a ```.setCustomValidity()```, de lo contrario el formulario nunca se procesará, porque «edad» permanecerá marcado como un campo erróneo. Por defecto, en el ejemplo, se pasará ```''``` al llamar a la función ```validaEdad()``` si se comprueba que no hay error.

Como es comprensible, esta forma de proceder deberemos usarla en cada una de las comprobaciones propias que llevemos a cabo.

## Valida / NO valida

¿Qué ocurre si la edad no es correcta o si uno de los campos obligatorios está vacío? Como el formulario no es correcto, se mostrará la alerta de la línea **11**. Podemos sustituir esta alerta del ejemplo por una serie de acciones de aviso al usuario u otras para informar de que algo no ha ido bien (o no hacer nada, si no necesitamos el ```else```). En caso contrario, si todo ha ido bien, el formulario será válido, y se llevará a cabo lo estipulado en las líneas **8** y **9**.

La alerta de la línea **8** del ejemplo puede sustituirse por cualquier cosa que queramos llevar a cabo antes de enviar el formulario en la línea **9**, por ejemplo, mostrar los valores de los campos para que el usuario los revise antes de enviar, si estamos realizando una compra, un envío de dinero… Por último, en la línea **9**, enviamos el formulario con ```form.submit()```.

Eso es todo. Puedes ver el ejemplo empleado en esta entrada y más información relacionada en los siguientes enlaces:

[<button>Formulario de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/validacion.html)

## Enlaces

* [API de formularios](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api)
* [Información y ejemplos en W3Schools](https://www.w3schools.com/js/js_validation_api.asp)
* [Información en StackOverflow](https://stackoverflow.com/questions/45789010/how-to-use-html-form-checkvalidity)




