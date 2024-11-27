let productArray = [];
let productGrid = undefined;
let minPrice = undefined;
let maxPrice = undefined;
const ORDER_ASC_BY_COST = "ASC";
const ORDER_DESC_BY_COST = "DESC";
const ORDER_BY_PROD_COUNT = "COUNT";
let currentSortCriteria = ORDER_BY_PROD_COUNT;
let filteredProductsByName = productArray; // Almacena los productos filtrados por nombre/descripcion

    // se traen los datos con la función getJSONData para reutilizar el código, manejo de errores y visualizacion de carga //
document.addEventListener("DOMContentLoaded", function() {

  productGrid = document.getElementById('product-grid');
  btnorder= document.getElementById('btnorder');

  const container = productGrid.parentNode;
 
  let productsURL = `http://localhost:3000/cats_products/${localStorage.getItem("catID")}`;

  getJSONData(productsURL).then(result => {
    if (result.status === 'ok') {
      if (Array.isArray(result.data.products)) {
        productArray = result.data.products;
        filteredProductsByName = productArray; // Inicialmente todos los productos

        // Eliminar cualquier título anterior si existe
        const existingTitle = container.querySelector('h2');
        if (existingTitle) {
          existingTitle.remove();
        }

        // Crear y agregar el título
        const title = document.createElement('h2');
        title.classList.add('text-center', 'my-4');
        title.textContent = result.data.catName;
        container.insertBefore(title, btnorder);

        showProductsList(); // Mostrar productos al cargar la página
      } else {
        console.error('Data.products no es un array:', result.data.products);
      }
    } else {
      console.error('Error en la solicitud:', result.data);
    }
  });

  // Filtrar por nombre o descripción
  document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();

    // Filtrar productos por nombre o descripción
    filteredProductsByName = productArray.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );

    productGrid.innerHTML = ''; // Limpiar el grid de productos
    showProductsList(filteredProductsByName); // Mostrar los productos filtrados por nombre/descripción
  });


    // BOTÓN DE FILTRAR //
    document.getElementById("priceFilterBtn").addEventListener("click", function(){
      //se obtienen los valores ingresados por el usario
      minPrice = document.getElementById("minPrice").value;
      maxPrice = document.getElementById("maxPrice").value;

      //si el valor ingresado es válido lo convierte en número con parseINT de lo contrario queda indefinido
      if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
      }
      else{
        minPrice = undefined;
      }

      if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
      }
      else{
        maxPrice = undefined;
      }

    // Filtrar productos ya filtrados por nombre o descripción por rango de precios
    const filteredByPrice = filteredProductsByName.filter(product => {
      return (
        (minPrice == undefined || parseInt(product.cost) >= minPrice) &&
        (maxPrice == undefined || parseInt(product.cost) <= maxPrice)
      );
    });

    // Limpiar el grid y mostrar los productos filtrados por ambos criterios
    productGrid.innerHTML = '';
    showProductsList(filteredByPrice); // Mostrar los productos filtrados por precio
  });

  // BOTÓN DE LIMPIAR FILTROS DE PRECIO
  document.getElementById('clearPriceFilter').addEventListener('click', function() {
    // Limpiar los campos de min y max
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    // Restablecer los valores como indefinidos
    minPrice = undefined;
    maxPrice = undefined;
    // Limpiar el grid y mostrar los productos filtrados por nombre/descripción
    productGrid.innerHTML = '';
    showProductsList(filteredProductsByName); // Mantener el filtrado por nombre/descripción
  });

  // Ordenar por precio ascendente
  document.getElementById("priceAsc").addEventListener("click", function() {
    currentSortCriteria = ORDER_ASC_BY_COST;
    sortAndShowProducts(currentSortCriteria);
  });

  // Ordenar por precio descendente
  document.getElementById("priceDesc").addEventListener("click", function() {
    currentSortCriteria = ORDER_DESC_BY_COST;
    sortAndShowProducts(currentSortCriteria);
  });

  // Ordenar por cantidad de productos vendidos
  document.getElementById("sortByPrice").addEventListener("click", function() {
    currentSortCriteria = ORDER_BY_PROD_COUNT;
    sortAndShowProducts(currentSortCriteria);
  });
});

// Función que ordena los elementos según los diferentes criterios
function sortCategories(criteria, array) {
  let result = [];

  if (criteria === ORDER_ASC_BY_COST) {
    result = array.sort(function(a, b) {
      return a.cost - b.cost;
    });
  } else if (criteria === ORDER_DESC_BY_COST) {
    result = array.sort(function(a, b) {
      return b.cost - a.cost;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function(a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) return -1;
      if (aCount < bCount) return 1;
      return 0;
    });
  }

  return result;
}

// Ordenar y mostrar los productos
function sortAndShowProducts(criteria) {
  let sortedArray = sortCategories(criteria, filteredProductsByName); // Ordenar el conjunto filtrado
  productGrid.innerHTML = ""; // Limpiar el grid actual
  showProductsList(sortedArray); // Mostrar los productos ordenados
}

// Mostrar los productos
function showProductsList(productList = productArray) {
  if(productList.length != 0) {
    productList.forEach(product => {
  
      if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) && 
          ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {
  
      // Crear la tarjeta del producto
      const productCard = document.createElement('div');
      productCard.classList.add('col-md-4', 'product-card');
  
      // Añadir imagen del producto
      const img = document.createElement('img');
      img.src = product.image;
      productCard.appendChild(img);
  
      // Añadir nombre del producto
      const name = document.createElement('h2');
      name.textContent = product.name;
      productCard.appendChild(name);
  
      // Añadir descripción del producto
      const description = document.createElement('p');
      description.textContent = product.description;
      productCard.appendChild(description);
  
      // Añadir precio del producto
      const price = document.createElement('h3');
      price.textContent = `${product.currency} ${product.cost}`;
      productCard.appendChild(price);
  
      // Añadir cantidad vendida
      const soldCount = document.createElement('p');
      soldCount.classList.add('sold-count');
      soldCount.textContent = `${product.soldCount} Vendidos`;
      productCard.appendChild(soldCount);
  
      // Añadir la tarjeta al grid de productos
      productGrid.appendChild(productCard);
  
      // Agregar evento de clic para redirigir
      productCard.addEventListener('click', function() {
        localStorage.setItem("selectedProductId", product.id);
        window.location.href = 'product-info.html';
      });
  }
  });
  } else {
    document.querySelector('#product-grid').innerHTML = `<h5 style="text-align: center;">No hay productos para mostrar.</h5>`
}
}

