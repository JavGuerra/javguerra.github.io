---
route: clase-scanner-java
title: ConsoleInput kit
description: Una clase en Java para lectura de datos por consola
author: JavGuerra
pubDate: 2023-01-31
coverImage:
  image: '@/assets/img/java-logo.png'
  alt: Logo de Java
tags:
    - Java
    - consola
---
Cuando se emplea la clase Scanner en Java surgen multitud de inconvenientes a la hora de solicitar datos por consola. Algunos errores están asociados a la introducción de tipos de datos no solicitados, pero hay un error especialmente incómodo, el de las pulsaciones de tecla Intro que quedan en el _buffer_ del Scanner. En esta entrada vemos cómo solucionar estos errores y algunos métodos básicos de ejemplo.

# Lo primero: abrir y cerrar

Voy a crear una clase abstracta `ConsoleInput` cuyos métodos puedan ser llamados (previamente importados) desde otras clases donde sean requeridos.

La clase Scanner debe ser instanciada en un objeto que será el que usaré en todos los métodos para obtener datos por consola. Este objeto (`IN`) lo crearé como una propiedad final de la clase, y también crearé un método para poder cerrar el Scanner.

```java
package utilities;  
 
import java.util.Scanner;  
  
public abstract class ConsoleInput {  
  
    private static final Scanner IN = new Scanner(System.in);
 
    public static void closeScanner() {  
        IN.close();  
    }  
}
```

Como se aprecia, dentro de un paquete llamado `utilities` creo la clase `ConsoleInput`, el objeto final `IN` de tipo `Scanner` que debe importarse de `java.util.Scanner` y creo un método que, cuando sea llamado, cerrará el Scanner `IN` con el método `.close()`. 

# Introducir datos por consola

## El problema: .next() vs. .nextLine()

Cuando queremos leer un dato por consola, podemos usar el método `.next()` o `.nextLine()`, siendo `IN` el objeto de la clase Scanner instanciado para leer por teclado.

```java
System.out.println("Introduce una palabra");
String entrada1 = IN.next();
System.out.println(entrada1);

System.out.println("Introduce una frase");
String entrada2 = IN.nextLine();
System.out.println(entrada2);
```

En `entrada1` se guardará el dato introducido hasta encontrar un espacio en blanco.
En `entrada2` se guardará el dato introducido hasta encontrar Intro, incluidos los espacios en blanco.

Pero hay un problema en este código. Tras escribir la palabra que se solicita y pulsar `Intro`, se guarda en `entrada1` la palabra, pero en el _buffer_ del Scanner queda almacenado el `Intro`, y este será leído por `entrada2` y no nos permitirá escribir la frase solicitada.

No ocurre lo mismo si invertimos el orden, es decir, si primero pedimos la frase con `.nexLine()` y después la palabra con `.next()`, ya que `.nextLine()` lee específicamente el Intro tras introducir la frase y este no queda almacenado en el _buffer_, pudiendo entonces introducir la palabra solicitada tras la frase.

La solución pasa por poner siempre un `.nextLine()` tras un `.next()` para evitar problemas, de esta forma:

```java
System.out.println("Introduce una palabra");
String entrada1 = IN.next();
IN.nextLine(); // Lee el intro del buffer
System.out.println(entrada1);

System.out.println("Introduce una frase");
String entrada2 = IN.nextLine();
System.out.println(entrada2);
```

Y ahora sí, la frase podrá ser introducida en `entrada2` y luego mostrada.

Esta solución aplica también a `.nextInt()`, `.nextLong()`, `.nextDouble()` y otros métodos `.next()` de entrada de la clase Scanner.

## Pulse Intro para continuar

La primera aplicación práctica de esto puede ser el método siguiente:

```java
 public static void getEnter() {  
    IN.nextLine();  
}
```

El método `.getEnter()` es útil cuando queremos esperar que el usuario pulse la tecla `Intro` para continuar.

## Obtener un número largo, entero, positivo

Ahora quiero leer un número por consola que sea entero, largo (`long`) y positivo. Emplearé el método `.nextLong()` para obtener el dato, y lo acompañaré de un `.nextLine()` como mostré antes.

```java
num = IN.nextLong();  
IN.nextLine(); 
```

Como puede que el dato introducido no sea un número largo, envolveré estas sentencias con un `try-catch`:

```java
try {  
    num = IN.nextLong();  
    IN.nextLine();  
} catch (InputMismatchException e) {  
    System.out.println("Tipo de dato no reconocido.");  
    IN.nextLine();  
    continue;  
} 
```

La excepción `InputMismatchException` será la encargada de probar (`try`) si el tipo de dato introducido fue erróneo y de esta forma se llevarían a cabo las instrucciones del bloque `catch`.

