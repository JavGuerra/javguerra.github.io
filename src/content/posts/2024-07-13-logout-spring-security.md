---
route: logout-spring-security
title: Logout personalizado con Spring Security
description: Limpiando el contexto de seguridad sin borrar la cookie.
author: JavGuerra
pubDate: 2024-07-13
coverImage:
  image: '@/assets/img/cookies.png'
  alt: cookies
tags: 
  - código
  - Java
  - Spring Boot
  - Spring Security
  - seguridad
---

En un [artículo anterior](notificaciones-thymeleaft) he usado variables de sesión para guardar información de la aplicación: mensajes para el usuario, aviso de cookies... Puede que, cuando el usuario salga de su sesión, queramos conservar estos datos que seguirán siendo útiles aunque no esté autenticado. En esta entrada muestro mi solución usando Spring Security.

Se asume que el lector tiene conocimientos generales de Spring Boot y Spring Security para aplicar el contenido.

# El contexto de seguridad

El primer paso en el proceso de logout que lleva a cabo Spring Security es invalidar la sesión del usuario. Esto significa que Spring Security elimina cualquier información asociada con la sesión del usuario, como datos de estado de sesión almacenados en el servidor o en cookies (borra la información, pero no la cookie). Al invalidar la sesión, se asegura de que el usuario ya no pueda acceder a la aplicación como si estuviera autenticado.

Después de invalidar la sesión, Spring Security también limpia el contexto de seguridad actual. Esto incluye eliminar cualquier token de Authentication que represente al usuario autenticado, asegurando que el usuario ya no sea reconocido como autenticado en la aplicación.

Pero en este caso no interesa ese borrado completo, sino sólo la información de autenticación. Para ello debo codificar mi propio logout limpiando el contexto de seguridad pero sin invalidar la sesión.

# Tomando el control de Logout

Como sabemos, para configurar Spring Security se usa la clase `SecurityConfig.class`, que generalmente incluye el componente `SecurityFilterChain`, fundamental para establecer filtros a las peticiones HTTP que se reciben en la aplicación. En este ejemplo me centraré en la parte de su configuración relativa al logout.

``` java
@Configuration
@EnableWebSecurity
public class  SecurityConfig {

    ...

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception {
        http.authorizeHttpRequests(authRequest -> authRequest

                ...

                .requestMatchers(HttpMethod.POST, "/logout").permitAll()

                .anyRequest().authenticated()
            )

            ...

            .logout(logout -> logout
                .logoutUrl("/logout")
                .permitAll()
            )

        return http.build();
    }
}
```

Con `...` indico que el código puede ser más amplio y contener otras configuraciones.

En la línea `.requestMatchers(HttpMethod.POST, "/logout").permitAll()` estoy permitiendo el acceso a la ruta personalizada para llevar a cabo el logout. Realmente, esto no sería necesario al incluir `.permitAll()` después de `logoutUrl("/logout")`. Tampoco sería necesario porque la ruta `/logout` está disponible por defecto. No obstante, esto puede ser útil si decidimos usar otra ruta distinta a `/logout` en la aplicación.

Para la gestión del token del usuario, será necesario definir un controlador propio para la ruta `logout`. Algo similar a esto:

```java
@Slf4j
@Controller
public class LogoutController {

    @RequestMapping("/logout")
    public String logout() {

        log.info("logout");

        SecurityContextHolder.getContext().setAuthentication(null);

        // cosas que hacer tras el cierre de sesión aquí

        return "logout";
    }
}
```

La información de sesión se guarda en una cookie llamada `JSESSIONID`, que contendrá las variables de sesión, incluido el token de autenticación.

Con `SecurityContextHolder.getContext().setAuthentication(null);` elimino el token de autenticación, pero sin borrar toda la información de la cookie, como las variables de sesión. 

Después de esto, puedo realizar algunas acciones asociadas al cierre y redirigir al login, o como en este caso, mostrar la vista `logout` para mostrar un mensaje de despedida.

