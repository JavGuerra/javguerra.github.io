---
layout: post
title: Cartelera DAW
subtitle: Proyecto final de FPGS DAW con Java y Spring Boot
thumbnail-img: https://raw.githubusercontent.com/JavGuerra/cartelera-daw/a79cd41c51299dd3897d989ea8e045ea5f894ac7/src/main/resources/static/img/logo.svg
gh-repo:  JavGuerra/caertelera-daw  
gh-badge: [star, fork, follow]
tags: [java, spring, bootstrap, thymeleaft, security]
---

Recientemente he presentado mi proyecto fin de estudios de Formación Profesional de Grado Superior DAW. Era algo que tenía aparcado durante demasiado tiempo y finalmente esta etapa se ha cerrado.

El proyecto  ha consistido en una aplicación web monolítica, desarrollada en Java, usando el framework Spring Boot, y ha sido desplegada en el servicio de Railway.com.

![Logo cartelera](https://raw.githubusercontent.com/JavGuerra/cartelera-daw/a79cd41c51299dd3897d989ea8e045ea5f894ac7/src/main/resources/static/img/logo.svg){: .mx-auto.d-block :}

## El proyecto

El proyecto Cartelera DAW desarrolla una plataforma web para mostrar información cinematográfica cuyos usuarios potenciales son los espectadores y las distribuidoras de películas, cines y salas de proyección.

La plataforma, que está basada en **Java** y **Spring Boot**, utiliza un patrón Modelo-Vista-Controlador y una arquitectura cliente-servidor, haciendo uso del IDE **IntelliJ IDEA**, de **Maven** para la gestión del proyecto, de **Git** y **GitHub** para el versionado de código, de **MySQL** e **Hibernate** para la gestión de la base de datos y de una **configuración LAMP dockerizada** para las pruebas. Para el despliegue se utilizaron tecnologías como **Docker** y metodologías **CI/CD**. Para el frontend se ha empleado el gestor de plantillas **Tymeleaft** y **Bootstrap**.

Adicionalmente se proponen una serie de estrategias comerciales para garantizar la sostenibilidad del modelo empresarial del proyecto.

Se elaboró una memoria de 70 páginas y una presentación.

El objetivo era aprender y usar tecnologías nuevas no estudiadas en DAW.

La calificación final ha sido de 9 de 10, y se ha llevado a cabo en un periodo de tres semanas.

![Pantalla Cartelera DAW](https://raw.githubusercontent.com/JavGuerra/cartelera-daw/main/src/main/resources/static/img/banner.png)

[<button class="btn btn-info" style="font-family:Arial, Helvetica, sans-serif;">Ver Cartelera DAW en línea</button>](https://cartelera-daw.up.railway.app/)

## La formación previa

Pero el proyecto no partía de cero. Durante los meses de enero y febrero, y hasta el 9 de marzo de 2023, participé en un curso de especialización en Java + Spring de la Fundación Adecco dentro del Proyecto Digital School Erasmus+

Se trataba de una formación mentorizada que incluía un trabajo en grupo para desarrollar una aplicación web. En mi grupo de trabajo me encargué de la coordinación del equipo mediante Trello y de la planificación de las funcionalidades de la aplicación y las propuesta de mejora de la app. El grupo se llamaba Cinéfilos, y Cartelera DAW bebe de la estructura simple de aquella práctica que me sirvió para entender cómo funciona el framework.

El proyecto ahora presentado ha cambiado mucho desde aquella versión, tanto en su estructura como en su diseño. Partía de un código inconcluso donde sólo se habían implementado los CRUDs básicos, con fallos de integridad y sin funcionalidades mínimas, pero ahora la aplicación ha sido probada y revisada en profundidad, y cuenta con características que refuerzan sus funcionalidades. 

[<button class="btn btn-info" style="font-family:Arial, Helvetica, sans-serif;">Ir al repositorio del proyecto</button>](https://github.com/JavGuerra/cartelera-daw)

En el curso, así como en la práctica, obtuve una calificación de 10/10.

## Características

Además de los requisitos solicitados para el MVP, en la app se ha implementado:

- Seguridad de rutas  
- Registros de usuario  
- Validaciones de formularios  
- Automatizaciones  
- Documentación con JavaDoc  
- Implementación de Logs  
- Notificaciones
- Despliegue dockerizado

Cuenta con:

- Portada dinámica 
- Diseño responsive  
- Diseño accesible   
- Aviso legal y privacidad 
- Aviso de cookies 
- Ayuda en línea
- Spinner loader
 

## Desarrollo y despliegue

Tanto en el desarrollo como en el despliegue ha jugado un papel importante Docker.

La BBDD MySQL y PHPMyAdmin han sido lanzados usando contenedores gestionados con la herramienta Portainer.

El despliegue se lleva a cabo tomando el código fuente y, mediante un dockerfile, construyendo la imagen del contenedor que es lanzado en el servidor.

Spring Boot contiene un servidor Tomcat encargado de servir las páginas de la aplicación.

## Indicaciones de instalación

Tras clonar el repositorio, es necesario crear un usuario en la BBDD relacional llamado «cartelera-daw» con el password que deseemos. Estos datos, así como el puerto por defecto de la app (8082), pueden ser introducidos en el fichero «aplication.propieties», en la carpeta resources.

Cada vez que se inicia la aplicación, esta recarga los datos en la BBDD.

Una vez iniciada la aplicación en local, se puede acceder a ella en la dirección: `http://localhost:8082`

El acceso al panel de administración requiere de usuario y contraseña. Por defecto, la aplicación tiene un usuario «admin» y su contraseña es «admin».

**ADVERTENCIA**: Se recomienda que, tras el primer acceso, la contraseña de admin sea cambiada o se cree una nueva cuenta de usuario desde la que eliminar la cuenta «admin».

## Licencia

Sobre el código fuente: [GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)

## Enlaces

![QR enlace a la Aplicación](https://raw.githubusercontent.com/JavGuerra/cartelera-daw/a79cd41c51299dd3897d989ea8e045ea5f894ac7/src/main/resources/static/img/qr-app.svg)

- [Aplicación](https://cartelera-daw.up.railway.app/)
- [Repositorio](https://github.com/JavGuerra/cartelera-daw)  
 
