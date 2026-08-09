---
route: sistemas-operativos
title: 12 sistemas operativos que cambiaron la informática
description: Las ideas revolucionarias que dieron forma a los sistemas que usamos hoy.
author: JavGuerra
pubDate: 2026-08-09
coverImage:
  image: '@/assets/img/so.jpg'
  alt: Distintos sistemas operativos y máquuinas de la historia
tags:
    - computación
    - historia
    - ingeniería
    - retro
    - tecnología
---

Cuando pensamos en sistemas operativos, nombres como Windows, macOS, Android o Linux dominan nuestra mente. Sin embargo, el éxito comercial no siempre coincide con la innovación técnica.

A lo largo de las décadas han existido sistemas que experimentaron con ideas que parecían imposibles para su época: protección por hardware, memoria virtual, interfaces gráficas, programación orientada a objetos, microkernels, sistemas distribuidos, multitarea avanzada o arquitecturas diseñadas específicamente para dispositivos con recursos mínimos.

Algunas de estas ideas acabaron incorporándose a los sistemas que utilizamos todos los días. Otras fueron demasiado adelantadas a su tiempo y quedaron como experimentos, productos de nicho o auténticas joyas de la historia de la informática.

Este es un ranking -en orden cronológico- <u>necesariamente subjetivo</u> de 12 sistemas especialmente innovadores, valorados por su originalidad arquitectónica, su audacia técnica, su influencia posterior y su capacidad para introducir ideas que terminarían reapareciendo en otros sistemas.

---

## 1. Multics (MIT / Bell Labs, 1965) — El gigante que anticipó la seguridad moderna

