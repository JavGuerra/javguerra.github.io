---
route: validacion
title: Validación de formularios
description: Combinando validaciones propias con las de HTML5
author: JavGuerra
pubDate: 2022-05-13
coverImage:
  image: '@/assets/img/formulario.webp'
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

![Validación de formularios](@/assets/img/validacion.png)

[<button>Formulario de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/validacion.html)

Tenemos un formulario con tres campos requeridos (obligatorios): «nombre», «edad» y «correo», y al campo «edad» le añado una restricción propia, que su valor debe ser mayor o igual a 16, y si esto no se cumple, deberé mostrar un mensaje de error personalizado en el mismo campo (al estilo de los mensajes de error de HTML5). El formulario cuenta con dos botones: «Borrar» y «Enviar».

Si no tuviésemos que realizar nuestra validación, el proceso sería sencillo, ya que HTML se ocupa de todo por nosotros. Al hacer click en el botón enviar de tipo submit (`<button type="submit">Enviar</button>`), se lanza el evento `submit()`, y el formulario se envía si no hay errores tras validarlo, o nos muestra los errores de validación de campos implícita en HTML5. Pero para poder realizar nuestras propias validaciones debemos romper este flujo, y tomar el control de la validación.

## Tomando el control

Esto podemos hacerlo de dos formas:

1. Capturamos el evento `submit()` asociado al botón «Enviar» con `enviar.addEventListener('click', validaForm);` en JavaScript, incluyendo en `function validaForm(evento)` un `evento.preventDefault();` que evite que el `action` del formulario se procese, y realizando por nuestra cuenta todas las validaciones (las propias y las de HTML5), usando su ([API](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api)), para terminar lanzando el evento `form.submit()` que retomará el curso del formulario. 
2. Usamos un botón «Enviar» que no incluya el `type="submit"`, y asociamos este botón a un evento que llame a la función de validación `validaForm()` desde la cual, al final, lanzaremos también el `form.requestSubmit()` si se cumplan las dos condiciones de este ejemplo: edad correcta y campos obligatorios rellenados.

La opción elegida aquí es la segunda por ser la más simple para cumplir el objetivo marcado de llevar a cabo ambas validaciones. Desde la mencionada función `validaForm()` comprobamos la edad con la función `validaEdad()` que debe devolver `True` o `False`, y comprobamos nosotros mismos si el formulario tiene errores con `form.checkValidity()`, que también devuelve `True` o `False`. Si ambas comprobaciones son `True`, el formulario se envía.

Al utilizar `form.requestSubmit()`, el navegador se comporta exactamente igual que si el usuario hiciera clic en un botón de envío: ejecuta automáticamente la validación nativa (respetando atributos como required o pattern), muestra los mensajes de error al usuario si algo falla y dispara el evento submit, permitiendo que el formulario se gestione de forma segura y completa.

Veamos el código JavaScript:

```javascript
01. const enviar = document.querySelector('#enviar');
02. const form   = document.formulario;
03. 
04. enviar.addEventListener('click', validaForm);
05. 
06. function validaForm(evento) {
07.   evento.preventDefault();
08.   if (validaEdad() && form.checkValidity()) {
09.     alert('Ambas validaciones son correctas.');
10.     form.requestSubmit();
11.   } else {
12.     alert( 'El formulario contiene errores.' );
13.   }
14. }
15. 
16. /* Comprueba que el usuario tenga más de 16 años */
17. function validaEdad() {
18.   const edad = Number(form.edad.value);
19.   if (edad < 16) {
20.     form.edad.setCustomValidity('Demasiado joven.');
21.     return false;
22.   }
23.   form.edad.setCustomValidity('');
24.   return true;
25. }
```

Para llegar a esta solución me inspiré en una [pregunta](https://stackoverflow.com/questions/45789010/how-to-use-html-form-checkvalidity) realizada en **StackOverflow**, y en el [enlace](https://www.w3schools.com/js/js_validation_api.asp) de **W3Schools** que aparece en la señalada como mejor respuesta de esa pregunta.

En caso de tener que llevar a cabo más validaciones propias, bastaría con encadenarlas en el `ìf()` de la línea **8**, o crear una función a parte que incluya todas nuestras validaciones, que sustituya a `validaEdad()` y que devuelva `True` o `False`.

## La función validaEdad()

Cuando se ejecuta la función `validaEdad()`, pueden pasar dos cosas: 

Si la edad no es la adecuada, se marca el error en la línea **20**: Al pasar un texto como `'Demasiado joven.'`, el navegador marca el campo como inválido. Mientras exista este mensaje, el formulario estará bloqueado y no se podrá enviar.
    
Si la edad es la adecuada, se limpiar el error en la línea **23**: Es imprescindible pasar una cadena vacía `''` cuando el dato sea correcto. Esto indica al navegador que el campo vuelve a ser válido, permitiendo así el envío. Si no "limpias" el mensaje al cumplirse la condición, el campo quedará marcado como erróneo permanentemente.

Debes aplicar esta misma lógica en cada validación propia que realices.

## Valida / NO valida

¿Qué ocurre si la edad no es correcta o si uno de los campos obligatorios está vacío? Como el formulario no es correcto, se mostrará la alerta de la línea **12**. Podemos sustituir esta alerta del ejemplo por una serie de acciones de aviso al usuario u otras para informar de que algo no ha ido bien (o no hacer nada, si no necesitamos el `else`). En caso contrario, si todo ha ido bien, el formulario será válido, y se llevará a cabo lo estipulado en las líneas **9** y **10**.

La alerta de la línea **9** del ejemplo puede sustituirse por cualquier cosa que queramos llevar a cabo antes de enviar el formulario en la línea **10**, por ejemplo, mostrar los valores de los campos para que el usuario los revise antes de enviar, si estamos realizando una compra, un envío de dinero… Por último, en la línea **10**, enviamos el formulario con `form.requestSubmit()`.

Eso es todo. Puedes ver el ejemplo empleado en esta entrada y más información relacionada en los siguientes enlaces:

[<button>Formulario de ejemplo</button>](https://javguerra.github.io/ejercicios-web-javascript/validacion.html)

## Enlaces

* [API de formularios](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api)
* [Información y ejemplos en W3Schools](https://www.w3schools.com/js/js_validation_api.asp)
* [Información en StackOverflow](https://stackoverflow.com/questions/45789010/how-to-use-html-form-checkvalidity)