En el bloque `catch` también se incluye `IN.nextLine()` ya que, cuando salta la excepción,  la línea `IN.nextLine();` debajo del `IN.nextLong()` no llega a ejecutarse.

Si no se incluye esta línea en el `catch` y estamos solicitando el dato por consola desde un bucle, como en el código que se ve a continuación, la aplicación entrará en un bucle infinito que mostrará el mensaje `"Tipo de dato no reconocido."`, ya que con cada nueva petición del dato, leería el `Intro` del _buffer_ no pudiendo introducir el dato solicitado.

Aquí el código completo del método `.getLongIntPos()`:

```java
public static Long getLongIntPos(String message) {  
    long num;  
    while(true) {  
        System.out.print(message);  
        try {  
            num = IN.nextLong();  
            IN.nextLine();  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
            continue;  
        }  
        if (num >= 0) return num;  
        System.out.println("Valor fuera de rango.");  
    }  
}
```

El bucle `while` se asegura de que, hasta que no se introduzca un dato válido, se esté solicitando el dato por consola. La condición de salida es si `num >= 0`, momento en el que la función ejecutará el `return` con el dato `num` obtenido.

Por parámetro recibimos el mensaje que dará versatilidad a esta función, y que será mostrado por consola antes de requerir el dato. Esta función se podrá usar de esta forma desde otra parte de nuestra aplicación:

```java
Long numero = getLongIntPos("Introduce un número entero: ");
System.out.println(numero);
```

## Obtener un número largo, entero, positivo por rango

Dado el método anterior, es fácil hacer cambios para que el valor recibido se encuentre entre un rango determinado.

```java
public static Long getLongIntPosByRange(String message, Long min, Long max) {  
    long num;  
    if (min > max) { num = min; min = max; max = num; }  
    while(true) {  
        System.out.print(message);  
        try {  
            num = IN.nextLong();  
            IN.nextLine();  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
            continue;  
        }  
        if (num >= min && num <= max) return num;  
        System.out.println("Valor fuera de rango.");  
    }  
}
```

El método `.getLongIntPosByRange()` solicita esta vez tres parámetros, el mensaje a mostrar (`message`), el valor del rango mínimo (`min`) y el máximo (`max`).

Para evitar errores y complicar el código, asumo que si el valor máximo es menor que el valor mínimo, es que deben cambiarse, pero esta no sería la mejor forma de hacerlo.

La otra diferencia con `.getLongIntPos()` es que la condición de salida ahora es que el número que recibimos por consola debe estar entre los valores mínimo y máximo indicados (`num >= min && num <= max`).

## Obtener una palabra

El código del método `.getWord()` obtiene una palabra.

```java
public static String getWord(String message) {  
    String str;  
    while(true) {  
        System.out.print(message);  
        try {  
            str = IN.next();  
            IN.nextLine();  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
            continue;  
        }  
        str = str.trim();  
        if (str.length() >= 3) return str;  
        System.out.println("Cadena no válida.");  
    }  
}
```

La diferencia con los métodos anteriores es la condición de salida.

Si la palabra introducida no tiene al menos tres caracteres (`str.length() >= 3`), te la volverá a pedir. A la palabra introducida le limpio los posibles espacios al inicio y final con `.trim()`.

## Obtener una cadena de caracteres

En la línea de los casos anteriores, el código del método `.getString()` obtiene una cadena de caracteres (una frase) sería:

```java
public static String getString(String message) {  
    String str;  
    while(true) {  
        System.out.print(message);  
        try {  
            str = IN.nextLine();  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
            continue;  
        }  
        str = str.trim();
        if (str.length() >= 3) return str;  
        System.out.println("Cadena no válida.");  
    }  
}
```

Aquí no sería necesario poner el `IN.nextLine()` en el bloque `try`, y todo lo demás es muy similar. La diferencia es, una vez más, la condición de salida.

Si la cadena introducida no tiene al menos tres caracteres (`str.length() >= 3`), te la volverá a pedir. A la cadena introducida le limpio los posibles espacios al inicio y final con `.trim()`.

## Obtener un Sí o No

Con el método `getYesNo()` obtengo un `true` para 'sí' o un `false` para 'no'. El código es el siguiente:

```java
public static Boolean getYesNo(String message) {  
    char chr;  
    while(true) {  
        System.out.print(message);  
        try {  
            chr = IN.next(".").trim().charAt(0);  
            IN.nextLine();  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
            continue;  
        }  
        if (chr == 'S' || chr == 's') return true;  
        if (chr == 'N' || chr == 'n') return false;  
        System.out.println("Carácter no válido.");  
    }  
}
```

Lo destacable de este método es la línea:

``` java
chr = IN.next(".").trim().charAt(0); 
```

Que permite que, de los datos introducidos, sólo se almacene un carácter.