# Refinando el logout

Al usar `null` elimino el token de autenticación del usuario, pero puede que, en la plantilla que devuelvo con return (`logout` en el caso anterior), sea necesario usar el contexto de seguridad, por ejemplo mostrando una información u otra en un fragmento de la plantilla si estamos autenticados o no. Con este método, ni `sec:authorize="isAnonymous()"` ni `sec:authorize="isAuthenticated()"` funcionarán en Thymeleaft, ya que ahora no existe el token que indique si el usuario es anónimo o está autenticado.

Esto ocurre sólo para la vista asociada al controlador que es llamada tras borrar el token, pero no ocurre así para las siguientes vistas, en las que parece que el token es regenerado como anónimo.

Entonces, si en la siguiente vista no vamos a usar la autenticación, será suficiente con usar `null`, pero si no es así, entonces hay que cambiar el token en vez de eliminarlo, pero Spring Boot no tiene un token por defecto que pueda usar, así que debo construir uno.

Primeramente añado el siguiente código en

``` java
@Bean
public AnonymousAuthenticationToken anonymousAuthenticationToken() {
    List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_ANONYMOUS"));
    return new AnonymousAuthenticationToken("ANONYMOUS_USER", "ANONYMOUS_USER", authorities);
}
```

Que me permitirá crear `anonymousAuthenticationToken` como un `Bean`. Este método es responsable de crear e inicializar el objeto `AnonymousAuthenticationToken`. Este token es utilizado por Spring Security para representar la autenticación de usuarios anónimos dentro de una aplicación.

El método realiza las siguientes acciones:

* **Inicialización de Autoridades**: Primero, creo una lista (`List<GrantedAuthority>`) con un solo elemento, que es una instancia de `SimpleGrantedAuthority` con el rol `"ROLE_ANONYMOUS"`. Las autoridades (o roles) determinan los privilegios que tiene un usuario dentro de la aplicación. En este caso, asigno al usuario anónimo el rol de `ROLE_ANONYMOUS`.

* **Creación del Token**: Luego, utilizo esta lista de autoridades para construir un nuevo `AnonymousAuthenticationToken`, pasando también dos cadenas de texto (`"ANONYMOUS_USER"`) como nombre y detalles del usuario. Estos valores pueden ser personalizados según sea necesario.

Ya puedo usar el token en el controlador, como se muestra:

```java
@Slf4j
@RequiredArgsConstructor
@Controller
public class LogoutController {

    private final AnonymousAuthenticationToken anonymousAuthenticationToken;

    @RequestMapping("/logout")
    public String logout() {

        log.info("logout");

        SecurityContextHolder.getContext().setAuthentication(anonymousAuthenticationToken);

        // cosas que hacer tras el cierre de sesión aquí

        return "logout";
    }
}
```

Ahora sí, el usuario será anónimo, y cualquier comprobación en la plantilla Thymeleaft que incluya `sec:authorize="isAnonymous()"` permitirá que la etiqueta HTML que lo use sea mostrada.

# Consideraciones

Tal vez podría crearse un servicio al que llamar desde el controlador para gestionar el logout, o un manejador propio `CustomLogoutHandler` que realice esta función de cierre de sesión sin la necesidad de crear un controlador, y que se use directamente desde `SecurityConfig.class`.

Se han de tener en cuenta las consideraciones de seguridad relacionadas con este método. Mantener información de la sesión de usuario una vez se lleva a cabo el logout no siempre es seguro, y se deben controlar las posibles fugas de información para evitar problemas.

# Un ejemplo

Puedes ver el código que implementan esta funcionalidad en el repositorio de la aplicación [Cartelera DAW]({2024-06-20-cartelera-daw).

- [Repositorio de Cartelera DAW](https://github.com/JavGuerra/cartelera-daw)

Mira también el artículo donde se usan las variables de sesión que quiero preservar:

- [Notificaciones con Thymeleaft]({2024-07-03-notificaciones-thymeleaft)