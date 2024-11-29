  document.addEventListener('DOMContentLoaded', function() {
        // se obtiene el id del producto seleccionado
    const productId = localStorage.getItem('selectedProductId');
    
    if (productId) {
        const apiUrl = `http://localhost:3000/products/${productId}`;

        // Obtener datos del producto
        fetch(apiUrl)
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-name').textContent = `${product.name}`;
                document.getElementById('product-description').textContent = `${product.description}`;
                document.getElementById('product-cost').textContent = `${product.currency} ${product.cost}`;
                document.getElementById('product-category').textContent = `${product.category}`;
                document.getElementById('product-sold-count').textContent = `${product.soldCount} vendidos`;
                document.getElementById('product-route').textContent = `${product.name}`;

                const largeImage = document.querySelector('#large-image img');
                const thumbnailsContainer = document.querySelector('.thumbnails');
                let images = product.images;

                if (images.length > 0) {
                    largeImage.src = images[0]; 
                    images.forEach((imageUrl, index) => {
                        const thumbnail = document.createElement('img');
                        thumbnail.src = imageUrl;
                        thumbnail.alt = `Thumbnail ${index}`;
                        thumbnail.addEventListener('click', () => {
                            largeImage.src = imageUrl;
                        });
                        thumbnailsContainer.appendChild(thumbnail);
                    });
                };               

                // Cambio de la background image en products-info.html según categoría del producto seleccionado
                const body = document.body;
                switch(product.category) {
                    case 'Autos':
                        body.style.backgroundImage = 'url("img/cars_index.jpg")';
                        break;
                    case 'Juguetes':
                        body.style.backgroundImage = 'url("img/cat102_1.jpg")';
                        break;
                    case 'Muebles':
                        body.style.backgroundImage = 'url("img/cat103_1.jpg")';
                        break;
                    case 'Herramientas':
                        body.style.backgroundImage = 'url("img/cat104_1.jpg")';
                        break;
                    case 'Computadoras':
                        body.style.backgroundImage = 'url("img/cat105_1.jpg")';
                        break;
                    case 'Vestimenta':
                        body.style.backgroundImage = 'url("img/cat106_1.jpg")';
                        break;
                    case 'Electrodomésticos':
                        body.style.backgroundImage = 'url("img/cat107_1.jpg")';
                        break;
                    case 'Deporte':
                        body.style.backgroundImage = 'url("img/cat108_1.jpg")';
                        break;
                    case 'Celulares':
                        body.style.backgroundImage = 'url("img/cat109_1.jpg")';
                        break;           
                }

                //Sección del carrusel de imágenes del producto
                let currentIndex = 0;
                const nextButton = document.getElementById('next-btn');
                const prevButton = document.getElementById('prev-btn');

                function updateCarousel() {
                    largeImage.src = images[currentIndex];
                    thumbnailsContainer.querySelectorAll('img').forEach((img, index) => {
                        img.style.opacity = (index === currentIndex) ? 1 : 0.5;
                    });
                }

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    updateCarousel();
                });

                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateCarousel();
                });

// SECCION PRODUCTOS RELACIONADOS

const relatedProductsContainer = document.getElementById('related-products-container');

relatedProductsContainer.innerHTML = ''; // Limpiar el contenedor

product.relatedProducts.forEach(async (relatedProduct) => {
    const productElement = document.createElement('div');
    productElement.classList.add('related-product');

    // Hacer una petición para obtener los detalles del producto relacionado
    const relatedProductUrl = `http://localhost:3000/products/${relatedProduct.id}`;
    const response = await fetch(relatedProductUrl);
    const fullRelatedProduct = await response.json();

    productElement.innerHTML = `
        <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
        <h3 style="padding: 10px; height: 70px">${relatedProduct.name}</h3>
        <p style="font-size: 20px; height: 45px">${fullRelatedProduct.currency} ${fullRelatedProduct.cost}</p>
        <button class="view-details" data-id="${relatedProduct.id}" 
            style="background-color: rgba(0, 0, 0, 0.9); color: white; border: 3px solid #f3ebeb;
            padding: 5px 5px; cursor: pointer; font-size: 15px; height: 65px;
            width: 100px; border-radius: 50px; top: 50%; font-weight: 600;">
            Ver detalles
            </button>
    `; 

    relatedProductsContainer.appendChild(productElement);

    productElement.querySelector('.view-details').addEventListener('click', (e) => {
        const selectedId = e.target.getAttribute('data-id');
        localStorage.setItem('selectedProductId', selectedId);
        window.location.href = 'product-info.html';
    });
});

});




// CARRUSEL DE PRODUCTOS RELACIONADOS
let currentSlide = 0;
const slidesToShow = 3;
const relatedProductsContainer = document.querySelector('.related-products-grid');
const products = relatedProductsContainer.children.length; // Número total de productos

document.getElementById('next-button').addEventListener('click', () => {
  if (currentSlide < products - slidesToShow) {
    currentSlide++;
    updateCarousel();
  }
});

document.getElementById('prev-button').addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
});

function updateCarousel() {
  const slideWidth = relatedProductsContainer.children[0].offsetWidth + 10;
  relatedProductsContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}


