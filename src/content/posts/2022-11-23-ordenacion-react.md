---
route: ordenacion-react
title: Ordenando resultados en React
description: Listando alternativamente, por distintos criterios, la información de menor a mayor y viceversa.
author: JavGuerra
pubDate: 2022-11-23
coverImage:
  image: '@/assets/img/dalton.jpg'
  alt: Ordenación
tags:
  - React
  - JavaScript
---

Cuando mostramos al usuario un listado con muchos resultados totales, le estamos dando también un problema. Buscar la información que necesita entre tantos resultados requiere tiempo y esfuerzo. Para atajar este problema podemos incluir un campo de búsqueda, pero aún así, la información aparecerá desordenada. En esta entrada veremos como ordenar los resultados de menor a mayor y viceversa, y cómo hacerlo por varios criterios alternativamente en React. 

# El ejemplo

Esta entrada está basada en el [proyecto «Tienda 8 bits»](proyecto-final-bootcamp), y aquí puedes ver su funcionamiento en esta [página de ejemplo](https://javguerra.badared.com/proyecto/tienda8bits/).

Queremos listar una serie de fichas de productos por tres criterios, modelo de producto, precio y año de fabricación, y lo haremos alternativamente, es decir, por uno de entre esos tres criterios de ordenación cada vez.

La ordenación se hará de menor a mayor, osea, en orden ascendente, y de mayor a menor, en orden descendente. La API de este ejemplo debe estar preparada para ello, aunque no me pararé a mostrar eso en esta entrada.

Los filtros, en la página, tendrán un aspecto parecido a este:

![Filtros](@/assets/img/filtros.png)

En este caso, el primer filtro de ordenación, el de modelo, es el que está seleccionado, y la ordenación la realiza en orden ascendente. Los otros dos filtros no están activos.

# La App

En nuestra página App.jsx, para este ejercicio, voy a definir dos _useState_, uno que contendrá los filtros de ordenación en un objeto y otro que contendrá el valor de la página actual de los resultados paginados (grupos de resultados) que vamos a mostrar.

``` javascript
const [sortData, setSortData] = useState({ sortmodel: 1 });
const [currentPage, setCurrentPage] = useState(1);
```
En una aplicación completa deberemos incluir otros useState para, por ejemplo, guardar los datos obtenidos de la consulta a la API, o los criterios de búsqueda de datos... En este ejercicio me limito a incluir los que son operativos para la explicación.

Dentro del objeto que tendremos en `sortData` iremos incluyendo, alternativamente, `sortmodel` para filtrar por el modelo, `sortprice` para filtrar por el precio, y `sortyear` para filtrar por el año. Sólo uno de ellos a la vez. Los valores posibles para cada una de estas propiedades de filtrado serán `1` y `-1`, siendo 1 el valor que indica ordenación ascendente, y -1 el valor que indica ordenación descendente, que son los valores que acepta nuestra API.

```javascript
useEffect(() => {
    const { sortmodel, sortprice, sortyear } = sortData;

    // Preparar los datos para la consulta a la API
    // Realizar la consulta a la API y obtener (set) los resultados
    
}, [sortData, currentPage]);
```
Cuando el objeto almacenado en `sortData` cambie por la interacción con el usuario, al seleccionar otro criterio de ordenación, entrará en juego la función `setSortData`, y el contenido dentro de `useEffect` se ejecutará, pasando los datos de filtrado `sortData` a la petición a la API mediante fetch, axios... Los datos deben ser preparados antes de hacer la consulta, y para ello, deberemos comprobar cual de los tres filtros (sortmodel, sortprice, sortyear) está seleccionado y cuales no (_undefined_), e incluir el filtro indicado en la consulta.

El componente que va a llevar a cabo la ordenación se llama `Sort`, y esta sería la llamada para renderizarlo en la página:

```javascript
return (
    <Sort
        sortData={sortData}
        setSortData={setSortData}
        setCurrentPage={setCurrentPage}
    />
);
```
Por _props_ le hacemos llegar al componente Sort los datos de filtrado (sortData), la función que establece (set) el filtrado (setSortData) y la función que establece la página actual (setCurrentPage). Esto último es necesario porque cada vez que cambie el filtrado estableceremos la página 1 como la página actual, de otra forma los datos obtenidos con el nuevo filtrado se mostrarían confusos para el usuario.

## El componente Sort

El código del componente será el siguiente, e iré explicando cada parte a continuación:

``` javascript
import SortIcon from "./SortIcon";

const Sort = ({sortData, setSortData, setCurrentPage}) => {

  const { sortmodel, sortprice, sortyear } = sortData;

  const handleIcon = (sortName, order) => {
    setSortData({ [sortName]: order ? -order : 1 });
    setCurrentPage(1);
  };

  return (
    <ul>
      <li onClick={() => handleIcon("sortmodel", sortmodel)}>
        Modelo <SortIcon order={sortmodel} />
      </li>

      <li onClick={() => handleIcon("sortprice", sortprice)}>
        Precio <SortIcon order={sortprice} />
      </li>

      <li onClick={() => handleIcon("sortyear", sortyear)}>
        Año <SortIcon order={sortyear} />
      </li>
    </ul>
  );
}

export default Sort;
```

Primeramente importo el componente `SortIcon` que luego veremos. Éste componente se encargará de mostrar el icono de ordenación de cada uno de los tres criterios.

Como dije, el componente `Sort` recibe por props tres parámetros `{sortData, setSortData, setCurrentPage}` con el dato de ordenación, la función para fijar la nueva ordenación y la función para fijar la página actual de la paginación de resultados.

Lo primero que hago es obtener los datos del objeto `sortData` recibido por props. Por supuesto, sólo uno de los tres datos va a tener valor. Los otros dos, que no son el criterio de filtrado seleccionado, tendrán valor _undefined_.

La función `handleIcon` será la encargada de efectuar el cambio de filtro de ordenación. La muestro después con detalle.

A cada `sortIcon`, en el renderizado, le paso el valor de `order`, que contiene el valor de ordenación del filtrado (1 ó -1). 

Al hacer click en cualquiera de los tres criterios de ordenación en la página, la función `handleIcon` dentro de  `onClick={() => handleIcon("nombre_del_filtro", variable_de_ordenación)}` se ejecuta, con los parámetros `"nombre_del_filtro"` y `variable_de_ordenación`, lo que permite hacer el cambio en la ordenación, disparando el `useEffect` de App.jsx, y provocando que los productos listados se actualicen.

## La función handleIcon

Aquí es donde se lleva a cabo todo.

```javascript
const handleIcon = (sortName, order) => {
    setSortData({ [sortName]: order ? -order : 1 });
    setCurrentPage(1);
};
```
La función recibe dos parámetros, `sortName`, con el nombre del filtro seleccionado en función del icono (SortIcon) en el que se haga clic, y `order`, con el valor de ordenación de ese filtro (1 ó -1).

Con la función `setSortData`, que recibí por props, voy a fijar el criterio de ordenación y su valor.

Con `[sortName]:` dentro del objeto que voy a pasar a `setSortData` para cambiar `sortData` indico que la propiedad se tiene que llamar como el nombre del filtro recibido en `sortName` (que puede ser uno de estos tres: "sortmodel", "sortprice" o "sortyear"). Con los corchetes consigo que el texto recibido sea el nombre de la propiedad.

Con `order ? -order : 1` determino el valor de la propiedad del objeto que voy a pasar a `setSortData`. Si el valor de order existe, es decir no es `undefined`, y por tanto es el criterio de ordenación actual, su valor ahora será el valor alternativo (positivo o negativo) al que ya tiene. Si el valor era 1, ahora será -1. Si era -1, pasará a ser 1. Y en caso de que el valor de order fuera `undefined`, es decir, que no fuese este el filtro por el que estábamos filtrando antes, establezco su valor inicial a 1.

Como cada vez que empleo `setSortData` defino sólo un filtro de ordenación, el resto de filtros tendrá un valor `undefined` cuando se renderizen en el componente `Sort`.

Con `setCurrentPage(1)` fijo la página de la paginación de resultados a 1.

Con esta simple función puedo entonces, como dije, seleccionar el filtrado entre uno de los tres filtros posibles, y establecer el criterio de ordenación, ascendente o descendente, del filtro seleccionado.

## El componente SortIcon

Este componente es el encargado de mostrar el icono de estado de cada uno de los tres criterios de ordenación en la página.

```javascript
const SortIcon = ({order}) => {

  const d = !order
    ? "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    : order === 1
      ? "M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
      : "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none"
      viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default SortIcon;
```

Por _props_, `SortIcon` recibe el parámetro `order`.

En el renderizado lo que hago es dibujar el icono SVG en función del valor de `order`, que puede ser: 1, -1 y _undefined_. Para elegir que icono mostrar, cambio el valor de la propiedad `d` de la imagen SVG que pinta el icono. La propiedad `d` es la única que cambia en los tres iconos elegidos, el de ordenación ascendente (1), descendente (-1) y no seleccionado (_undefined_), así que utilizo el mismo código SVG para los tres iconos, y cambio sólo el valor de d en función de su estatus (order).

Con el operador condicional ternario compruebo si `order` es `undefined` (!order) y si es así, asigno a `d` los datos para pintar el icono de "no seleccionado". En caso contrario, hago otra comprobación con otro operador condicional ternario, esta vez para conocer si el icono a dibujar es el de ordenación ascendente o descendente, y asignar a `d` los datos correspondientes a cada icono.

Los iconos corresponden a la librería [Heroicons](https://heroicons.com/), descargados en su versión JSX.

# Enlaces

* [Página de ejemplo «Tienda 8 bits»](https://javguerra.badared.com/proyecto/tienda8bits/)  
* [Información sobre el proyecto](proyecto-final-bootcamp)  
* [Heroicons](https://heroicons.com/)  
