---
route: notificaciones-thymeleaft
title: Notificaciones con Thymeleaft
description: Cómo incluir avisos en Spring Boot.
author: JavGuerra
pubDate: 2024-07-03
coverImage:
  image: '@/assets/img/notificaciones.jpg'
  alt: Notificaciones
tags:
    - código
    - Java
    - Spring Boot
    - Bootstrap
    - Thymeleaft
---

Cuando una aplicación realiza operaciones potencialmente críticas como editar, guardar o borrar datos de una base de datos, es conveniente notificar al usuario el éxito o fracaso de las operaciones. Esta entrada presenta una solución básica de cómo mostrar notificaciones en la plantilla Thymeleaft.

Se asume que el lector tiene conocimientos generales de Spring Boot, Thymeleaft y Bootstrap para aplicar el contenido.

# Planteamiento

La idea es destinar una área de la visualización en la aplicación para las notificaciones, y activar este área sólo cuando se deban mostrar, dando opción al usuario a cerrarlas una vez leídas. Este área puede crearse como un fragmento (th:fragment) e incluirse en las plantillas en las que se requiera, o en todas las plantillas asociadas a las vistas de la aplicación.

Será necesaria una variable que sirva de «llave» para mostrar estas notificaciones o no, y otra para indicar el tipo de mensaje (*info*, *danger*...). Como enviar el mensaje desde cada método de erutado de nuestros controladores es algo trabajoso, lo adecuado es usar un filtro de sesión http que me permitirá crear las variables donde guardaré el contenido del mensaje y el tipo de mensaje a mostrar.

Por último, gestionaré el borrado del contenido de la notificación para que esta deje de mostrarse al cambiar de página Para ello necesitaremos otra variable que indique si la notificación ya se ha mostrado. 

# Programando notificaciones

Para crear las notificaciones, necesitaremos:

1. Crear un fragmento que servirá para incluir el texto de la notificación en nuestras vistas.
2. Inicializar las variables de sesión que contendrán la notificación y el tipo de notificación.
3. Actualizar el valor de las variables de notificación para que estas se muestren.
4. Eliminar la notificación al cambiar de página.

## El fragmento

He creado un fragmento de código llamado `messageAlert.html` que he incluido en mi carpeta `fragments` dentro de templates en resources. Este es un ejemplo que puede modificarse a voluntad para adaptar su diseño a la aplicación donde se usará.

```html
<div th:fragment="messageAlert" th:if="${session.message != ''}" class="container">

    <div class="alert alert-dismissible fade show" role="alert"
        th:classappend="${session.messageType} == 'danger'? 'alert-danger' : 'alert-info'">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
        </svg>&nbsp;&nbsp;

        <span class="align-middle" th:text="${session.message}"></span>

        <button class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
</div>
```

Con `th:if="${session.message != ''}"`determino si este fragmento se mostrará o no. Si el valor de la variable de sesión llamada `message` está vacío, es que no hay nada que mostrar, de otra forma, el fragmento se mostrará.

Con `th:classappend="${session.messageType} == 'danger'? 'alert-danger' : 'alert-info'"` determino qué tipo de alerta de Boostrap mostrar, si una destinada a informar (recuadro con fondo azul) o una destinada a alertar de un fallo (recuadro con fondo rojo). Esto lo consigo mediante la variable de sesión `messageType`.

Tras el icono SVG que se mostrará en el aviso, se incluye el mensaje de la notificación con `th:text="${session.message}"` dentro de la etiqueta `span`.

Con el `button`, ayudado por Bootstrap, el usuario puede cerrar la notificación.

Para incluir este fragmento en la vista donde deseo que se muestre la notificación, uso:

```html
<div th:replace="~{fragments/messageAlert :: messageAlert}"></div>
```

## Inicializando las variables message y messageType

Como he comentado, voy a usar variables de sesión http para guardar el contenido del mensaje y el tipo de mensaje. Para ello creo un filtro de sesión que compruebe, por cada petición http, si existe una sesión y si las variables de sesión están creadas.

He incluido el siguiente componente en `/Utils/SessionFilter.java`:

```java
@Component
public class SessionFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(true);

        if (session!= null) {

            // Variables para las notificaciones

            if (session.getAttribute("message") == null)
                session.setAttribute("message", "");

            if (session.getAttribute("messageType") == null)
                session.setAttribute("messageType", ""); 
                // Valores: "danger" u otro cualquiera = "info".

        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
```