//COMENTARIOS DE LA API
    // se construye la url de la API con el id del producto
    const apicommentsUrl = `http://localhost:3000/products_comments/${productId}`;

    // se realiza el fetch de la API para obtener los comentarios 
    fetch(apicommentsUrl)
        .then(response => {
            // se verifica si la respuesta es correcta 
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // la convierte a objeto javascript
            return response.json();
        })

        .then(comments => {
            const commentsContainer = document.getElementById('comments-container');

            // Llamada a función para mostrar los comentarios
            showUserComments(comments);

            // Obtener y mostrar los comentarios guardados en sessionStorage
            let storedComments = JSON.parse(sessionStorage.getItem('userComments')) || [];
            showUserComments(storedComments);
        })
        // se manejan los errores con catch, se muestra en el navegador si no se pueden cargar los comntarios
        .catch(error => {
            console.error('Error fetching comments:', error);
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '<p>No se pudieron cargar los comentarios.</p>';
        });




const stars = document.querySelectorAll('.star');
let selectedRating = 0; // Para almacenar la calificación seleccionada

stars.forEach((star) => {
    star.addEventListener('click', () => {
        selectedRating = star.getAttribute('data-value'); // Obtiene el valor de la estrella seleccionada

        // Actualiza el color de las estrellas
        stars.forEach((s) => {
            s.style.color = s.getAttribute('data-value') <= selectedRating ? 'gold' : 'gray';
        });
    });
});

 // Simulación de envío del formulario
 document.getElementById('ratingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const commentText = document.getElementById('comment').value;
    const usuario = localStorage.getItem("usuario"); // Obtener el nombre de usuario guardado
    const date = new Date().toISOString();
    
    if (!commentText || selectedRating === 0) {
        alert('Por favor, añade una calificación y un comentario.');
        return;
    }

    // Crear un objeto de comentario
    const newComment = {
        user: usuario || 'Anónimo',
        description: commentText,
        score: selectedRating,
        dateTime: date
    };

        // Para agregar los comentarios escritos en la página abierta - SESSIONSTORAGE
    // Obtener los comentarios existentes en sessionStorage convirtiéndolos en objeto js
    let storedComments = JSON.parse(sessionStorage.getItem('userComments')) || [];
    
    // Agregar el nuevo comentario
        storedComments.push(newComment);

    // Guardar los comentarios actualizados en sessionStorage
        sessionStorage.setItem('userComments', JSON.stringify(storedComments));

     // Limpiar el formulario y mostrar mensaje de agradecimiento
        document.getElementById('comment').value = '';
        selectedRating = 0; // Reinicia la calificación
        document.getElementById('statusMessage').style.display = 'block';
        document.getElementById('statusMessage').style.marginRight = '-1.3rem'

    // Actualizar la visualización de los comentarios
        showUserComments(storedComments);
   
        const submitBtn = document.querySelector('.ratingBtn');
        const statusMessage = document.getElementById('statusMessage');
    
        submitBtn.disabled = true; 
        submitBtn.textContent = 'Enviando...';

    setTimeout(function() {
        submitBtn.textContent = 'Enviar'; 
        submitBtn.disabled = false;
        statusMessage.style.display = 'block'; 
    }, 2000); 
});



// Función para mostrar los comentarios almacenados en sessionStorage
function showUserComments(comments) {
    const commentsContainer = document.getElementById('comments-container');

    sessionStorage.removeItem('userComments');

    // se itera sobre cada comentario y crea un div con la clase comment para cada uno
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        // para las estrellas se genera un array con 5 posiciones, si el índice es menor que la calificación se pone una estrella llena
        const stars = Array.from({ length: 5 }, (_, index) => {
            return index < comment.score ? '★' : '☆';
        }).join(''); //junta las estrellas en una sola cadena sin espacio entre ellas

        // se asigna el contenido html al div del comentario
        commentDiv.innerHTML = `
            <div class="comment-header">
                <h3>${comment.user}</h3>
                <div class="stars">${stars}</div>
            </div>
            <p>${comment.description}</p>
            <div class="date">${new Date(comment.dateTime).toLocaleString()}</div>
        `;
        // se agrega el div al contenedor principal
        commentsContainer.appendChild(commentDiv);
    });
}
  

}

// Obtener el botón "Comprar" y agregar evento click
const buyButton = document.getElementById('buy-button');
if (buyButton) {
    buyButton.addEventListener('click', () => {
        // Guardar la información del producto en localStorage
        const productData = {
            id: productId,
            name: document.getElementById('product-name').textContent,
            description: document.getElementById('product-description').textContent,
            cost: (document.getElementById('product-cost').textContent),
            image: document.querySelector('#large-image img').src,
            cantidad: 1 // Establece la cantidad inicial
        };
        
        // Obtener el carrito actual
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingProduct = cartItems.find(item => item.id === productData.id);

        if (existingProduct) {
            // Si el producto ya existe, incrementar la cantidad
            existingProduct.cantidad += 1; // Puedes cambiar a la cantidad que necesites
        } else {
            // Si no existe, agregar el nuevo producto
            cartItems.push(productData);
        }

        // Guardar los cambios en localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Redirigir a la pantalla de carrito
        window.location.href = 'cart.html';
    });
}
});
