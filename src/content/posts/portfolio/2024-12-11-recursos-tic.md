---
route: recursos-tic
title: Recursos TIC
description: Proyecto final del curso de Java, Spring Boot y testing.
info: Aplicación con Spring Boot y Docker que incluye tests unitarios, de integración y funcionales con JUnit, Mockito, Selenium y la API con Swagger.
author: JavGuerra
pubDate: 2024-12-11
coverImage:
  image: '@/assets/img/recursos-tic.png'
  alt: Banner Recursos TIC.
tags: 
    - portfolio
    - web
    - Java
    - Spring Boot
    - Bootstrap
    - Thymeleaft
    - Spring Security
    - accesibilidad
    - responsive
    - Selenium
    - API
    - Swagger
    - JavaDoc
    - Junit
    - Mockito
    - Docker
    - JaCoCo
    - GitHub Actions
    - CI-CD
    - SonarQube
---

Recientemente he cursado una formación con Adecco, y este es mi proyecto fin de estudios, que ha consistido en desarrollar una aplicación que permita gestionar recursos TIC y listas de recursos, para realizar los tests correspondientes, aplicando los conocimientos aprendidos, y que ha sido desplegada en el servicio de Railway.com.

## El proyecto

La plataforma, que está basada en **Java** y **Spring Boot**, utiliza un patrón Modelo-Vista-Controlador y una arquitectura cliente-servidor, haciendo uso del IDE **IntelliJ IDEA**, de **Maven** para la gestión del proyecto, de **Git** y **GitHub** para el versionado de código, de **MySQL**, **H2** y el ORM **Hibernate** para la gestión de la base de datos y de una **configuración LAMP dockerizada** para las pruebas.

Para el frontend se ha empleado el gestor de plantillas **Tymeleaft** y **Bootstrap**.

Para los tests se ha usado **JUnit**, **Mockito**, **Selenium**. la API se ha probado con **Swagger** y las estadísticas se han generado con **JaCoCo** y **SonarQube**.

Para el despliegue se utilizaron tecnologías como **Docker** y metodologías **CI/CD** con **GitHub Actions**.

La planificación y codificación se han llevado a cabo usando **Trello**.

[<button>Ver Recursos TIC en línea</button>](https://recursos-tic.up.railway.app)

## Destacados

Además de los requisitos del MVP, se han incluido las siguientes funcionalidades:

- Diseño responsive, "mobile first"
- Web accesible AA. Testada con WAVE
- Seguridad por diseño
- Confirmaciones de borrado
- Implementación de login de usuarios
- Integra el editor TinyMCE
- Provee API REST e interfaz Swagger
- Incluye aviso legal, privacidad y cookies
- Documentación la aplicación con JavaDoc
- Usa el protocolo OpenGraph para RR.SS.
- Manifest para móviles (PWA)
- Desarrollada con Linux + Docker LAMP
- Despliegue

# Video

El proyecto fue presentado a empresas de tecnología, y se puede ver en el vídeo de la presentación del proyecto aquí:

[<button>Video de la presentación</button>](https://youtu.be/d_SeaUuKrMg)

# Indicaciones de uso

## Requisitos

Para ejecutar el proyecto se requiere:

- Java 23 o superior
- Maven
- MySQL
- Docker

## Configuración

Actualmente la aplicación se ejecuta localmente en el puerto 8082.

Puede construirse un contenedor Docker con la imagen de la aplicación ejecutando el fichero `docker.sh` que hace uso de docker-compose para lanzar la aplicación y la BBDD que requiere.

Para generar un informe de cobertura de testing, se puede ejecutar el comando `mvn site` y acceder a él en el directorio `target/site/jacoco/index.html`.

# Autores

Desarrollado por [Javier](https://github.com/JavGuerra) y [Kevin](https://github.com/kevinzamoraa)


## Licencia

Sobre el código fuente: GNU GENERAL PUBLIC LICENSE Version 3

## Enlaces

![QR enlace a la Aplicación](https://raw.githubusercontent.com/JavGuerra/recursos-tic-testing/refs/heads/main/src/main/resources/static/img/qr.svg)

- [Aplicación](https://recursos-tic.up.railway.app)  
- [API REST](https://recursos-tic.up.railway.app/swagger-ui/index.html)  
- [Repositorio](https://github.com/JavGuerra/recursos-tic-testing)  
- [Ver el vídeo de la presentación del proyecto](https://youtu.be/d_SeaUuKrMg)  
- [Ver el PDF de la presentación](https://recursos-tic.up.railway.app/doc/presentacion-recursos_tic.pdf)  
- [Spinner loader en Thymeleaft](https://javguerra.github.io/blog/loader-thymeleaft/)  