[Multics](https://es.wikipedia.org/wiki/Multics), el proyecto liderado por **Fernando J. Corbató**, fue uno de los S.O. más ambiciosos de la informática de los años sesenta. Su objetivo era convertir el ordenador en una especie de **«servicio informático» compartido**, al que numerosos usuarios pudieran acceder simultáneamente mediante *time-sharing*. No era computación en la nube en el sentido moderno, pero sí anticipaba la idea de utilizar la capacidad informática como un recurso compartido.

### La revolución técnica

Multics llevó mucho más lejos que sus contemporáneos la idea de que el hardware y el sistema operativo debían colaborar para proteger los recursos del sistema.

Su arquitectura combinaba **segmentación y paginación de memoria virtual**, mecanismos de control de acceso y diferentes niveles de privilegio. El procesador utilizado por Multics incorporaba soporte específico para los llamados **anillos de protección**, dominios concéntricos con distintos niveles de privilegio.

### Innovación clave

Multics también fue pionero en utilizar **listas de control de acceso (ACL)** asociadas a los recursos del sistema. Su sistema de archivos incorporaba ACL, cuotas, enlaces simbólicos, nombres largos y otras funciones que hoy damos por sentadas.

Otro detalle extraordinario era su capacidad de **reconfiguración dinámica**: determinados componentes de hardware podían añadirse o retirarse mientras el sistema permanecía funcionando.

### El legado

Multics no triunfó comercialmente como sus diseñadores habían imaginado, pero muchas de sus ideas acabaron convirtiéndose en conceptos fundamentales de la seguridad y la arquitectura de sistemas operativos.

Incluso su influencia sobre UNIX es paradójica: UNIX nació en Bell Labs en parte como una reacción ante la enorme complejidad de Multics, pero heredó muchas de sus ideas conceptuales.

---

## 2. UNIX (Bell Labs, 1969) — El diseño que se convirtió en una tradición informática

[UNIX](https://es.wikipedia.org/wiki/Unix) nació en Bell Labs a finales de los años sesenta de la mano de **Ken Thompson, Dennis Ritchie y otros investigadores**. Su importancia no reside únicamente en sus características técnicas concretas, sino en haber creado un modelo de sistema operativo y de herramientas que acabaría influyendo profundamente en décadas posteriores.

### La revolución técnica

Una de sus ideas más poderosas fue presentar numerosos recursos mediante una **interfaz uniforme basada en archivos**. Discos, dispositivos y otros recursos podían integrarse en el mismo modelo general de acceso, aunque no fuera literalmente cierto que «todo era un archivo».

También introdujo una filosofía de herramientas pequeñas y especializadas que podían combinarse entre sí.

### Innovación clave

Las **tuberías (*pipes*)** permitieron conectar la salida de un programa con la entrada de otro, haciendo posible construir operaciones complejas a partir de herramientas relativamente sencillas.

Pero probablemente la innovación histórica más importante fue otra: **la reescritura del núcleo de UNIX en C en 1973**. Las primeras versiones habían sido escritas en ensamblador. La adopción de C hizo posible separar buena parte del sistema de las particularidades del hardware y facilitó enormemente su portabilidad.

### El legado

Linux no es un descendiente directo de UNIX, sino un sistema **tipo Unix** desarrollado de forma independiente. Android, por su parte, utiliza el kernel Linux. macOS e iOS pertenecen a otra rama de la genealogía: derivan de la tecnología de NeXT, Mach y BSD.

Aun así, todos ellos forman parte de una tradición informática profundamente influida por UNIX.

Su mayor victoria quizá sea cultural: la combinación de procesos, archivos, tuberías, shells y herramientas pequeñas se convirtió en uno de los modelos de computación más duraderos de la historia.

---

## 3. Xerox Alto / Smalltalk (Xerox PARC, 1973) — El laboratorio que enseñó a las máquinas a hablar nuestro idioma

Antes de que Apple lanzara Macintosh o Microsoft popularizara Windows, los investigadores de Xerox PARC ya estaban experimentando con una forma completamente distinta de utilizar los ordenadores.

El [Xerox Alto](https://computerhistory.org/blog/xerox-alto-source-code), diseñado en 1973, combinaba una pantalla bitmap, ratón, redes, almacenamiento y una interfaz gráfica basada en ventanas, menús e interacción directa.

No fue la primera interfaz gráfica de la historia —existían importantes antecedentes, como Sketchpad (1963), el programa de Ivan Sutherland que permitía dibujar con un lápiz óptico sobre la pantalla, o el trabajo de Douglas Engelbart, que en 1968 demostró el uso del ratón, el hipertexto y la edición colaborativa—, pero sí fue uno de los primeros sistemas en integrar de manera coherente ventanas, iconos y manipulación directa en un ordenador de propósito general.

![SmallTalk 76](https://upload.wikimedia.org/wikipedia/commons/8/8d/Smalltalk-76.popup.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original)

### La revolución técnica

El Alto demostró que un ordenador podía diseñarse alrededor de la interacción humana y no alrededor de las limitaciones de los terminales de texto.

El sistema permitió experimentar con documentos gráficos, edición [WYSIWYG](https://es.wikipedia.org/wiki/WYSIWYG), tipografías, redes y entornos de programación visual.

### Innovación clave

Aquí conviene distinguir entre **Alto** y **Smalltalk**.

[Smalltalk](https://computerhistory.org/blog/introducing-the-smalltalk-zoo-48-years-of-smalltalk-history-at-chm) fue concebido bajo la visión de **Alan Kay** y su equipo en PARC, funcionando simultáneamente como lenguaje de programación, entorno de desarrollo y sistema interactivo. Su entorno gráfico fue especialmente influyente en la evolución de las **ventanas, los menús y la programación orientada a objetos**.

La visión de Kay al combinar Alto y Smalltalk transformó el ordenador en un medio dinámico e interactivo, alejándolo definitivamente del concepto de simple calculadora electrónica.

### El legado

La influencia de Xerox PARC llegó directamente a Apple y, posteriormente, a la informática gráfica de consumo.

El modelo de ventanas, puntero y manipulación directa que hoy parece natural fue, en buena medida, una de las grandes ideas que PARC consiguió convertir en realidad práctica.

---

## 4. CP/M (Digital Research, 1974) — El sistema que ayudó a separar el software del hardware

Creado por **Gary Kildall**, [CP/M](https://www.computerhistory.org/timeline/1976) fue el primer sistema operativo para microcomputadores que alcanzó una implantación comercial realmente importante.

Su importancia no estaba en tener una arquitectura tan sofisticada como Multics, sino en resolver un problema fundamental de la primera informática personal: **cómo conseguir que un programa pudiera utilizarse en máquinas diferentes**.

### La revolución técnica

CP/M separaba una parte relativamente independiente del hardware de otra encargada de las particularidades de cada máquina.

Su componente **BIOS (Basic Input/Output System)** permitía adaptar el sistema a distintos equipos, mientras que el resto del sistema podía mantenerse en gran medida común.

El resultado fue revolucionario: un mismo programa podía funcionar en diferentes ordenadores compatibles con CP/M.

### Innovación clave

CP/M estableció muchas de las convenciones que después resultarían familiares a los usuarios de DOS.

MS-DOS no fue simplemente una copia de CP/M. Microsoft obtuvo 86-DOS, desarrollado por Tim Paterson en Seattle Computer Products, y posteriormente lo convirtió en PC-DOS/MS-DOS. **Paterson diseñó 86-DOS con una interfaz y una API muy similares a las de CP/M**, facilitando así la adaptación de programas existentes. 86-DOS compartía numerosas convenciones con CP/M, pero no era una copia de su código.

### El legado

CP/M ayudó a crear una idea fundamental para la informática personal: **el sistema operativo podía convertirse en una capa relativamente independiente de la máquina física**.

Esa separación entre software y hardware acabaría siendo uno de los pilares de la industria del PC.

---

## 5. VMS (Digital Equipment Corporation, 1977) — El laboratorio de ideas que acabaría influyendo en Windows NT

VMS fue diseñado para los sistemas VAX de Digital Equipment Corporation con una prioridad muy clara: construir una plataforma robusta para computación empresarial, multiusuario y de larga duración.

Conviene llamarlo **VMS** al hablar de sus orígenes; el nombre [OpenVMS](https://es.wikipedia.org/wiki/OpenVMS) apareció posteriormente.

### La revolución técnica

VMS integró de forma sofisticada **memoria virtual, protección de memoria, multitarea, gestión de procesos y almacenamiento**.

Uno de sus rasgos más conocidos fue el sistema de archivos Files-11, que incorporaba **versionado de archivos**. Cuando se creaban nuevas versiones de determinados archivos, el sistema podía conservar versiones anteriores en lugar de limitarse a sobrescribirlas.

### Innovación clave

VMS también fue pionero en soluciones de **clustering y alta disponibilidad**, permitiendo conectar varios sistemas para compartir determinados recursos y servicios de forma coordinada.

Pero su legado más famoso está relacionado con una persona.

### El legado

**Dave Cutler**, uno de los principales arquitectos de VMS, pasó posteriormente a Microsoft y desempeñó un papel fundamental en el diseño de **Windows NT**.

NT no fue simplemente «VMS para PC»: fue un sistema nuevo con su propia arquitectura. Pero la experiencia acumulada por Cutler y otros ingenieros de DEC tuvo una influencia enorme en su diseño.

La familia moderna de Windows procede de aquella línea tecnológica de NT.

---

## 6. QNX (Quantum Software Systems, 1981) — El triunfo del microkernel en tiempo real

[QNX](https://qnx.com/developers/docs/8.0/com.qnx.doc.neutrino.sys_arch/topic/kernel.html) es una de esas tecnologías que millones de personas pueden haber utilizado sin saberlo.

La primera versión de QNX se distribuyó en **1981**, y desde el principio destacó por una arquitectura basada en un núcleo pequeño y mecanismos de comunicación entre procesos.

### La revolución técnica

La filosofía de QNX consistía en mantener el núcleo lo más pequeño posible y ejecutar muchos servicios fuera de él.

En generaciones posteriores, especialmente **QNX Neutrino**, esta idea se llevó mucho más lejos: el microkernel se encarga de funciones esenciales como planificación, comunicación entre procesos y determinados servicios fundamentales, mientras que otros componentes pueden ejecutarse como procesos independientes.

### Innovación clave

Uno de sus grandes puntos fuertes es el **aislamiento de fallos**.

Los procesos y controladores pueden ejecutarse en espacios de memoria separados. Un fallo en un controlador no tiene por qué corromper la memoria del núcleo ni la de los demás procesos.

Esto resulta especialmente valioso en sistemas de tiempo real, donde la previsibilidad y la recuperación ante errores pueden ser más importantes que la compatibilidad con aplicaciones de escritorio.

### El legado

QNX terminó encontrando su territorio natural en **automoción, sistemas industriales, telecomunicaciones, dispositivos médicos y otros sistemas embebidos y críticos**.

No es correcto afirmar que sea el sistema operativo de «todos» los frenos ABS o centrales nucleares, pero sí es uno de los ejemplos más importantes de cómo una arquitectura de microkernel puede resultar extraordinariamente útil cuando la fiabilidad es prioritaria.

---

## 7. AmigaOS (Commodore, 1985) — Una revolución multimedia antes de tiempo

En 1985, el Amiga parecía pertenecer a otra generación tecnológica respecto a muchos ordenadores domésticos de la época.

Su sistema operativo, [AmigaOS](https://es.wikipedia.org/wiki/AmigaOS), fue diseñado alrededor de una máquina con hardware multimedia extraordinariamente avanzado para su precio.

![Amiga OS](https://upload.wikimedia.org/wikipedia/en/e/e4/Amiga_Workbench_1_3_large.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original)

### La revolución técnica

La arquitectura del Amiga descargaba determinadas tareas gráficas, de memoria y de audio en sus chips personalizados, entre ellos **Agnus, Denise y Paula**.

Esto permitía conseguir efectos gráficos y sonoros que habrían sido muy costosos para la CPU de un ordenador convencional.

### Innovación clave

El núcleo **Exec** proporcionaba multitarea preventiva y un sistema de comunicación entre tareas muy eficiente.

AmigaOS era, sin embargo, diferente de los sistemas modernos en un aspecto fundamental: originalmente ofrecía **muy poca protección entre aplicaciones**. Una aplicación podía corromper memoria perteneciente a otra parte del sistema.

Por eso, aunque la multitarea era muy avanzada, la robustez frente a programas defectuosos era considerablemente menor que en sistemas modernos con protección de memoria.

### El legado

Cuando un error grave ocurría, podía aparecer la famosa **«Guru Meditation»**, uno de los mensajes de error más reconocibles de la historia de la informática.

AmigaOS demostró que un ordenador doméstico podía ofrecer multitarea, gráficos, sonido y una interfaz sofisticada años antes de que esas capacidades fueran normales en los PCs.

---

## 8. NeXTSTEP (NeXT, 1989) — El sistema que conectó UNIX con el futuro de Apple

[NeXTSTEP](https://es.wikipedia.org/wiki/NeXTSTEP) fue desarrollado por la empresa fundada por **Steve Jobs** después de su salida de Apple.

La máquina NeXT no consiguió conquistar el mercado de consumo, pero su software acabaría teniendo una influencia gigantesca.

### La revolución técnica

NeXTSTEP combinaba tecnologías derivadas de **Mach y BSD** con un entorno de programación orientado a objetos basado en **Objective-C**.

Su núcleo, basado en **Mach 2.5**, no seguía el modelo de micronúcleo puro: integraba componentes de BSD y otros servicios dentro del espacio privilegiado del sistema.

### Innovación clave

La verdadera revolución estaba en las herramientas.

**Interface Builder**, Objective-C y los frameworks de NeXT permitían construir interfaces gráficas mediante objetos reutilizables y conexiones visuales.

En lugar de programar cada elemento de una interfaz desde cero, el desarrollador podía ensamblar componentes y definir sus relaciones.

Esto anticipó muchas de las herramientas modernas de desarrollo visual.

### El legado

El impacto de NeXTSTEP llegó mucho más lejos de lo que podía parecer.

En 1990, **Tim Berners-Lee utilizó un ordenador NeXT en el CERN para desarrollar el primer servidor web y el primer navegador/editor de la World Wide Web**.

Y en 1996 Apple adquirió NeXT. La tecnología resultante acabó dando lugar a **Mac OS X y, posteriormente, a macOS y las plataformas de Apple basadas en Darwin/XNU**.

Pocas plataformas desaparecidas pueden presumir de haber contribuido tanto a la historia de Internet y a la de Apple simultáneamente.

![NextStep y la WWW](https://upload.wikimedia.org/wikipedia/commons/8/8c/WorldWideWeb.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original)

---

## 9. GNU/Linux (Richard Stallman, 1983 / Linus Torvalds, 1991) — La revolución del software libre y el desarrollo colaborativo

Antes de que Linux hiciera su aparición, **Richard Stallman** lanzó en 1983 el **Proyecto GNU** con la misión de construir un sistema operativo completamente libre compatible con Unix. Para finales de la década, el movimiento de Stallman había desarrollado las bibliotecas, compiladores (GCC) y utilidades fundamentales, pero aún carecía de un núcleo (*kernel*) maduro.

Fue en 1991 cuando **Linus Torvalds** comenzó a desarrollar Linux como un proyecto personal. Al liberar este núcleo bajo la licencia **GNU GPL**, creada por Stallman, Torvalds completó la última pieza que faltaba, dando origen al sistema operativo que hoy conocemos como [GNU/Linux](https://es.wikipedia.org/wiki/GNU/Linux).

---

<Image src="image_agent_tag_8351238207509410809" alt="Richard Stallman hablando sobre software libre y el proyecto GNU" caption="Richard Stallman, fundador del Proyecto GNU y del movimiento del software libre" />

---

### La revolución técnica

Desde el punto de vista de la arquitectura, Linux siguió el modelo monolítico de los sistemas tipo Unix, aunque enriquecido con módulos cargables y técnicas modernas. Sin embargo, su verdadera transformación radicó en **cómo se construyó**.

La unión de la visión filosófica del software libre de GNU con el modelo de desarrollo distribuido de Torvalds demostró que una comunidad global interconectada mediante **listas de correo, control de versiones y revisión pública del código** podía superar los modelos de desarrollo propietarios tradicionales.

### Innovación clave

Los **módulos cargables del kernel** permitieron ampliar el núcleo sin tener que recompilarlo completamente para cada cambio.

Sin embargo, el cambio de paradigma fundamental fue doble: la invención de la **licencia GPL (copyleft)** por parte de Stallman —que garantiza legalmente que el código siga siendo libre para siempre— y el modelo organizativo iniciado por Torvalds, demostrando que un sistema de escala masiva podía evolucionar de manera abierta y colaborativa.

### El legado

GNU/Linux terminó dominando áreas que durante décadas habían estado reservadas a sistemas propietarios.

Es la base de la mayor parte de la infraestructura de Internet, servidores, supercomputación, dispositivos embebidos y el pilar sobre el que se apoya el kernel de Android.

En junio de 2026, la [estadística de familias de sistemas operativos de TOP500](https://www.top500.org/statistics/details/osfam/1) clasifica los **500 sistemas de la lista dentro de la familia de sistemas operativos Linux**. Sin embargo, esta categoría no significa que los 500 aparezcan identificados literalmente como «Linux»: la propia base de TOP500 muestra sistemas con nombres como TOSS, HPE Cray OS, RHEL o Kylin OS. El número 1 de esa edición, LineShine, utiliza Kylin OS.

Su mayor legado, no obstante, va más allá de la técnica: demostró que la filosofía del software libre de Stallman y la metodología abierta de Torvalds podían crear la infraestructura tecnológica más importante del planeta.

---

## 10. Plan 9 (Bell Labs, finales de los 80 / 1992) — El UNIX que convirtió la red en parte del sistema operativo

[Plan 9](https://9p.io/plan9/about.html) nació en Bell Labs de la mano de investigadores como **Ken Thompson, Rob Pike, Dave Presotto y Phil Winterbottom**, continuando la tradición experimental que había dado origen a UNIX. El desarrollo comenzó a finales de los años ochenta y la primera edición pública apareció posteriormente.

### La revolución técnica

Plan 9 llevó mucho más lejos la idea de que los recursos del ordenador podían representarse mediante una interfaz uniforme.

Su arquitectura utilizaba el protocolo **9P** para acceder a recursos locales o remotos, mientras que cada proceso podía tener su propio *namespace*, es decir, su propia visión de los recursos disponibles.

### Innovación clave

La red no era un añadido externo: formaba parte del modelo fundamental del sistema.

Una instalación de Plan 9 podía estar compuesta por **servidores de archivos, servidores de CPU y terminales**, conectados mediante una infraestructura de red coherente.

Esto no significaba que una máquina pudiera utilizar arbitrariamente la RAM física de otra como si fuera memoria local. La genialidad estaba en algo diferente: **los recursos remotos podían incorporarse al espacio de nombres del proceso y utilizarse mediante interfaces uniformes**.

### El legado

Plan 9 nunca conquistó el mercado, pero muchas de sus ideas siguen resultando sorprendentemente modernas: namespaces por proceso, recursos accesibles como archivos, servicios distribuidos y una separación muy limpia entre recursos y máquinas.

Su influencia sobre los sistemas contemporáneos es indirecta pero profunda, especialmente en áreas relacionadas con namespaces, aislamiento y sistemas distribuidos.

---

## 11. BeOS (Be Inc., 1995) — El sistema operativo diseñado alrededor del multimedia

Tras su paso por Apple —donde llegó a liderar la división Macintosh tras la salida de Steve Jobs—, **Jean-Louis Gassée** fundó Be Inc. junto a Steve Sakoman con una misión muy concreta: construir una plataforma extremadamente rápida, libre de legados técnicos y totalmente orientada al **multimedia y el procesamiento paralelo** que se llamó [BeOS](https://es.wikipedia.org/wiki/BeOS).

En una época en la que muchos sistemas de escritorio arrastraban décadas de compatibilidad hacia atrás, la apuesta fue empezar prácticamente de cero.

### La revolución técnica

Su característica más famosa era el **multihilo generalizado** (*pervasive multithreading*).

Los componentes del sistema y las aplicaciones podían utilizar múltiples hilos de ejecución de forma intensiva, aprovechando mejor los sistemas multiprocesador y permitiendo que distintas tareas progresaran de forma independiente.

Esto contribuía a una sensación de respuesta excepcionalmente buena para la época.

### Innovación clave

Otro de sus grandes avances fue **BFS (Be File System)**, desarrollado por Benoît Schillings.

BFS no trataba los archivos únicamente como bloques de datos, sino que permitía asociarles **atributos y metadatos indexables**. El sistema podía mantener índices sobre esos atributos y realizar búsquedas de forma mucho más integrada que los sistemas de archivos de escritorio tradicionales.

### El legado

Aunque BeOS no logró imponerse en el mercado comercial —incluso después de que Apple barajara su compra en 1996 antes de decantarse por NeXT—, su elegante arquitectura dejó una huella imborrable en el mundo del software.

Su espíritu continúa vivo hoy en **Haiku**, un sistema operativo de código abierto que busca preservar y evolucionar las ambiciosas ideas de BeOS.

---

## 12. Symbian (Symbian Ltd., 1998) — Ingeniería extrema para una informática con recursos mínimos

Antes del iPhone y Android, los teléfonos inteligentes eran un problema de ingeniería completamente diferente al de un PC.

Había poca memoria, procesadores lentos, baterías pequeñas, almacenamiento limitado y conexiones de red muy restringidas.

[Symbian](https://es.wikipedia.org/wiki/Symbian) fue una de las respuestas más sofisticadas a ese problema.

### La revolución técnica

Symbian fue diseñado específicamente para dispositivos móviles y utilizaba **multitarea preventiva, protección de memoria y mecanismos orientados a reducir el consumo de recursos**. Esta genialidad arquitectónica fue heredada directamente de EPOC32, un sistema operativo creado por la firma británica PSION para sus computadoras de bolsillo.

El sistema estaba pensado para que las aplicaciones utilizaran la memoria de manera disciplinada y para que muchas operaciones se realizaran mediante modelos asíncronos y eficientes.

### Innovación clave

Una de sus ideas más importantes fue el modelo de **Active Objects**, que permitía gestionar operaciones asíncronas de forma eficiente sin depender de un hilo separado para cada tarea.

La filosofía general era sencilla: en un teléfono móvil, cada byte de memoria, cada ciclo de CPU y cada operación de E/S importaban.

No se trataba de liberar cada byte de RAM «en cada microsegundo», sino de diseñar todo el sistema alrededor de la escasez de recursos.

### El legado

Symbian fue durante años la plataforma dominante de los smartphones y demostró que un teléfono podía ofrecer **multitarea, conectividad de datos, aplicaciones complejas y una arquitectura de software relativamente sofisticada** sin disponer de los recursos de un ordenador de escritorio.

Su caída tras la llegada del iPhone y Android no invalida su importancia histórica.

Al contrario: Symbian representa una de las grandes demostraciones de que el diseño de un sistema operativo debe adaptarse radicalmente al hardware y al modelo de uso para el que ha sido creado.

---

# Otros sistemas que cambiaron la historia

El primer sistema operativo práctico de la historia fue el **GM-NAA I/O (1956)**, un sistema de procesamiento por lotes para el IBM 704. Doce puestos no bastan para resumir más de 70 años de innovación en sistemas operativos. Muchos otros proyectos extraordinariamente influyentes han quedado fuera de esta breve lista, como:

**CTSS (Compatible Time-Sharing System, MIT, 1961)** fue uno de los grandes pioneros del *time-sharing*. Permitió que numerosos usuarios interactuaran con un único ordenador al mismo tiempo, una idea fundamental para la evolución posterior de los sistemas multiusuario y que influyó directamente en proyectos como Multics.

**OS/360 (IBM, 1964)** fue uno de los proyectos de software más ambiciosos de su época. Diseñado para una familia completa de ordenadores IBM System/360, ayudó a establecer muchas de las prácticas de ingeniería de software a gran escala y demostró la dificultad de crear un sistema operativo capaz de cubrir desde pequeñas instalaciones hasta grandes centros de cálculo.

**THE operating system (Technische Hogeschool Eindhoven, 1968)**, diseñado por Edsger W. Dijkstra y su equipo, fue pequeño pero extraordinariamente influyente. Introdujo una arquitectura organizada en capas jerárquicas y utilizó mecanismos de protección y sincronización que se convirtieron en referencias fundamentales para la enseñanza y el diseño de sistemas operativos.

**RC 4000 Multiprogramming System (1969)**, desarrollado por Per Brinch Hansen, exploró una arquitectura basada en procesos y comunicación entre procesos que anticipó ideas posteriormente importantes en microkernels y sistemas distribuidos. Su diseño buscaba separar mecanismos fundamentales del sistema de las políticas y servicios que se ejecutaban sobre ellos.

**VM/CMS (IBM, década de 1970)** llevó la idea de la virtualización mucho más lejos que la mayoría de sus contemporáneos. En lugar de ejecutar simplemente varias aplicaciones sobre un mismo sistema operativo, permitía crear múltiples máquinas virtuales independientes sobre un único ordenador físico. La idea de que un ordenador podía comportarse como muchos ordenadores sigue siendo fundamental en los centros de datos modernos y en la computación en la nube.

**MVS (IBM, 1974)** se convirtió en uno de los grandes pilares de la informática empresarial y de los *mainframes*. Su arquitectura de memoria virtual, gestión de cargas de trabajo, seguridad y capacidad para manejar enormes volúmenes de procesamiento hicieron de él una plataforma fundamental durante décadas.

**MINIX (Andrew S. Tanenbaum, 1987)** merece una mención especial por una razón curiosa: su objetivo original era educativo, pero acabó teniendo una influencia indirecta enorme. Tanenbaum diseñó MINIX como un sistema tipo Unix pequeño y pedagógico, con una arquitectura basada en microkernel. Linus Torvalds utilizó MINIX como entorno para desarrollar Linux y, aunque Linux no es un derivado de MINIX, ambos proyectos quedaron unidos para siempre por esa relación histórica.

**Amoeba**, también desarrollado bajo la dirección de Andrew S. Tanenbaum, exploró una visión mucho más radical de los sistemas distribuidos. En lugar de pensar en un ordenador individual como unidad fundamental, trataba un conjunto de máquinas conectadas como un único sistema de recursos. Muchas de sus ideas anticiparon problemas que décadas después serían habituales en los sistemas distribuidos modernos.

**Inferno**, creado por parte del equipo que había desarrollado Plan 9, llevó varias de aquellas ideas a un entorno más compacto y portátil. Su máquina virtual Dis y el lenguaje Limbo fueron diseñados para facilitar la ejecución de aplicaciones distribuidas en diferentes plataformas.

También podrían entrar en esta conversación **Mac OS clásico, OS/2, Solaris, IRIX, HP-UX, AIX, FreeBSD, OpenBSD, Palm OS y webOS**, cada uno con aportaciones importantes a la historia de los sistemas operativos.

Y precisamente esa es la razón por la que este ranking debe entenderse como una selección, no como una clasificación definitiva. La historia de los sistemas operativos está llena de proyectos que no conquistaron el mercado pero introdujeron ideas que reaparecieron años —o incluso décadas— después.

A veces, el sistema operativo más influyente no es el que más ordenadores vende, sino el que introduce una idea que otros tardan décadas en aprovechar.

# ¿Qué tienen todos estos sistemas en común?

Lo más interesante de esta historia es que muchos de los sistemas que más influyeron en la informática **no fueron los que terminaron dominando el mercado**.

Multics anticipó conceptos de protección y seguridad que hoy consideramos fundamentales. UNIX convirtió la simplicidad, la composición de herramientas y la portabilidad en principios de diseño. Xerox Alto y Smalltalk ayudaron a convertir la interfaz gráfica y la programación orientada a objetos en paradigmas prácticos. CP/M contribuyó a separar el software del hardware. VMS demostró cómo construir sistemas empresariales robustos y dejó una huella directa en Windows NT. QNX llevó el microkernel y el tiempo real a aplicaciones donde la tolerancia a fallos resulta esencial. AmigaOS demostró lo que podía conseguir un ordenador doméstico cuando hardware y software se diseñaban conjuntamente. NeXTSTEP convirtió el desarrollo orientado a objetos y las herramientas visuales en una plataforma de producción. Linux transformó no solo el software, sino también la manera de desarrollarlo. Plan 9 llevó la computación distribuida a sus últimas consecuencias conceptuales. BeOS mostró lo que podía conseguir un sistema operativo diseñado desde cero alrededor del multihilo y el multimedia. Y Symbian demostró que la informática móvil exigía reglas completamente diferentes a las de un PC. La historia de los sistemas operativos, en definitiva, no es únicamente la historia de los productos que ganaron. Es también la historia de **las ideas que sobrevivieron a sus creadores**.

Muchas de las tecnologías que hoy parecen obvias fueron consideradas radicales cuando aparecieron por primera vez. Algunas triunfaron inmediatamente. Otras tardaron décadas. Y algunas todavía esperan el momento en que el hardware y las necesidades del mercado permitan descubrir todo su potencial.

# Saber más

* [Multics — Wikipedia en español](https://es.wikipedia.org/wiki/Multics)
* [UNIX — Wikipedia en español](https://es.wikipedia.org/wiki/Unix)
* [Xerox Alto — Computer History Museum](https://computerhistory.org/blog/xerox-alto-source-code)
* [Smalltalk — Computer History Museum](https://computerhistory.org/blog/introducing-the-smalltalk-zoo-48-years-of-smalltalk-history-at-chm)
* [CP/M — Computer History Museum](https://www.computerhistory.org/timeline/1976)
* [OpenVMS — Wikipedia en español](https://es.wikipedia.org/wiki/OpenVMS)
* [QNX — documentación oficial](https://qnx.com/developers/docs/8.0/com.qnx.doc.neutrino.sys_arch/topic/kernel.html)
* [AmigaOS — Wikipedia en español](https://es.wikipedia.org/wiki/AmigaOS)
* [NeXTSTEP — Wikipedia en español](https://es.wikipedia.org/wiki/NeXTSTEP)
* [GNU/Linux - Wikipedia en español](https://es.wikipedia.org/wiki/GNU/Linux)
* [Linux — estadística de familias de sistemas operativos de TOP500](https://www.top500.org/statistics/details/osfam/1)
* [Plan 9 — documentación del proyecto](https://9p.io/plan9/about.html)
* [BeOS — Wikipedia en español](https://es.wikipedia.org/wiki/BeOS)
* [Symbian — Wikipedia en español](https://es.wikipedia.org/wiki/Symbian)

*Para la planificación, estructura y optimización de este texto se utilizaron herramientas de Inteligencia Artificial. La redacción final, los argumentos y la verificación de datos corrieron a cargo del autor.*
