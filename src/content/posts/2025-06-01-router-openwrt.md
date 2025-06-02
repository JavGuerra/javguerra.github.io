---
route: router-openwrt
title: Configurando un router con OpenWRT
description: la segunda vida de un Comtrend AR5387un como punto de acceso
author: JavGuerra
pubDate: 2025-06-01
coverImage:
  image: '@/assets/img/openwrt.png'
  alt: Router Comtrend AR5387un
tags:
  - hardware
  - redes
---

Tenía este viejo router por casa y ya había trasteado con él y OpenWRT, un sistema operativo libre para routers que ofrece muchas posibilidades tanto de configuración como de servicios. En esta entrada verás cómo lo puse a funcionar paso a paso como un punto de acceso de mi red local.

El primer paso consiste en instalar el firmware. Esto es algo que puede hacerse siguiendo las indicaciones de multitud de páginas como [esta](https://tombatossals.github.io/instalar-openwrt/).

# El proyecto

El router [Comtrend AR-5387un](https://wiki.bandaancha.st/Comtrend_AR-5387un) es versátil, pero de reducidas prestaciones, por ejemplo, dispone de poca memoria para instalar software, sus puertos son 10/100 Base-T Ethernet, su única banda es de 2.4 GHz y sólo dispone de un SSID para la red WIFI, por lo que únicamente podremos tener una red a la vez, o la de casa, o la de invitados...

El proyecto OpenWRT ayuda a sacar partido a los routers facilitando el acceso a características que el *firmaware* de los routers de las compañías limitaron y en algunos casos aporta nuevas características no implementadas en el *firmaware* original. Puedes conocer más sobre el Sistema Operativo OpenWRT basado en Linux en [la Wikipedia](https://es.wikipedia.org/wiki/OpenWrt) o en la [página oficial del proyecto](https://openwrt.org/) que también es un Wiki.

En mi caso, he descargado la versión 24.10.0 del firmware. Con ella pretendo que mi router reviva para poder conectarlo al router de mi proveedor de Internet por la parte [WAN](https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_amplia), y conectar a él algunos dispositivos tanto por los puertos Ethernet como por el Wifi a través de la parte [LAN](https://es.wikipedia.org/wiki/Red_de_%C3%A1rea_local), y que los dispositivos conecten a ella mediate el protocolo de identificación [DHCP](https://es.wikipedia.org/wiki/Protocolo_de_configuraci%C3%B3n_din%C3%A1mica_de_host).

## Accediendo

Por defecto, el router con el nuevo firmware se va a comportar como un *swich* administrado. Para acceder a él, conectando un cable de red entre mi PC y el router y puse la dirección http://192.168.1.1 en mi navegador web. La interfaz que se mostrará no soporta el protocolo HTTPS en ese momento (luego lo cambiaremos), por lo que uso la opción de navegación de incógnito para poder acceder sin que el navegador me cambie HTTP por HTTPS.

El usuario por defecto es `root`, y la contraseña es `admin`.

Una vez dentro, lo primero es cambiar la contraseña. Para ello hay que hacer clic en la franja amarilla superior que nos avisa de la necesidad de cambio de contraseña, y en el formulario al que nos llevará, pondrás dos veces la nueva contraseña.

Luego, en `System > Administration > HTTP(S) Access`, podrás marcar la opción `Redirect to HTTPS` para que, cuando queramos acceder las siguientes veces al panel de administración, ya podamos hacerlo mediante el protocolo seguro HTTPS. Tardará un poco en aplicar los cambios y te pedirá si seguir con ellos o revertirlos. Dale a `Apply unchecked`.

Como mencioné, por defecto, el router viene configurado para funcionar como un *swich*. En `Network > Interfaces` encontrarás el interface `lan` como dispositivo `swich.1`.

Podemos configurar aquí su dirección `IPv4` mediante `Edit`, y de esta forma darás una nueva dirección IP al router OpenWRT para poder funcionar en el rango de las direcciones DHCP que sirve el router de tu proveedor, o asignarle una IP estática.

Después de guardar, debes darle al botón `Save and apply` para que los cambios se apliquen. Ahora tu router estará integrado en tu red y los dispositivos conectados a él tendrán acceso a Internet, pues esta Interfaz tiene configurado el servicio DHCP por defecto. Así de fácil.

## Separando la red WAN y la red LAN

En mi caso, quiero separar las redes WAN y LAN. Para ello debo crear una nueva Interface de red que llamaré `wan`o como desees llamarla.

Mi router no tiene puerto de red WAN, por lo que debo indicar a OpenWRT cual de los cuatro puertos LAN de que dispone dedicaré a WAN. Para ello en `Network > Interfaces > Devices`, configuro el dispositivo `swich` mediante `Configure...` y en `Bridge ports` desmarco `lan1`, que es el puerto lan del router que he elegido usar para la conexión al router de casa, osea, para WAN, para que esté libre.

Después de guardar, le doy al botón de `Save and apply`.

Como el interface `wan` va a usar una IP dentro del rango del router de casa, cambio la IP que servirá para la red `lan` para crear otro rango de IPs. Por ejemplo, si la red de casa comienza en `192.168.1.1`, la red del OpenWRT la puedo configurar como `192.168.2.1`, dejando la red 1 para la wan y la red 2 para la lan.

Recuerda que, con cada cambio de IP del OpenWRT, deberás volver a conectarte a la nueva dirección en tu navegador.

Ahora ya puedo crear la interfaz wan en `Network > Interfaces`, pestaña `Interfaces`.

En mi caso usé:

- **Protocol**: `Static address` para seleccionar la IP de OpenWRT en la red del router de casa.
- **Device**: `lan1`, el puerto que dediqué a la red WAN.
- **IPv4 address**: una IP dentro del rango de las IPs de tu router de casa.
- **IPv4 netmask**: `255.255.255.0`
- **IPv4 Gateway**: la IP de tu router de casa, por ejemplo `192.168.1.1` o el que corresponda.
- **DNS**: En `advances settings`, en `Use cumstom DNS servers` puse las [DNS](https://es.wikipedia.org/wiki/Sistema_de_nombres_de_dominio) de Google: `8.8.8.8` y `8.8.4.4`, pero puedes usar tus preferidas o las de tu proveedor.
- **Sin DHCP**: En `DHCP Server`, en `General Setup`, me aseguré de que `Ignore interface` está marcado, desactivando de esta forma el servicio DHCP en esta Interface, y le doy a `Save`.

Después de guardar, le doy al botón de `Save and apply`, y así se guardarán los cambios realizados en las interfaces de red `lan` y `wan`.

## Comprobaciones

En `Status > Routing`, en `Active IPv4 Routes`, deberían salir tres rutas, dos wan y una lan. Una wan con Target `0.0.0.0/0`, con Gateway que apunta a la IP del router de casa y otra con el Target `192.168.1.0/24` (por ejemplo). Y una lan con el Target `192.168.2.0/24`.

Si la primera wan no sale así automáticamente, habría que crear la ruta desde `Network > Routing` mediante `Add`. con `Interface: wan`, `Route type: unicast`, `Target: 0.0.0.0/0` y `Gateway: 192.168.1.1` en este caso. De esta forma le decimos al router que cree un puente entre la wan y la lan para que el tráfico entre ambas redes sea posible. 

En `Network DHCP and DNS`, en `General`, asegúrate de tener marcado `Authoritative`, para que el servidor DHCP que tengan en cuenta los dispositivos de la red conectados al router OpenWRT sea el de la red propia y no el del router del proveedor, en este caso la del rango `192.168.2.x`.

En `Network > Firewall` asegúrate de que en `Zones` aparece `lan -> wan -> REJECT all others` con `Input: accept`, `Oputput accept` e `Intra zone: accept` con `Masquerading: desmarcado`.
Asegurarse también que aparece `wan -> REJECT` con `Input: reject`, `Output: accept`, `Intra zone: reject` y `Masquerading: marcado`.
Mediante `Edit`, en cada red, en `Covered network`, debe aparecer `lan` en la zona lan y `wan` en la zona wan.

Llega el momento de apagar el router, conectar el cable de red hacia el router de casa en el puerto `lan1`, y el cable de red de tu ordenador en cualquiera de los otros puertos lan. Tras ello, enciende el router.

Una vez encendido, el OpenWRT debe asignar una IP en el rango `192.168.2.x` al ordenador (o la dirección que corresponda a la IP de la lan del OpenWRT), y desde él debe ser posible navegar por Internet. Si algo no ha ido bien, accede a la interfaz en la dirección `https://192.168.2.1` de este ejemplo, y revisa la configuración. En el peor de lod casos, *resetea* el router y vuelve a empezar. Con la práctica y mucha paciencia acabará saliendo.

# Configurar el WIFI

Como sabes, este modelo no soporta múltiples SSID, por lo que, de necesitar crear varias redes WIFI, se deberá cambiar manualmente entre, por ejemplo, la red para uso privado en casa y la red de Invitados.

Para crear o actualizar la red, ve a `Network > Wireless`, y haz clic en Add (o Edit en una interfaz existente, como radio0).

Configuración básica:
- **Mode**: Access Point (AP).
- **ESSID**: Nombre de tu red WiFi (p. ej.: `MiRedOpenWRT`).
- **Network**: Selecciona la interfaz LAN (p. ej.: `lan1`).

En el apartado `Seguridad`configura los parámetros de conexión:
- **Encryption**: `WPA2-PSK` (recomendado).
- **Key**: Contraseña de la red (mínimo 8 caracteres).

Luego, ya sabes, Guardar/Aplicar.

Tras esto prueba la conexión, y/o reinicia si es necesario.

# Otras configuraciones

Haré uso del repositorio de paquetes desde el que descargar lo que necesito.

Para conectar con el repositorio de paquetes es necesario que, antes de ello, el sistema esté en hora correcta. Ve a `System > System Time Synchronization` y haz clic en `Sync with NTP-Server`. Sin este paso no podrás instalar paquetes.

## Configurando el idioma

Para que la interfaz de OpenWRT llamada `Luci` esté en español, deberás instalar el paquete `luci-i18n-base-es`, para ello hay que ir a `System > Software`, en `Actions`, hacer clic, en `Update lists`, y tras terminar la descarga de las listas, usar `Filter` para buscar el paquete mencionado en el apartado `Available`. Luego haremos clic en `Install...` Esto instalará algunos paquetes de idiomas relacionados.

Tras instalar el paquete, si la interfaz no se muestra en español, podremos seleccionar el idioma en `System > System > Languaje and Style`. En el desplegable de `Languaje` tendremos disponible `Español (Spanish)`. Tras seleccionarlo, hay que darle a `Save & Apply`.

## Actualizar el sistema

Hay una serie de paquetes que van a requerir actualización. Desde `Sistema > Software` puedes hacerlo en `Actualizaciones`.

También puedes hacerlo desde el terminal accediendo al router con SSH. Seamos atrevidos. Tras entrar en el router mediante este protocolo:

Listar todos los paquetes actualizables.
`opkg list-upgradable`

Actualizarlos:
`opkg upgrade $(opkg list-upgradable | cut -f 1 -d ' ')`

Para actualizar sólo paquetes específicos:
`opkg upgrade nombre-del-paquete`

Los paquetes descargados se guardan en `/var/opkg-lists/` y `/tmp/`. Para recuperar espacio, puedes borrarlos con:

```
rm -rf /var/opkg-lists/*  # Listas de paquetes (no los paquetes instalados)
rm -rf /tmp/opkg-*        # Archivos temporales de opkg
```

Para encontrar paquetes instalados que ya no son necesarios:
`opkg list-installed | awk '{print $1}' | xargs opkg depends | grep "not installed"`

Si encuentras paquetes que ya no usas, elimínalos:
`opkg remove nombre-del-paquete-innecesario`

Para ver el espacio de almacenamiento usado, emplea:
`df -h /`

Es conveniente revisar las actualizaciones cada cierto tiempo, ya que OpenWRT no te avisará de las nuevas versiones de paquetes disponibles.

# Compartir contenido del USB

Por alguna razón, desde la interfaz Lucy no he podido instalar los paquetes que permiten compartir un dispositivo de almacenamiento conectado al puerto USB de mi router como un disco duro. Para ello he tenido que acceder por SSH mediante un terminal con `ssh root@192.168.2.1`. La contraseña es la misma que en Luci.

Mi intención era instalar un servidor Samba, pero dado el reducido tamaño de la memoria de almacenamiento del OpenWRT, he descartado esta idea. Las opciones alternativas son tres: montar un servidor WEB ligero, montar un sistema de ficheros NFS o montar un servidor FTP.

AL servidor NFS sólo podré acceder desde Linux, no desde Windows, al menos no sin hacer instalaciones complementarias en Windows. Por su parte, el servidor FTP requiere el uso de software específico para acceder al contenido, así que me he quedado con la opción del servidor WEB. Esto se consigue instalando el servicio `uHTTPd`.

Para ello he usado este comando para cargar la lista de paquetes:
`opkg update`

para instalar los paquetes necesarios:
`opkg install uhttpd block-mount kmod-usb-storage kmod-fs-vfat`

Para montar el USB:
`mkdir -p /mnt/usb`

para crear la carpeta donde se compartirá el usb y montar el dispositivo:
`mount /dev/sda1 /mnt/usb`

Se entiende que el USB está en la ruta `/deb/sda1`, de no ser así, esto debe cambiarse adecuadamente.

A continuación hay que crear un enlace simbólico para acceder via web:
`ln -sf /mnt/usb /www/usb`

esto creará la ruta usb en el servidor web.

Y ya será posible acceder desde cualquier dispositivo a través de su dirección IP y ruta:

`http://192.168.2.1/usb`

La IP, por supuesto, será aquella que hayas configurado en la interfaz lan.

Las ventajas de este servidor es que ocupa 10 veces menos espacio que Samba y el protocolo es compatible con cualquier dispositivo cliente que cuente con un navegador web (móviles, Smart TVs, etc.).

Como el dispositivo es de solo lectura, no requiere autenticación, pero esto limita significativamente las posibilidades de actualizar contenido remotamente.

# Copia de seguridad

Ya que has llegado hasta aquí, haz una copia de seguridad para salvaguardar tu trabajo. Ve a `Sistema > Copia de seguridad / Instalar firmaware` y haz clic en el botón `Generar archivo` en `copia de seguridad`. De hecho, es una buenas idea ir guardando estos cambios a medida que hacemos las configuraciones, para poder ahorrarnos pasos repetidos en caso de tener que *resetear* el router.

# Otros servicios

A través de la página de OpenWRT y en Internet puedes conocer otras posibilidades de este Sistema Operativo basado en Linux, que, salvando sus limitaciones de espacio y hardware, permite todo aquello que se te pase por la cabeza basado en el modelo cliente-servidor. Te invito a que lo descubras.

# Enlaces

- [OpenWRT en Wikipedia](https://es.wikipedia.org/wiki/OpenWrt)
- [Página oficial de OpenWRT]()
- [Instalar OpenWRT](https://tombatossals.github.io/instalar-openwrt/)
- [Comtrend AR-5387un](https://wiki.bandaancha.st/Comtrend_AR-5387un)
- [Comtrend AR-5387un en OpenWRT](https://openwrt.org/toh/comtrend/ar-5387un)
- [Comtrend AR-5387un Manual](https://es.scribd.com/document/596792298/AR-5387un-Manual-de-Usuario-AR-5387-UN-Router)