Con `HttpSession session = httpRequest.getSession(true);` Obtengo la sesión, y si no existe, se creará una nueva. Esto ocurre porque he incluido el valor `true` en `.getSession(true)`.

Si existe la sesión (que, salvo error, ya debería existir), compruebo que las variables `message` y `messageType` estén inicializadas, y si no lo están las inicializo a `""`.

Tras esto, ya podremos usar `session.getAttribute()` y `session.setAttribute()` para leer y para actualizar el valor de las variables de sesión desde nuestros servicios o controladores, como veremos.

## Usando mensajes

Pensemos en un servicio que guarde el contenido de un formulario para crear un cine. Sería algo similar a esto:

``` java
@Slf4j
@RequiredArgsConstructor
@Service
public class CinemaServiceImpl implements ICinemaService {

    private final CinemaRepository cinemaRepo;

    // Otras propiedades y métodos de la clase aquí

    @Override
    @Transactional
    public Cinema save(Cinema cinema) {
        log.info("save {}", cinema);

        try {
            return cinemaRepo.save(cinema);

        } catch (Exception e) {
            log.error("Error al guardar el cine: ", e);

            return null;
        }
    }
}
```

Como se ve, la clase `CinemaServiceImpl` implementa la interfaz `ICinemaService`, inyecta el repositorio `CinemaRepository` y tiene un método que guarda un cine. `cinema` es enviado al método `save` desde el controlador que lo usa, y el método devuelve el cine guardado o null si se produjo un error.  

A continuación muestro cómo se verá el método al incluir los mensajes de éxito o error:

``` java
@Slf4j
@RequiredArgsConstructor
@Service
public class CinemaServiceImpl implements ICinemaService {

    private final HttpSession session;
    private final CinemaRepository cinemaRepo;

    // Otras propiedades y métodos de la clase aquí

    @Override
    @Transactional
    public Cinema save(Cinema cinema) {
        log.info("save {}", cinema);

        try {
            Cinema newCinema = cinemaRepo.save(cinema);

            String message = "Cine " + newCinema + " guardado.";

            session.setAttribute("message", message);
            session.setAttribute("messageType", "info");

            return newCinema;

        } catch (Exception e) {
            log.error("Error al guardar el cine: ", e);

            session.setAttribute("message", "El cine no ha podido guardarse.");
            session.setAttribute("messageType", "danger");

            return null;
        }
    }
}
```

Con `session.setAttribute("message", message);` se cambia el valor de la variable `message`, y con `session.setAttribute("messageType", "info");` se hace lo propio con la variable `messageType`. Lo mismo ocurre en caso de error.

A tener en cuenta: en `String message = "Cine " + newCinema + " guardado correctamente.";` hay que estar seguro de que la entidad `Cinema` sobrescribe (@Override) el método `toString()` para poder usarlo como String.

El resultado es algo como lo que se muestra a continuación.

![Notificación activa](@/assets/img/notificaciones.png)

Lo que se ve es lo que hemos definido en el fragmento `messageAlert.html` que hemos incluido en la plantilla de la vista.

## Mensajes encadenados

Si realizamos más de una gestión crítica desde un mismo controlador, como, por ejemplo, actualizar la información de un cine, y si este no está está operativo (p.ej. si ha cerrado temporalmente), entonces desactivar todas las salas de ese cine para que no se muestren en la aplicación, podemos encadenar los mensajes de ambos servicios. Para ello debemos leer el valor de la variable `message` en el segundo servicio, el que se ocupe de desactivar las salas, y añadir el aviso al nuevo mensaje, ya que sólo disponemos de un mensaje que puede ser mostrado a la vez:

``` java
String message = (String) session.getAttribute("message");
session.setAttribute("message", message + " Salas desactivadas correctamente.");
```

## Cerrando la notificación al cambiar de página

Como sabemos, la notificación puede cerrarse haciendo clic en la `X` de cierre, o bien cerrarse cuando cambiamos de página. Al cambiar de página, el filtro `SessionFilter` se ejecutará, y para que ocurra lo que queremos es necesario incluir una nueva variable y mas comprobaciones, como se muestra a continuación:

```java
@Component
public class SessionFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(true);

        if (session!= null) {

            // Variables para las notificaciones

            if (session.getAttribute("message") == null)
                session.setAttribute("message", "");

            if (session.getAttribute("messageType") == null)
                session.setAttribute("messageType", ""); 
                // Valores: "danger" u otro cualquiera = "info".

            // Cierre de notificaciones al cambiar de página

            if (session.getAttribute("messageActivated") == null)
                session.setAttribute("messageActivated", false);

            if ((boolean) session.getAttribute("messageActivated")) {
                session.setAttribute("message", "");
                session.setAttribute("messageActivated", false);
            }

            if (!Objects.equals((String) session.getAttribute("message"), ""))
                session.setAttribute("messageActivated", true);
            
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
```

En estos tres nuevos bloques de sentencias `if` , primero compruebo que la variable de sesión `messageActivated` está inicializada, como hacía con las otras variables de sesión, y si no lo está, la inicializo a false.

Como cada vez que se muestra una página en la aplicación se lanza `SessionFilter`, en el siguiente bloque de sentencias compruebo si `messageActivated` está activado (`true`), y si lo está, la desactivo, y vacío `message` para que no vuelva a mostrarse la notificación. Recordemos que el fragment `messageAlert.html` sólo muestra la notificación si su contenido no es `""`.

En el último bloque, si `message` contiene texto y es la primera vez que se va a mostrar la notificación, el bloque anterior no la habrá borrado. Entonces activo `messageActivated` para que la notificación pueda ser eliminada la siguiente vez que se muestre una página.

Como se aprecia, `messageActivated` actúa como indicador de borrado, y en este proceso es determinante el orden en el que se hacen las comprobaciones.

Con esto, ya tenemos activo nuestro propio sistema de notificaciones para Thymeleaft.

Adaptando este método sería posible, por ejemplo, generar notificaciones que permitan consultar al usuario si quiere llevar a cabo o no una tarea determinada, como p.ej. `"¿Desea borrar el cine? [Sí] [No]"`.

# BONUS: Aviso de cookies

Es fácil realizar los cambios para, por ejemplo, notificar un aviso de cookies con un botón de aceptar que permanezca abierto hasta que el usuario lo cierre, o incluso poner un banner, o cualquier aviso temporal que requiera nuestra aplicación. Hagamos el proceso de ejemplo de un aviso de cookies.

El planteamiento cambia un poco. Si vamos a emplear ambos métodos, el de notificar lo que ocurre en la aplicación y el aviso de cookies, debemos usar una variable propia que actúe de «llave» para la cookie.

La notificación estará disponible en la vista actual y en todas aquellas vistas que tengan el fragmento de código de la cookie incluido en la plantilla hasta que se lo indiquemos. Como no podemos eliminar el contenido de la notificación desde Thymeleaft, y no sabemos el momento en el que el usuario eliminará la ventana de notificación, la variable de sesión que guarda la notificación se manejará desde el *backend*, mediante un controlador y una ruta que nos permita cambiar su valor.

## El filtro

Comienzo añadiendo la nueva variable `cookieWarning` de sesión al filtro:

```java
@Component
public class SessionFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(true);

        if (session!= null) {

            // Variables para las notificaciones

            if (session.getAttribute("message") == null)
                session.setAttribute("message", "");

            if (session.getAttribute("messageType") == null)
                session.setAttribute("messageType", ""); 
                // Valores: "danger" u otro cualquiera = "info".

            // Cierre de notificaciones al cambiar de página

            if (session.getAttribute("messageActivated") == null)
                session.setAttribute("messageActivated", false);

            if ((boolean) session.getAttribute("messageActivated")) {
                session.setAttribute("message", "");
                session.setAttribute("messageActivated", false);
            }

            if (!Objects.equals((String) session.getAttribute("message"), ""))
                session.setAttribute("messageActivated", true);

            // Gestión de la cookie

            if (session.getAttribute("cookieWarning") == null)
                session.setAttribute("cookieWarning", true);

        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
```

En este caso, la variable tendrá valor `true` por defecto, lo que indica que el fragmento de aviso de cookies debe mostrarse. Cuando la cerremos, este valor cambiará a `false`.

## El fragmento

Podemos llamar al fragmento que mostrará la notificación `cookieWarnig.html`, e incluirlo en todas nuestras páginas mediante:

```html
<div th:replace="~{fragments/cookieWarning :: cookieWarning}"></div>
```

Este es su código:

```html
<div th:fragment="cookieWarning" th:if="${session.cookieWarning}" class="container mt-3 sticky-top">

    <form th:action="@{/cookie}" method="POST">

        <input type="hidden" th:name="returnUrl" th:value="${returnUrl}">

        <div class="alert alert-warning alert-dismissible fade show shadow d-flex justify-content-between" role="alert">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>&nbsp;&nbsp;
            
            <span class="align-middle"><strong>Atención:</strong> Este sitio usa cookies. Lea la Política de privacidad.</span>

            <button type="submit" class="btn btn-sm btn-outline-primary" data-bs-dismiss="alert" aria-label="Confirmar">OK</button>
        </div>
    </form>
</div>
```

Nuestra notificación de cookie se verá así:

![Notificación de cookie](@/assets/img/notificaciones-cookie.png)

La comprobación `th:if="${session.cookieWarning}"` hará que se muestre o no este fragmento, osea, que se muestre o no la notificación de cookies.

Como se aprecia, se incluye un formulario que actuará cuando el usuario cierre la notificación. Con el botón `button type="submit"`, mediante el formulario, llamo al controlador que va a desactivar la notificación de cookie a través la ruta indicada en el formulario: `<form th:action="@{/cookie}" method="POST">`.

Con `<input type="hidden" th:name="returnUrl" th:value="${returnUrl}">` indico, a través de la respuesta de formulario al controlador, a qué página debo dirigirme después de realizar la operación, pues, como dije, no sabemos en qué momento el usuario cerrará la notificación. Esto me permitirá volver a la página donde estaba una vez se procese el cambio del valor de la variable de sesión de la cookie. 

Suelo usar de forma genérica `returnUrl` para indicar la ruta porque es útil para, por ejemplo, cuando llamo a un formulario y quiero saber dónde debo ir una vez enviado el contenido del formulario, como en este caso. Por ejemplo, si nuestra aplicación maneja cines, y añadimos, editamos o borramos un cine, mediante `returnUrl` puedo indicar al método `@PostMapping` qué vista mostrar tras realizar estas operaciones. Para poder hacerlo, cuando usé las vistas de crear, editar o borrar mencionadas, añado esta variable al modelo con:

``` java
model.addAttribute("returnUrl", "cinemas");
```
donde cinemas es la ruta a la que se debe llegar una vez el formulario de la ruta a la que vamos se procese. El método se vería así:

```java
@GetMapping("/create")
public String createForm(Model model) {

    model.addAttribute("cinema", new Cinema());
    
    model.addAttribute("returnUrl", "cinemas");

    return "cinema/cinema-form";
}
```

## Cerrando la notificación de cookie

En la carpeta `controllers`, creo el controlador `CookieController` siguiente:

```java
@Controller
public class CookieController {

    @PostMapping("/cookie")
    public String closeCookiePolicy(HttpSession session,
        @RequestParam(value = "returnUrl", required = false) String returnUrl) {

        session.setAttribute("cookieWarning", false);

        if (!stringIsEmpty(returnUrl)) {
            return "redirect:" + returnUrl;
        } else {
            return "redirect:/";
        }
    }
}
```

Así, a través de la ruta `/cookie` puedo cambiar el valor de `cookieWarning` con: `session.setAttribute("cookieWarning", false);` y luego volver a la ruta deseada si hemos pasado el parámetro `returnUrl`. Ahora la notificación ya no se mostrará más.

Es importante que la ruta `/cookie` esté definida en nuestra configuración de seguridad. Si estamos usando Spring Security, en `SecurityConfig.class` debe haber algo como esto:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authRequest -> authRequest

            // otras configuraciones

            .requestMatchers(HttpMethod.POST, "/cookie").permitAll()

            // otras configuraciones

            .anyRequest().authenticated()
        )

        // otras configuraciones

        return http.build();
}
```

Con `.requestMatchers(HttpMethod.POST, "/cookie").permitAll()` la ruta `/cookie` es ahora visible y ya podemos usarla desde el fragmento para cerrar nuestra notificación.

# Un ejemplo

Puedes ver el código que implementan estos métodos, tanto las notificaciones como los mensajes fijos de cookies, en el repositorio de la aplicación [Cartelera DAW](/blog/cartelera-daw).

- [Repositorio de Cartelera DAW](https://github.com/JavGuerra/cartelera-daw) 
