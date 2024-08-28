---
route: mastermind
title: Mastermind en PHP
description: Programado en una sola página web, sin usar librerías
author: JavGuerra
pubDate: 2022-08-06
coverImage:
  image: '@/assets/img/mastermind.png'
  alt: Mastermind
tags:
    - web
    - código
    - PHP
    - juego
    - formularios
---
Este juego interactúa con el usuario y pasa parámetros mediante POST a través de un formulario. El reto es hacerlo de tal forma que esos parámetros sean recibidos y procesados en la misma página que los envió, por lo tanto, la página debe contener toda la operativa de los distintos escenarios posibles del juego: al iniciar el juego, tras una tirada, si se producen errores, si se termina el juego... Veamos cómo. 

[<button>Probar el juego</button>](https://badared.com/javguerra/daw/mastermind/)

# El juego

Mastermind es un juego simple. Se trata de adivinar un número de 4 dígitos distintos (no repetidos). Cada dígito tendrá un valor entre 0 y 9. A través de un formulario, introducimos los cuatro dígitos. Al enviar el formulario recibiremos la respuesta de cuantos dígitos hemos acertado, o si hemos acertado el número completo con los dígitos en su orden correcto.

Si un dígito está en su posición correcta dentro del número, se contabilizará como un «muerto». Con cuatro muertos ganamos el juego, es decir, habremos acertado el número.

Si un dígito forma parte del número de cuatro dígitos, pero su posición en él no es la correcta, se contabilizará como un «herido». Esto nos permitirá sospechar que vamos por buen camino, y podremos probar nuevas combinaciones.

Para enviar el formulario debemos completar las casillas con los cuatro dígitos.

Para iniciar otra partida, ya sea a mitad de jugada o tras haber ganado, es suficiente con recargar la página sin enviar el formulario.

# Escenarios

Dado que tenemos un juego en una SPA (_Simple Page Aplication_), la lógica del juego tiene que estar contenida en ella al completo, y mediante condicionales, actuar de una forma u otra según sea el caso. Estos casos son:

1. La primera vez que accedemos a la página del juego.
2. La recepción de datos y comprobaciones tras una tirada.
3. Cuando el juego ha terminado: Se ha averiguado el número.
4. Enviar datos y comprobar si hay errores en el formulario.

Puedes ver el código del juego completo al final de esta entrada.

Veamos cada escenario y su correspondiente código. Obviaré en esta entrada los estilos CSS que son incluidos en el `head` de la página. Pero antes, vamos con el formulario.

## Formulario

El formulario es simple. Emplea una serie de campos ocultos, que veremos después, para pasar la información recabada del formulario (los 4 dígitos) y de las tiradas anteriores en el juego. Su estructura será:

```html
<form name="input" action="<?php echo $_SERVER['PHP_SELF'];?>" method="post">
    // Campos ocultos
    // Campos de formulario (4 input)
    // Comprobaciones de error de cada campo input
    <input type="submit" name="enviar" class="boton" value="Enviar" />
</form>
```
Con `<?php echo $_SERVER['PHP_SELF'];?>` indico la dirección donde debo enviar (mediante POST) el resultado del formulario, en este caso la misma página (`PHP_SELF`), esté en la ruta que esté.

Con `name="enviar"` podré indicar si estoy enviando los datos del formulario. Empleando el botón `submit` tengo esa garantía, ya que es el medio de que dispongo (el botón) para hacer justamente el envío.

## 1. Empezando a jugar

Empiezo averiguando si he recibido algún dato del formulario. Si no es así es que estamos ante la primera tirada.

```php
$enviado = isset($_POST['enviar']);
$muertos = 0;
$mostrarNum = true;

if ($enviado) {
    // Procesar los datos recibidos del formulario
} else {
    // Generar un número al azar de cuatro dígitos no repetidos
    $numero = range(0, 9);
    shuffle($numero);
    $numero = array_slice($numero, 0, 4);
    $numero = implode($numero);
}
```

Con `isset($_POST['enviar'])` obtengo `true` si he recibido datos del formulario (el valor asociado al botón submit) o `false` en caso contrario. La variable `$enviado` contendrá ese valor booleano que determinará que rumbo tomará el programa. `$_POST['enviar']` nos lo dirá si contiene el valor `"Enviar"` recibido del formulario (`value="Enviar"`) o no.

Inicializo la variable `$muertos` que contendrá el número de dígitos acertados en su posición correcta. Al principio será 0, porque aún no hay aciertos. Usaré esta variable como condicional más adelante.

La variable `$mostrarNum` es un _swich_ que me provee de una característica del juego, la de mostrar o no un interrogante en pantalla. Al pasar con el ratón sobre este interrogante puedo comprobar el número que estoy intentando acertar. Esta opción se implementó para hacer comprobaciones durante el desarrollo, pero ha quedado como una característica. Pon la variable en `false` si sientes que vas a tener la tentación de hacer trampas...

Esta ayuda se mostrará en el programa con la siguiente línea:

```php
if ($mostrarNum) echo "<dfn id='numero' title='$numero'>?</dfn>" . "\n\n";
```

Con la comprobación `if ($enviado)`, como decía, discrimino si debo procesar los datos recibidos del formulario o por el contrario debo inicializar el juego. El número de cuatro dígitos a averiguar es lo que necesito en este caso. Para obtenerlo al azar, empleo lo siguiente:

```php
$numero = range(0, 9);
shuffle($numero);
$numero = array_slice($numero, 0, 4);
$numero = implode($numero);
```
En el arreglo `$numero` introduzco los dígitos del 0 al 9 con `range()`, y luego los mezclo (altero su posición en el arreglo) con `shuffle()`. Con `array_slice()` recorto el arreglo para que contenga sólo los cuatro primeros elementos, osea, los cuatro dígitos al azar. Finalmente, con `implode()` concateno esos cuatro elementos en uno, siendo ahora `$numero` una cadena de cuatro caracteres.

Podría haber obtenido un número al azar entre `0` y `9999` con `rand()` o incluso con `mt_rand()`, pero esto conllevaría conversiones de número a cadena, rellenado de `0` a la izquierda si el número obtenido al azar es menor que 1000, y comprobar que cada dígito sea distinto. Esta solución propuesta es más divertida e imaginativa, ¿verdad?

## 2. Recibiendo datos del formulario

Desde el formulario recibimos los siguientes valores:
- El número que estamos intentando averiguar para poder hacer comprobaciones
- Los cuatro dígitos que hemos introducido en el formulario.
- El arreglo con las tiradas que hemos realizado hasta ahora. En la primera tirada no contendrá nada.

Veamos cómo recuperar y procesar los datos recibidos:

```php
if ($enviado) {
    // Recuperar número
    if (isset($_POST['numero'])) $numero = $_POST['numero'];
    // Recuperar dígitos
    if (isset($_POST['d1'])) $d1 = $_POST['d1'];
    if (isset($_POST['d2'])) $d2 = $_POST['d2'];
    if (isset($_POST['d3'])) $d3 = $_POST['d3'];
    if (isset($_POST['d4'])) $d4 = $_POST['d4'];
    // Recuperar $tiradas[]
    if (isset($_POST['tiradas'])) $tiradas = $_POST['tiradas'];

    if (validaEntero($d1) && validaEntero($d2) && validaEntero($d3) && validaEntero($d4)) {

        $numEnviado = $d1 . $d2 . $d3 . $d4;
        
        // Comprobar datos entrantes
        $muertos = numMuertos($numero, $numEnviado);
        $heridos = numHeridos($numero, $numEnviado, $muertos);

        // Añadir tirada
        $tiradas[] = array($numEnviado, $muertos, $heridos);
    }
} else {
    // Generar un número al azar de cuatro dígitos no repetidos
}
```

Si cierta variable está presente, obtengo su valor. Por ejemplo con:

```php
if (isset($_POST['numero'])) $numero = $_POST['numero'];
```
Cuando he recuperado el resto de valores, hago una comprobación básica por cada uno de los 4 dígitos recibidos con la función `validaEntero()`. Esta función hace lo siguiente:

```php
// Validar un número entero entre 0 y 9, ambos inclusive
function validaEntero($numero) {
    return isset($numero) && ctype_digit($numero) && $numero <= 9 && $numero >= 0;
}
```
Devuelve `true` o `false` si el dígito que le pasamos es un número entre 0 y 9 o no.

De esta forma, podemos usarlo para tratar y obtener el número enviado:

```php
    if (validaEntero($d1) && validaEntero($d2) && validaEntero($d3) && validaEntero($d4)) {
        $numEnviado = $d1 . $d2 . $d3 . $d4;
        // Comprobar datos entrantes
        // Añadir tirada
    }
```

Si los cuatro dígitos validan, en la cadena `$numEnviado` guardo el número de cuatro dígitos que estoy probando en esta jugada.

Compruebo a continuación el total de muertos y heridos a partir de ese dato.

```php
// Comprobar datos entrantes
$muertos = numMuertos($numero, $numEnviado);
$heridos = numHeridos($numero, $numEnviado, $muertos);
```
Las funciones `numMuertos()` y `numHeridos()` calcularán los aciertos:

```php
// Calcular el número de muertos
function numMuertos($numero, $numEnviado) {
    $contador = 0;
    $l = strlen($numero);
    for($i = 0; $i < $l; $i++) {
        if (substr($numero, $i, 1) == substr($numEnviado, $i, 1)) $contador++;
    }
    return $contador;
}        

// Calcular el número de heridos
function numHeridos($numero, $numEnviado, $muertos) {
    $contador = 0;
    $l = strlen($numero);
    for($i = 0; $i < $l; $i++) {
        if (strpos($numEnviado, substr($numero, $i, 1)) !== false) $contador++;
    }
    return $contador - $muertos;
}
```
La función `numMuertos()` comparará los valores de cada posición de los caracteres de cada una de las dos cadenas, el número que intentamos averiguar y el numero que hemos enviado por el formulario. Con cada coincidencia,el `$contador` se incrementa en 1. La función devuelve el número de coincidencias exactas, osea, el número de muertos. 

La función `numHeridos()` por otra parte, recorre los caracteres del número que hemos enviado y comprueba si están contenido en el número que debemos acertar. Si es así el `$contador` se incrementa en 1. La función devuelve la diferencia entre el número de heridos y el número de muertos, ya que los aciertos en esta función no discriminan si los valores coincidentes están en su posición correcta o no, y los contabiliza como heridos, cuando puede que realmente estos valores sean muertos, y estos ya estaban contabilizados en la variable `$muertos`.

Cuando tenemos los datos, ya podemos añadir el resultado a la lista de tiradas:

```php
// Añadir tirada
$tiradas[] = array($numEnviado, $muertos, $heridos);
```
El arreglo `$tiradas[]` contendrá un arreglo por cada tirada que almacenará el número que enviamos, el numero de muertos y el número de heridos obtenido.

## 3. ¿El juego terminó?

Pero ¿habremos acertado el número? Vamos a comprobarlo.

```php
if ($enviado && $muertos == 4) { 
    // Partida finalizada
    echo "\t\t<br />\n\t\t<h3>¡¡¡Enhorabuena!!! Has acertado el número " . $numero . " en " . count($tiradas) . " jugadas.</h3>\n";
} else {
    // Seguir jugando
    if (isset($tiradas)) {
    foreach ($tiradas as $indice => $valor) {
        echo "\t\t" . "<p>" . ($indice + 1) . ". Con el número introducido: " . $valor[0] . ", tienes " . $valor[1] . " muertos y " . $valor[2]. " heridos.</p>" . "\n";
        }
    }

// Formulario

}
```
Si tengo cuatro muertos, ¡he ganado!. habré acertado el número en una serie de intentos que muestro con `count($tiradas)`. En caso contrario, sigo jugando.

Si hay tiradas `if (isset($tiradas))` muestro los datos de cada una de ellas con un `foreach`: número introducido, muertos y heridos de cada tirada, y a continuación muestro el formulario para seguir intentándolo.

## 4. El formulario completo y sus comprobaciones

Aquí el código que iré desgranado y que va dentro de la comprobación anterior, en el `else`, en caso de que no acertara el número:

```html
<h3>Introduce tu número:</h3>
<form name="input" action="<?php echo $_SERVER['PHP_SELF'];?>" method="post">

    <!-- Campos ocultos -->
    <?php
        echo '<input type="hidden" name="numero" value="' . $numero . '" />' . "\n";

        if ($enviado && !empty($tiradas)) {
            foreach ($tiradas as $indice => $valor){
                echo "\n\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][0]" value="' . $valor[0] . '" />' . "\n";
                echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][1]" value="' . $valor[1] . '" />' . "\n";
                echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][2]" value="' . $valor[2] . '" />' . "\n";
        }}
    ?>

    <!-- Dígito 1 -->
    <input type="number" name="d1" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d1)) echo $d1; ?>" required="required" />
    <?php if ($enviado && !validaEntero($d1)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

    <!-- Dígito 2 -->
    <input type="number" name="d2" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d2)) echo $d2; ?>" required="required" />
    <?php if ($enviado && !validaEntero($d2)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

    <!-- Dígito 3 -->
    <input type="number" name="d3" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d3)) echo $d3; ?>" required="required" />
    <?php if ($enviado && !validaEntero($d3)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

    <!-- Dígito 4 -->
    <input type="number" name="d4" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d4)) echo $d4; ?>" required="required" />
    <?php if ($enviado && !validaEntero($d4)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

    <!-- Enviar -->
    &nbsp;&nbsp;<input type="submit" name="enviar" class="boton" value="Enviar" />
</form>
```

Ya expliqué, más arriba, los parámetros de `form` y el envío del formulario. Entendido esto, el formulario tiene tres cuestiones de interés.

1. Preparar los datos que se enviarán en el formulario, incluyendo los que llegaron a través del anterior formulario.
2. Recibir los datos en los cuatro campos `input` para ser enviados. En cada campo deberá estar el valor de cada dígito recibido del formulario anterior. Las características de HTML se ocupan de que los valores introducidos estén en rango antes de enviarse, pero aún así podemos recibir datos alterados por `POST`, luego:
3. Comprobar que los datos recibidos sean los correctos, y si no, reseñar el error.

### 4.1. Campos ocultos

En esta parte del formulario, completo los distintos campos ocultos con información necesaria para la siguiente tirada: el número a acertar, y cada uno de los arreglos de cada tirada anterior, conteniendo el número que enviamos en la tirada, el número de muertos y el número de heridos.

```php
<!-- Campos ocultos -->
<?php
    echo '<input type="hidden" name="numero" value="' . $numero . '" />' . "\n";

    if ($enviado && !empty($tiradas)) {
        foreach ($tiradas as $indice => $valor){
            echo "\n\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][0]" value="' . $valor[0] . '" />' . "\n";
            echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][1]" value="' . $valor[1] . '" />' . "\n";
            echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][2]" value="' . $valor[2] . '" />' . "\n";
    }}
?>
```
Véase que cada tirada debe incluirse con sus correspondientes valores como `input`  ocultos por separado en el cuerpo de la página, ya que no podemos pasar un arreglo como valor de un campo de un formulario. Afortunadamente, sí podemos recibir estas tiradas como un arreglo para tratarlas. Recuerda, como vimos antes:

```php
// Recuperar $tiradas[]
if (isset($_POST['tiradas'])) $tiradas = $_POST['tiradas'];
```

### 4.2. Recibir los datos de los input

El código para los cuatro campos `input` es el siguiente:

```html
<!-- Dígito 1 -->
<input type="number" name="d1" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d1)) echo $d1; ?>" required="required" />
<?php if ($enviado && !validaEntero($d1)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

<!-- Dígito 2 -->
<input type="number" name="d2" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d2)) echo $d2; ?>" required="required" />
<?php if ($enviado && !validaEntero($d2)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

<!-- Dígito 3 -->
<input type="number" name="d3" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d3)) echo $d3; ?>" required="required" />
<?php if ($enviado && !validaEntero($d3)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

<!-- Dígito 4 -->
<input type="number" name="d4" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d4)) echo $d4; ?>" required="required" />
<?php if ($enviado && !validaEntero($d4)) echo '<span class="alerta"> &larr;</span>'."\n" ?>
```

Mediante este código, repetido en cada `input` (convenientemente modificado), muestro el valor de cada dígito recibido de la jugada anterior, si esta se produjo. Sino no muestro nada.

```html
value="<?php if ($enviado && validaEntero($d1)) echo $d1; ?>"
```
### 4.3. Si hay error en los datos recibidos, resaltarlo

Para asegurarnos que los dígitos que recibimos del formulario anterior son correctos, es necesario comprobarlos de nuevo del lado del servidor (ahora con PHP), aunque ya lo hiciéramos con las funcionalidades de HTML. Esto garantiza que los datos no fueron alterados en el envío mediante, tal vez, una modificación de la fuente HTML a través de las herramientas del navegador.

```php
if ($enviado && !validaEntero($d1)) echo '<span class="alerta"> &larr;</span>'."\n";
```
Con este código tras cada campo, señalaremos aquellos campos `input` que contengan un error, en este caso añadiendo una flecha (&larr;) y pintándola de color rojo con la clase CSS `alerta`.

Completado el formulario, con sus campos ocultos y los datos de todos los input, -que son campos obligatorios y tienen rangos numéricos definidos-, ya podemos enviarlo (botón `sent`) a la misma página para ser procesados tal como se indicó en el **punto 2** de esta entrada, y así hasta acertar el número o hasta que recarguemos la página, caso en el que empezaremos de cero, en el **punto 1** de esta entrada.

# El programa completo

El HTML con el código PHP completo es el siguiente:

```html
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <title>Mastermind</title>
    <meta name="description" content="Mastermind" />
    <meta name="keywords" content="DWES, DAW, Juego, Tarea 2" />
    <meta name="author" content="Javier Guerra" />
    <meta name="license" content="CC-BY" />
    <meta name="date" content="2019-01-31" scheme="YYYY-MM-DD" />
    <style>
        html,body{padding:0;margin:0;width:100%;height:100%;font-family:sans-serif;font-weight:300;background-color:#efeffb}.contenedor{margin:25px auto;padding:10px 20px 20px;width:100%;max-width:100%;border-radius:10px;background-color:#FFF;-webkit-box-shadow:5px 5px 5px 0 rgba(0,0,0,0.10);-moz-box-shadow:5px 5px 5px 0 rgba(0,0,0,0.10);box-shadow:5px 5px 5px 0 rgba(0,0,0,0.10)}@media(min-width:1023px){.contenedor{padding:20px 30px 30px;width:67%}}@media(min-width:1215px){.contenedor{padding:30px 40px 40px;width:50%}}#numero{display:block;text-align:right;height:0}h1,h2{margin-top:0;margin-bottom:5px;color:#1883ba}h3{margin-top:10px;margin-bottom:0;color:#1883ba}p{margin-top:5px;margin-bottom:5px}hr{border:0;margin:0;height:1px;background-image:linear-gradient(to right,rgba(0,0,0,0.50),rgba(0,0,0,0))}.campo,.boton{margin-top:5px;padding:5px;font-weight:600;font-size:16px;border-radius:5px;border:2px solid #1883ba;color:#1883ba}.campo{width:64px}.boton{width:128px;text-decoration:none;color:#fff;background-color:#1883ba}.boton:hover{color:#1883ba;background-color:#efeffb}#autor{display:block;text-align:center;font-size:small;margin-bottom:25px}.alerta{color:red}
    </style>
</head>

<body>
    <div class="contenedor">

        <?php
        
        $enviado = isset($_POST['enviar']);
        $muertos = 0;
        $mostrarNum = true;
        
        // Calcular el número de muertos
        function numMuertos($numero, $numEnviado) {
            $contador = 0;
            $l = strlen($numero);
            for($i = 0; $i < $l; $i++) {
                if (substr($numero, $i, 1) == substr($numEnviado, $i, 1)) $contador++;
            }
            return $contador;
        }        
        
        // Calcular el número de heridos
        function numHeridos($numero, $numEnviado, $muertos) {
            $contador = 0;
            $l = strlen($numero);
            for($i = 0; $i < $l; $i++) {
                if (strpos($numEnviado, substr($numero, $i, 1)) !== false) $contador++;
            }
            return $contador - $muertos;
        }
        
        // Validar un número entero entre 0 y 9, ambos inclusive
        function validaEntero($numero) {
            return isset($numero) && ctype_digit($numero) && $numero <= 9 && $numero >= 0;
        }

         
        if ($enviado) {

            // Recuperar número
            if (isset($_POST['numero'])) $numero = $_POST['numero'];
            // Recuperar dígitos
            if (isset($_POST['d1'])) $d1 = $_POST['d1'];
            if (isset($_POST['d2'])) $d2 = $_POST['d2'];
            if (isset($_POST['d3'])) $d3 = $_POST['d3'];
            if (isset($_POST['d4'])) $d4 = $_POST['d4'];
            // Recuperar $tiradas[]
            if (isset($_POST['tiradas'])) $tiradas = $_POST['tiradas'];

            if (validaEntero($d1) && validaEntero($d2) && validaEntero($d3) && validaEntero($d4)) {

                $numEnviado = $d1 . $d2 . $d3 . $d4;
                
                // Comprobar datos entrantes
                $muertos = numMuertos($numero, $numEnviado);
                $heridos = numHeridos($numero, $numEnviado, $muertos);

                // Añadir tirada
                $tiradas[] = array($numEnviado, $muertos, $heridos);
            }

        } else {

            // Generar un número al azar de cuatro dígitos no repetidos
            $numero = range(0, 9);
            shuffle($numero);
            $numero = array_slice($numero, 0, 4);
            $numero = implode($numero);

        }
        

        if ($mostrarNum) echo "<dfn id='numero' title='$numero'>?</dfn>" . "\n\n";
        echo "\t\t" . "<!-- Encabezado -->\n";
        echo <<< CADENA
        <h1><svg width=24 height=24>
        <circle cx=6 cy=6 r=6 fill="red" />
        <circle cx=18 cy=6 r=6 fill="yellow" />
        <circle cx=6 cy=18 r=6 fill="yellow" />
        <circle cx=18 cy=18 r=6 fill="lawngreen" />
        </svg> Mastermind</h1>
        <h2>El juego de los muertos y heridos</h2>\n
         <!-- Jugadas -->
        <br />
        <hr />\n
CADENA;
        
        if ($enviado && $muertos == 4) { 
            
            // Partida finalizada
            echo "\t\t<br />\n\t\t<h3>¡¡¡Enhorabuena!!! Has acertado el número " . $numero . " en " . count($tiradas) . " jugadas.</h3>\n";

        } else {

        // Seguir jugando

        if (isset($tiradas)) {
        foreach ($tiradas as $indice => $valor) {
            echo "\t\t" . "<p>" . ($indice + 1) . ". Con el número introducido: " . $valor[0] . ", tienes " . $valor[1] . " muertos y " . $valor[2]. " heridos.</p>" . "\n";
            }
        }

        echo "\t\t<hr />\n\t\t<br />\n"
        ?>

        <!-- Formulario -->
        <h3>Introduce tu número:</h3>
        <form name="input" action="<?php echo $_SERVER['PHP_SELF'];?>" method="post">

            <!-- Campos ocultos -->
            <?php
                echo '<input type="hidden" name="numero" value="' . $numero . '" />' . "\n";

                if ($enviado && !empty($tiradas)) {
                    foreach ($tiradas as $indice => $valor){
                        echo "\n\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][0]" value="' . $valor[0] . '" />' . "\n";
                        echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][1]" value="' . $valor[1] . '" />' . "\n";
                        echo "\t\t\t" .'<input type="hidden" name="tiradas[' . $indice . '][2]" value="' . $valor[2] . '" />' . "\n";
                }}
            ?>

            <!-- Dígito 1 -->
            <input type="number" name="d1" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d1)) echo $d1; ?>" required="required" />
            <?php if ($enviado && !validaEntero($d1)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

            <!-- Dígito 2 -->
            <input type="number" name="d2" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d2)) echo $d2; ?>" required="required" />
            <?php if ($enviado && !validaEntero($d2)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

            <!-- Dígito 3 -->
            <input type="number" name="d3" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d3)) echo $d3; ?>" required="required" />
            <?php if ($enviado && !validaEntero($d3)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

            <!-- Dígito 4 -->
            <input type="number" name="d4" class="campo" min="0" max="9" value="<?php if ($enviado && validaEntero($d4)) echo $d4; ?>" required="required" />
            <?php if ($enviado && !validaEntero($d4)) echo '<span class="alerta"> &larr;</span>'."\n" ?>

            <!-- Enviar -->
            &nbsp;&nbsp;<input type="submit" name="enviar" class="boton" value="Enviar" />

        </form>

        <?php } ?>

    </div>
    <span id="autor">2019 (CC-BY) Javier Guerra</span>
</body>

</html>
```

# Enlaces

[<button>Probar el juego</button>](https://badared.com/javguerra/daw/mastermind/)