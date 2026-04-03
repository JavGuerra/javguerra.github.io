---
route: conversor-thunder-postman
title: De Thunder a Postman
description: Conversor universal para migrar colecciones API sin perder estructura
author: JavGuerra
pubDate: 2026-04-02
coverImage:
  image: '@/assets/img/thunder-postman.png'
  alt: Logos Thunder Client, Postman y Bruno
tags:
    - API
    - JSON
    - herramienta
    - código
    - JavaScript
    - Node.js
---

Necesitaba migrar colecciones de API desde **Thunder Client** (una extensión de VS Code) a **Bruno** (cliente API), pero Bruno no importa directamente colecciones de Thunder Client. Sin embargo, Bruno sí importa colecciones de Postman. Así que creé este script que convierte cualquier colección exportada de Thunder Client al formato estándar de **Postman Collection v2.1.0**, permitiendo importarla en Bruno (o Postman) sin perder carpetas, autenticación, archivos ni estructura. En esta entrada te explico cómo funciona el script.

## ¿Qué es Bruno?

[Bruno](https://www.usebruno.com/) es un cliente de API de código abierto, offline y respetuoso con la privacidad. A diferencia de otras herramientas, no requiere cuenta, no sincroniza tus colecciones en la nube y todos los datos se guardan localmente en tu ordenador. Es rápido, ligero y perfecto para equipos que priorizan la seguridad y el control de sus propios archivos.

## Planteamiento

Thunder Client exporta las colecciones en un formato JSON propio. Postman y Bruno usan otro formato diferente. El script actúa como un "traductor" que lee el JSON de Thunder Client, lo interpreta y genera un JSON válido para Postman, conservando:

- Las peticiones (GET, POST, PUT, DELETE, etc.)
- Las carpetas y subcarpetas
- Los headers, autenticación y cuerpos de las peticiones
- Los archivos adjuntos en formularios

Puedes descargar el script desde el: [<button>Repositorio del conversor</button>](https://github.com/JavGuerra/conversor-thunder-postman)

## Dificultades de la conversión

**Estructura inconsistente del JSON de Thunder Client**  
Las exportaciones no siguen un formato fijo: las peticiones pueden estar en `requests`, en `items`, en `tests` o en arrays con nombres personalizados como `requests_carpeta_auth`. El script tuvo que aprender a buscar en cualquier lugar.

**Carpetas anidadas sin un identificador claro**  
Thunder Client a veces usa `parentId`, otras veces `_parentId`, o simplemente anida objetos. Reconstruir la jerarquía a cualquier nivel requirió una función recursiva robusta.

**Variables en URLs**  
Thunder Client permite `{{variables}}` en las URLs. Si intentas parsear la URL con `new URL()`, el script falla. Hubo que detectar y proteger estos casos.

**Autenticación dispersa**  
La autenticación puede venir en un bloque `auth` o directamente en los headers. Además, hay que soportar Bearer, Basic y API Key (que puede ir en header o en query param).

**Archivos en formdata**  
Los archivos no se representan como strings simples, sino como objetos con ruta o strings especiales (`@/ruta`). Hay que identificarlos y convertirlos al formato que espera Postman.

**Headers con espacios**  
Algunos headers exportados tenían espacios al inicio o final del nombre, lo que provocaba errores en Bruno. Hubo que limpiarlos con `trim()`.

**BOM en archivos Windows**  
Los archivos exportados desde Windows incluyen una marca de orden de bytes (BOM) invisible que rompe el parseo JSON. Hubo que detectarla y eliminarla.

## El script paso a paso

### 1. Lee el archivo de entrada
El script recibe como parámetro el archivo JSON exportado desde Thunder Client. Verifica que el archivo existe y que es un JSON válido. Si el archivo tiene BOM (marca de orden de bytes típica de Windows), lo elimina automáticamente para evitar errores.

### 2. Extrae todas las peticiones
Busca las peticiones en **cualquier lugar** del JSON: en la raíz, dentro de carpetas, en arrays con nombres personalizados, etc. No importa cómo haya estructurado Thunder Client la exportación.

### 3. Extrae la estructura de carpetas
Identifica las carpetas y subcarpetas, detectando sus identificadores (`folderId`, `parentId`) para reconstruir la jerarquía original, incluyendo **subcarpetas anidadas a cualquier nivel**.

### 4. Convierte cada petición individualmente
Para cada petición, traduce:

- **URL**: La segmenta en partes (host, path, query params) para Bruno, pero respeta las variables `{{variable}}` sin intentar parsearlas.
- **Headers**: Los mantiene y limpia espacios accidentales.
- **Autenticación**: Soporta Bearer Token, Basic Auth y API Key (tanto en header como en query param).
- **Cuerpo (body)**: Maneja JSON (con resaltado de sintaxis), formularios multipart (con detección automática de archivos) y urlencoded.

### 5. Construye la colección Postman
Reconstruye la jerarquía completa usando recursividad: carpetas raíz, subcarpetas y peticiones en su lugar correspondiente. Si la exportación no incluye identificadores, usa un método alternativo como respaldo.

### 6. Guarda el resultado
Escribe el archivo JSON en el formato estándar de Postman Collection v2.1.0, listo para importar.

### 7. Muestra estadísticas
Al finalizar, informa sobre cuántas peticiones y carpetas se han convertido.

## El resultado: características principales destacadas

| Característica | Qué hace |
|----------------|----------|
| **Jerarquía completa** | Respeta carpetas y subcarpetas anidadas a cualquier nivel |
| **Búsqueda exhaustiva** | Encuentra peticiones estén donde estén en el JSON |
| **Autenticación múltiple** | Bearer, Basic y API Key (header o query) |
| **Soporte para archivos** | Detecta y convierte campos de tipo file en formularios |
| **Compatibilidad con Bruno** | Segmenta el host y limpia rutas para importación perfecta |
| **Resaltado JSON** | Configura los cuerpos JSON para que se vean con colores |
| **Manejo robusto** | Valida archivos, limpia BOM, muestra errores claros |
| **Sin dependencias** | Usa solo módulos nativos de Node.js |


## Ejemplo de uso

```bash
node convertir-thunder-a-postman.js prueba-thunder.json coleccion-postman.json
```

**Salida esperada:**
```
✅ Conversión completada con éxito.
🚀 Fichero generado: coleccion-postman.json
📊 Peticiones: 24 | Carpetas: 7
```

## Limitaciones del script

- **Variables de colección**: No se importan automáticamente (deben recrearse a mano)
- **Scripts pre-request y tests**: No se convierten (la API es compatible, pero hay que copiarlos manualmente)
- **Autenticación avanzada**: OAuth 2.0, AWS Signature y Digest no están soportados

## Enlaces

- [Repositorio desde donde descargar el conversor](https://github.com/JavGuerra/conversor-thunder-postman)
- [Cliente Bruno](https://www.usebruno.com/)
