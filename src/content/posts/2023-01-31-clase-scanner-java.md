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
    - código
---
Cuando se emplea la clase Scanner en Java surgen multitud de inconvenientes a la hora de solicitar datos por consola. Algunos errores están asociados a la introducción de tipos de datos no solicitados, pero hay un problema especialmente incómodo, el de las pulsaciones de tecla Intro que quedan en el _buffer_ del Scanner. En esta entrada muestro cómo solucionar esto con algunos métodos básicos de ejemplo.

# Lo primero: abrir y cerrar

Voy a crear una clase `ConsoleInput`. Esta clase puede ser instanciada dónde la necesitemos o podemos usar directamente sus métodos estáticos para obtener datos por consola.

Para poder leer por consola necesitaré usar la clase `Scanner` que voy a instanciar dentro de mi clase `ConsoleInput`, y también crearé un método para poder cerrar el Scanner.

```java
public final class ConsoleInput {

    ...

    private static Scanner IN = new Scanner(System.in);

    public static void closeScanner() {
        if (IN != null && !IN.isClosed()) {
            IN.close();
        }
    }

    private static void ensureScannerOpen() {
        if (IN == null || IN.isClosed()) {
            IN = new Scanner(System.in);
        }
    }

    public static void resetScanner() {
        closeScanner();
        IN = new Scanner(System.in);
    }

    ...
}
```

Como se aprecia, dentro de un paquete llamado `utilities` creo la clase `ConsoleInput`, el objeto final `IN` de tipo `Scanner` que debe importarse de `java.util.Scanner` y creo un método que, cuando sea llamado, cerrará el Scanner `IN` con el método `.close()`.

También he añadido dos métodos más relacionados con cerrar el scanner: `ensureScannerOpen()` para cerciorarme de que el scanner esté abierto y `resetScanner()` para cerrarlo y abrir uno nuevo si fuera necesario en nuestra aplicación.