En este método vuelve a ser necesario el uso de `IN.nextLine()`.

## Bonus: limpiar la consola

Buscando por Internet, encontré este sencillo código para limpiar la consola:

```java
public static void clearConsole() {  
    System.out.print("\033[H\033[2J");  
    System.out.flush();  
}
```

# La clase ConsoleInput completa

El código es el siguiente (cambia el «package» según te interese):

```java
package utilities;  
  
import java.util.InputMismatchException;  
import java.util.Scanner;  
  
/**
 * Clase para leer datos por consola.
 * @autor JavGuerra
 * @version 1.0
 * @since 2023-01-31
 * @see <a href="https://youtu.be/HSq3rRfBmDg">
 *         Video: Entrada de datos en Java - Clase Scanner.
 *         Mega curso Java desde 0, Aula en la nube.
 *     </a>
 */
public abstract class ConsoleInput {  
  
    /** 
     * Instancia de la clase Scanner.
     */
    private static final Scanner IN = new Scanner(System.in);  
  
    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * un número largo, entero, positivo (>=0).
     * @param message String Pregunta del usuario.
     * @return Long Número introducido.
     * @throws InputMismatchException Si el tipo de dato introducido fue erróneo.
     */
    public static Long getLongIntPos(String message) {  
        long num;  
        while(true) {  
            System.out.print(message);  
            try {  
                num = IN.nextLong();  
                IN.nextLine();  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
                continue;  
            }  
            if (num >= 0) return num;  
            System.out.println("Valor fuera de rango.");  
        }  
    }  
  
    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * un número largo, entero, positivo (>=0), cuyo rango esté entre
     * el valor mínimo y el valor máximo recibido, ambos inclusive.
     * @param message String Pregunta del usuario.
     * @param min Long Valor mínimo.
     * @param max Long Valor máximo.
     * @return Long Número introducido.
     * @throws InputMismatchException Si el tipo de dato introducido fue erróneo.
     */
    public static Long getLongIntPosByRange(String message, Long min, Long max) {  
        long num;  
        if (min > max) { num = min; min = max; max = num; }  
        while(true) {  
            System.out.print(message);  
            try {  
                num = IN.nextLong();  
                IN.nextLine();  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
                continue;  
            }  
            if (num >= min && num <= max) return num;  
            System.out.println("Valor fuera de rango.");  
        }  
    }  

    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * una palabra de, al menos, 3 caracteres.
     * @param message String Pregunta del usuario.
     * @return String Palabra introducida.
     * @throws InputMismatchException Si el tipo de dato introducido fue erróneo.
     */
    public static String getWord(String message) {  
        String str;  
        while(true) {  
            System.out.print(message);  
            try {  
                str = IN.next();  
                IN.nextLine();  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
                continue;  
            }  
            str = str.trim();  
            if (str.length() >= 3) return str;  
            System.out.println("Cadena no válida.");  
        }  
    }

    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * una cadena de texto de, al menos, 3 caracteres.
     * @param message String Pregunta del usuario.
     * @return String Cadena de texto introducida.
     * @throws InputMismatchException Si el tipo de dato introducido fue erróneo.
     */
    public static String getString(String message) {  
        String str;  
        while(true) {  
            System.out.print(message);  
            try {  
                str = IN.nextLine();  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
                continue;  
            }  
            str = str.trim();  
            if (str.length() >= 3) return str;  
            System.out.println("Cadena no válida.");  
        }  
    }  
  
    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * un carácter para confirmar ('S', 's') o ('N', 'n').
     * @param message String Pregunta del usuario.
     * @return Boolean true/Sí o false/No.
     * @throws InputMismatchException Si el tipo de dato introducido fue erróneo.
     */
    public static Boolean getYesNo(String message) {  
        char chr;  
        while(true) {  
            System.out.print(message);  
            try {  
                chr = IN.next(".").trim().charAt(0);  
                IN.nextLine();  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
                continue;  
            }  
            if (chr == 'S' || chr == 's') return true;  
            if (chr == 'N' || chr == 'n') return false;  
            System.out.println("Carácter no válido.");  
        }  
    }  
  
    /**
     * Espera la pulsación de la tecla Intro.
     */
    public static void getEnter() {  
        IN.nextLine();  
    }  
  
    /**
     * Limpia la consola.
     */
    public static void clearConsole() {  
        System.out.print("\033[H\033[2J");  
        System.out.flush();  
    }  
  
    /**
     * Cierra el Scanner.
     */
    public static void closeScanner() {  
        IN.close();  
    }  
}
````

# Enlaces
- [Video: Entrada de datos en Java - Clase Scanner](https://youtu.be/HSq3rRfBmDg) - Mega curso Java desde 0, Aula en la nube  
