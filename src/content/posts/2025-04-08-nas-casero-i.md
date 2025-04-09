---
route: nas-casero-i
title: Montando un NAS casero (I)
description: El hardware
author: JavGuerra
pubDate: 2025-04-08
coverImage:
  image: '@/assets/img/nas_caja.webp'
  alt: Caja Jonsbo N4 con discos duros
tags:
  - hardware
---

Necesitaba un NAS casero para almacenar con seguridad mis ficheros. De hecho es un proyecto que tenía en mente desde hace años, pero, por falta de tiempo y de recursos, no me he puesto a ello. Bien, el momento ha llegado, y en esta entrada te cuento cómo lo estoy haciendo.

Al terminar de leer tendrás una idea general de lo que necesitarás si tú también te animas a construir tu propio NAS casero para evitar que tus datos se pierdan por accidente por no tenerlos a salvo.

# NAS

Para los que no conozcan, un [NAS](https://es.wikipedia.org/wiki/Almacenamiento_conectado_en_red) (Network Attached Storage) es un sistema de almacenamiento que, principalmente, permite a los usuarios acceder a sus archivos desde cualquier dispositivo de la red, y almacenar sus datos de forma segura o compartirlos. Permite además generar snapshots de los datos, para poder restaurar versiones anteriores delos archivos a cualquier momento.

Con distribuciones Linux como [TrueNAS](https://www.truenas.com/truenas-community-edition/) u [Open Media Vault](https://www.openmediavault.org/) se puede montar un dispositivo de almacenamiento en red versátil, pero es un reto armar el rompecabezas de software y hardware necesario si uno deja atrás los sistemas todo en uno de marcas como Synology, QNAP, etc, y se decide a montar su propio dispositivo. 

Un NAS casero tiene otras ventajas. Ya que el dispositivo es un ordenador completo, puede albergar otros servicios, por ejemplo servidores, máquinas virtuales y/o contenedores que estarán disponibles para los usuarios de la red. El NAS se convierte entonces en un servidor casero de posibilidades ilimitadas.

Hablaremos del software y su configuración en una siguiente entrega de esta serie.

# Requisitos

El NAS va a estar encendido 24/7. Estará ubicado en un mueble auxiliar de mi mesa de trabajo, en un espacio reducido, y debe tener la potencia suficiente como para alimentar los discos duros que iré incorporando en él para el almacenamiento de los datos.

Esta máquina debe ser capaz de funcionar también como servidor web, servidor de contenedores y de máquinas virtuales.

Por todo lo expuesto, el equipo debe ser lo más silencioso posible, de unas dimensiones específicas (capaz caber en una estantería IKEA con hueco de 33x33cm) pero que la caja permita su adecuada ventilación.

El precio también es un factor importante. Sin escatimar en componentes críticos, el coste final del equipo, sin discos duros, no superará los 600€.

# Hardware

El equipo va a necesitar una caja adecuada, su placa base, memoria RAM suficiente, procesador, disco del sistema, tarjeta gráfica, cooler de CPU y fuente de alimentación, que detallo a continuación.

## Caja

La caja elegida es una [Jonsbo N4 White](https://www.jonsbo.com/en/products/N4White.html) como la que se muestra en la foto de esta entrada. La he adquirido en la tienda [Xtremmedia](https://www.xtremmedia.com/) por 119,09€.

Elegí el color blanco porque es el que mejor se mimetiza con la estantería. Esta caja tiene bahías para 6 HDD y dos SSD. está preparado para hot swapping de discos, incluye ventilador trasero de 120mm y tiene las medidas perfectas para el espacio donde va a ir ubicado: 286mm(ancho) * 300mm(profundidad) * 228mm(altura). Esto permite un espacio de 100mm en la parte superior para disipar calor y un poco más de 20 milímetros en los laterales. En la parte trasera dispone también de unos 100mm de espacio.

## Procesador

El equipo va a requerir la ejecución de varios procesos en paralelo. un procesador actual se me va de precio, pero es posible encontrar procesadores XEON de segunda mano a un precio razonable. Estos procesadores se usaron en su momento en servidores, y fueron sustituidos por versiones nuevas del procesador, y puestos a la venta para una nueva vida. En [Aliexpress](https://es.aliexpress.com/) es posible encontrarlos muy baratos. algunos por menos de 10€. No son procesadores para jugar, pero si para multiproceso.

En mi caso buscaba además un procesador que no consumiese mucho, ya que el equipo va a estar encendido todo el tiempo, y a mayor consumo más calor a disipar, lo que se traduce en mayor ruido de ventiladores para refrescarlo.

Elegí un [Intel XEON E5-2650L v4](https://www.intel.la/content/www/xl/es/products/sku/91752/intel-xeon-processor-e52650l-v4-35m-cache-1-70-ghz/specifications.html) de 14 núcleos y 28 subprocesos, con un consumo de 65W y una frecuencia básica del procesador de 1,70 GHz. Lo compré en Aliexpress por 52,99€. Su frecuencia de reloj quizá no impresione, pero su consumo y número de núcleos es imbatible en su gama, y para un NAS es más que adeciado.

## Placa base

![ASRock X99M Extreme4](@/assets/img/nas_placa.jpg)

Dado que la caja soporta placas base en formato micro ATX, y necesitaba una placa para el procesador mencionado, lo lógico era buscar una específica para NAS, pero estas son caras, incluso de segunda mano. La alternativa era una placa de una marca de calidad, a un precio ajustado. Entre las opciones de segunda mano de Aliexpress encontré la [ASRock X99M Extreme4](https://www.asrock.com/mb/intel/X99M%20Extreme4/index.la.asp) que se ve en la imagen. Esta es una placa para el bus LGA2011-3, compatible con el procesador elegido, y con un precio asequible de 121,39€.

ASRock es una marca de calidad, y la placa tiene todo lo que busco, aunando así fiabilidad y potencia.

## Memoria RAM

Un equipo que va a lanzar contenedores, máquinas virtuales, servidores y atender el trasiego de datos de la red necesita memoria suficiente. También acudí a Aliexpress, y adquirir memoria barata, aunque esta vez sin usar.

Javier, un amigo, me recomendó la marca Kllisre. Su precio es algo menos de la mitad que las marcas conocidas, pero esto me permite comprar más memoria por menos dinero, y al tener la referencia de alguien que las ha probado, me quedo tranquilo.

Adquirí 4 módulos de 16GB DDR4 2400 ECC de esta marca por unos 92,99€. En total son 64GB de RAM para servidor, con control de errores.

La memoria RAM ECC (Error Correcting Code) incluye circuitos especiales para comprobar la exactitud de los datos que se leen y escriben en ella. Las correcciones necesarias se realizan simultáneamente, sobre la marcha, lo que aporta integridad y fiabilidad al sistema, siendo muy adecuada para NAS, estaciones de trabajo y servidores en general, como en este caso.

## Disco duro

El disco de sistema irá instalado en placa, y es un NVMe de 500GB de tercera generación que he rescatado de un portátil al que he ampliado la capacidad de disco duro. su coste ha sido cero euros en este caso.

## Tarjeta gráfica

La tarjeta gráfica también me ha salido gratis. Juanjo, un amigo, me ha facilitado una tarjeta una ATI 7000 de perfil bajo, con disipador (sin ventilador) que encaja perfectamente en la caja.

Es una tarjeta gráfica muy superada hoy día, pero es lo mínimo necesario para poder arrancar el ordenador, configurar la BIOS e instalar el sistema operativo. Después de eso, el ordenador va a estar sin pantalla, y se gestionará a traves de un panel administración web. tampoco necesitaré teclado una vez instalado el software.

## Cooler

A parte de la caja, el cooler o disipador de la CPU y la fuente de alimentación han sido adquiridos pensando en su máximo rendimiento y bajo ruido, y en este caso son productos a estrenar.

El disipador de la CPU elegido es un [Noctua NH-L12S](https://noctua.at/es/nh-l12s), de bajo perfil, que no supera los 70mm de altura, con un ventilador de 120mm de bajo ruido. Lo he adquirido en Amazon por 69,90€.

Este disipador es muy reputado, y es más que suficiente para el procesador elegido.

## Fuente de alimentación

La otra opción de bajo ruido es la fuente de alimentación. En este caso, atendiendo a que la caja soporta fuentes de tamaño SFX, he optado por la [Be Quiet! SFX L Power 600W 80 Plus Gold Modular](https://www.bequiet.com/es/powersupply/1554). La he adquirido en Xtremmedia por 123,49€.

La fuente mencionada es SFX L, que tiene medidas mayores, pero en en este caso apenas supera en 5mm de profundidad las medidas de SFX, por lo que cabe en la caja perfectamente.

Este modelo concreto, y que sea 80 Plus Gold marcan la diferencia de calidad, potencia y bajo ruido que busco. Posiblemente con 500W hubiera sido suficiente, pero considero que será necesaria más potencia para futuras ampliaciones, y una potencia mayor en esta fuente hará que el ventilador, que también es de 120mm, se encienda menos. 

## Cableado

El cableado viene incorporado en la caja y la fuente de alimentación. Seguramente esto encarecerá el coste final, pero en mi caso voy a usar cables de los que ya dispongo o de amigos al os que le sobre, por lo que no contabilizo este gasto.

# El precio final

El coste final del equipo es de 591,77€, justo en el límite de los 600€ estimados, no obstante, el gasto en hardware no está completo. Véase que no he incluido en la lista los discos duros HDD y los SSD para los servicios. Estos se comprarán en el futuro, y echando cálculos, tres discos duros de 8TB y un disco SSD pueden estar en torno a los 650€. Este es un coste mayor que el propio ordenador.

El precio del ordenador completo este año será de 1.250€ aprox. Más adelante, con la incorporación de nuevos discos (tres HDD más y 1 SSD más), el equipo puede llegar a los 1.900€.

Ciertamente, si se requiere comprar tarjeta gráfica y disco NVME el precio también se incrementará, por lo que el coste inicial puede rondar los 750€ perfectamente. Eso sí, siempre se puede montar un NAS más barato, usando componentes menos exclusivos si tu prioridad no es el bajo ruido, o si tienes espacio suficiente para comprar una caja y componentes comunes que son más baratos. Incluso puedes montar un NAS casero reaprovechando un viejo ordenador o usando una Raspberry Pi. Lo interesante aquí es encontrar la solución adecuada tanto a las necesidades de almacenamiento como a las de tu bolsillo.

# Conclusiones

Se ha conseguido un precio ajustado sin renunciar a capacidad, potencia, calidad y posibilidades de ampliación, eligiendo cuidadosamente los componentes y el diseño del equipo.

Para la obtención de información, además de sugerencias de amigos, me he basado en la información proporcionada por la IA [deepseek](https://www.deepseek.com/zh) tan famosa estos días, y otras IAs como [Mistral](https://chat.mistral.ai/chat) o [Phind](https://phind.com/).

Los siguientes pasos son el montaje, la configuración y la instalación del sistema operativo.