El método `ensureScannerOpen()` se incluye en cada método que espera datos por consola para evitar problemas si el scanner no está abierto. Si no lo está, lo abre de forma transparente al usuario.

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
    ...  
} catch (InputMismatchException e) {  
    System.out.println("Tipo de dato no reconocido.");  
    IN.nextLine();  
} 
```

La excepción `InputMismatchException` será la encargada de probar (`try`) si el tipo de dato introducido fue erróneo y de esta forma se llevarían a cabo las instrucciones del bloque `catch`.

En el bloque `catch` también se incluye `IN.nextLine()` ya que, cuando salta la excepción,  la línea `IN.nextLine();` debajo del `IN.nextLong()` no llega a ejecutarse.

Si no se incluye esta línea en el `catch` y estamos solicitando el dato por consola desde un bucle, como en el código que se ve a continuación, la aplicación entrará en un bucle infinito que mostrará el mensaje `"Tipo de dato no reconocido."`, ya que con cada nueva petición del dato, leería el `Intro` del _buffer_ no pudiendo introducir el dato solicitado.

Aquí el código completo del método `.getLongIntPos()`:

```java
public static Long getLongIntPos(String message) {
    ensureScannerOpen(); 
    while(true) {
        System.out.print(message);
        try {
            long num = IN.nextLong();
            IN.nextLine();
            if (num >= 0) return num;
            System.out.println("Valor fuera de rango.");
        } catch (InputMismatchException e) {
            System.out.println("Tipo de dato no reconocido. Ingrese un número entero.");
            IN.nextLine();
        }
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
    ensureScannerOpen();   
    if (min > max) {
        Long temp = min;
        min = max;
        max = temp;
    }  
    while(true) {  
        System.out.print(message);  
        try {  
            long num = IN.nextLong();  
            IN.nextLine();
            if (num >= min && num <= max) return num;  
            System.out.println("Valor fuera de rango.");  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
        }  
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
    ensureScannerOpen(); 
    while(true) {  
        System.out.print(message);  
        try {  
            String str = IN.next();  
            IN.nextLine();  
            str = str.trim();  
            if (str.length() >= 3) return str;  
            System.out.println("Cadena no válida.");  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
        }  
    }  
}
```

La diferencia con los métodos anteriores es la condición de salida.

Si la palabra introducida no tiene al menos tres caracteres (`str.length() >= 3`), te la volverá a pedir. A la palabra introducida le limpio los posibles espacios al inicio y final con `.trim()`.

## Obtener una cadena de caracteres

En la línea de los casos anteriores, el código del método `.getString()` obtiene una cadena de caracteres (una frase) sería:

```java
public static String getString(String message) {  
    ensureScannerOpen(); 
    while(true) {  
        System.out.print(message);  
        try {  
            String str = IN.nextLine();  
            str = str.trim();
            if (str.length() >= 3) return str;  
            System.out.println("Cadena no válida.");  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();  
        }  
    }  
}
```

Aquí no sería necesario poner el `IN.nextLine()` en el bloque `try`, y todo lo demás es muy similar. La diferencia es, una vez más, la condición de salida.

Si la cadena introducida no tiene al menos tres caracteres (`str.length() >= 3`), te la volverá a pedir. A la cadena introducida le limpio los posibles espacios al inicio y final con `.trim()`.

## Obtener un Sí o No

Con el método `getYesNo()` obtengo un `true` para 'sí' o un `false` para 'no'. El código es el siguiente:

```java
public static Boolean getYesNo(String message) {  
    ensureScannerOpen(); 
    while(true) {  
        System.out.print(message);  
        try {  
            char chr = IN.next(".").trim().charAt(0);  
            IN.nextLine();  
            if (chr == 'S' || chr == 's') return true;  
            if (chr == 'N' || chr == 'n') return false;  
            System.out.println("Carácter no válido.");  
        } catch (InputMismatchException e) {  
            System.out.println("Tipo de dato no reconocido.");  
            IN.nextLine();   
        }  
    }  
}
```

Lo destacable de este método es la línea:

``` java
chr = IN.next(".").trim().charAt(0); 
```

Que permite que, de los datos introducidos, sólo se almacene un carácter.

En este método vuelve a ser necesario el uso de `IN.nextLine()`.

En muy raras ocasiones, si un usuario presiona `Ctrl+D` (EOF) en lugar de escribir algo o si se produce corrupción del stream de entrada, se puede recibir un `null` en `chr`. Por si acaso, para hacer la clase más robusta, podemos hacer una comprobación para evitarlo:

```java
    String input = IN.next(".");  // ← SEPARADO
    IN.nextLine();  
    
    if (input == null || input.trim().isEmpty()) {  // ← PROTECCIÓN
        System.out.println("Entrada vacía no válida.");
        continue;
    }
    
    char chr = input.trim().charAt(0);
```

## Bonus: limpiar la consola

Buscando por Internet, encontré este sencillo código para limpiar la consola:

```java
public static void clearConsole() {
    for (int i = 0; i < 50; i++) {
        System.out.println();
    }
}
```
Realmente `clearConsole()` no limpia la consola. Sólo empuja las líneas hacia arriba. Concretamente, 50 líneas hacia arriba. Esto permite que este simple método funcione en cualquier IDE o sistema operativo, y a efectos prácticos, despeja la consola, que es lo que se persigue.

# La clase ConsoleInput completa

El código es el siguiente (cambia el «package» según te interese):

```java
package utilities;  
  
import java.util.InputMismatchException;  
import java.util.Scanner;  
  
/**
 * Clase para leer datos por consola.
 * @author JavGuerra
 * @version 1.1 - 2026-02-13
 * @since 2023-01-31
 * @requires Java 5.0 (1.5) or higher
 * @see <a href="https://javguerra.github.io/blog/clase-scanner-java/">
 *         «ConsoleInput kit» Descripción en el blog del autor.
 *     </a>
 * @see <a href="https://youtu.be/HSq3rRfBmDg">
 *         Video: Entrada de datos en Java - Clase Scanner.
 *         Mega curso Java desde 0, Aula en la nube.
 *     </a>
 */
public final class ConsoleInput {

    /**
     * Constructor privado que evita la instanciación de la clase. 
     */
    private ConsoleInput() {
        throw new AssertionError("No se puede instanciar ConsoleInput");
    }
  
    /** 
     * Instancia de la clase Scanner.
     */
    private static Scanner IN = new Scanner(System.in);  

    /**
     * Cierra el Scanner.
     */
    public static void closeScanner() {
        if (IN != null && !IN.isClosed()) {
            IN.close();
        }
    }

    /**
     * Verifica que el Scanner esté abierto y funcionando.
     * Si está cerrado, lo reabre automáticamente.
     */
    private static void ensureScannerOpen() {
        if (IN == null || IN.isClosed()) {
            IN = new Scanner(System.in);
        }
    }

    /**
     * Reinicia el Scanner (cierra y abre uno nuevo).
     */
    public static void resetScanner() {
        closeScanner();
        IN = new Scanner(System.in);
    }

    /**
     * Espera la pulsación de la tecla Intro.
     */
    public static void getEnter() { 
        ensureScannerOpen(); 
        IN.nextLine();  
    }  
  
    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * un número largo, entero, positivo (>=0).
     * @param message String Pregunta del usuario.
     * @return Long Número introducido.
     */
    public static Long getLongIntPos(String message) {
        ensureScannerOpen();  
        while(true) {  
            System.out.print(message);  
            try {  
                long num = IN.nextLong();  
                IN.nextLine();  
                if (num >= 0) return num;  
                System.out.println("Valor fuera de rango.");  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();    
            }  
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
     */
    public static Long getLongIntPosByRange(String message, Long min, Long max) {
        ensureScannerOpen();  
        if (min > max) {
            Long temp = min;
            min = max;
            max = temp;
        } 
        while(true) {  
            System.out.print(message);  
            try {  
                long num = IN.nextLong();  
                IN.nextLine();  
                if (num >= min && num <= max) return num;  
                System.out.println("Valor fuera de rango.");  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();  
            }  
        }  
    }  

    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * una palabra de, al menos, 3 caracteres.
     * @param message String Pregunta del usuario.
     * @return String Palabra introducida.
     */
    public static String getWord(String message) { 
        ensureScannerOpen(); 
        while(true) {  
            System.out.print(message);  
            try {  
                String str = IN.next();  
                IN.nextLine();  
                str = str.trim();  
                if (str.length() >= 3) return str;  
                System.out.println("Cadena no válida."); 
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();   
            }   
        }  
    }

    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * una cadena de texto de, al menos, 3 caracteres.
     * @param message String Pregunta del usuario.
     * @return String Cadena de texto introducida.
     */
    public static String getString(String message) {
        ensureScannerOpen();  
        while(true) {  
            System.out.print(message);  
            try {  
                String str = IN.nextLine();  
                str = str.trim();  
                if (str.length() >= 3) return str;  
                System.out.println("Cadena no válida.");  
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();   
            }  
        }  
    }  
  
    /**
     * Solicita con un mensaje por consola, y comprueba que se introduzca,
     * un carácter para confirmar ('S', 's') o ('N', 'n').
     * @param message String Pregunta del usuario.
     * @return Boolean true/Sí o false/No.
     */
    public static Boolean getYesNo(String message) {
        ensureScannerOpen();  
        while(true) {  
            System.out.print(message);  
            try {  
                String input = IN.next(".");
                if (input == null || input.trim().isEmpty()) {
                    System.out.println("Entrada vacía no válida.");
                    continue;
                }
                IN.nextLine();  
                char chr = input.trim().charAt(0); 
                if (chr == 'S' || chr == 's') return true;  
                if (chr == 'N' || chr == 'n') return false;  
                System.out.println("Carácter no válido."); 
            } catch (InputMismatchException e) {  
                System.out.println("Tipo de dato no reconocido.");  
                IN.nextLine();   
            }   
        }  
    }  
  
    /**
     * Limpia la consola (desplaza el contenido hacia arriba).
     * Funciona en TODOS los sistemas e IDEs.
     */
    public static void clearConsole() {
        for (int i = 0; i < 50; i++) {
            System.out.println();
        }
    } 
  
}
````

Esta clase puede crecer con nuevos métodos para otros tipos numericos como int o double... que tú mismo puedes hacer.

# Puntos fuertes de esta clase

- No instanciable - Constructor privado + final class.
- Auto-reparable - Scanner se reabre solo.
- Robusta - Maneja entradas incorrectas sin caer.
- Null-safe - `getYesNo()` protegido.
- Consistente - Todos los métodos usan `ensureScannerOpen()`.
- Compatible - Funciona desde Java 1.5.
- Documentada - JavaDoc completo.

# Enlaces
- [Video: Entrada de datos en Java - Clase Scanner](https://youtu.be/HSq3rRfBmDg) - Mega curso Java desde 0, Aula en la nube  
