
// init.js ya está referenciado en todos los html

const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell";
const PRODUCTS_URL = "http://localhost:3000/cats_products/:categoryId";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments";
const CART_INFO_URL = "http://localhost:3000/user_cart";
const CART_BUY_URL = "http://localhost:3000/cart";
const EXT_TYPE = ".json";



//// Se crea una función para almacenar los datos en el localStorage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

//// se declara la constante que trae el elemento del switch 
const themeSwitch = document.getElementById('themeSwitch');


let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

    // NOMBRE DE USUARIO EN LA BARRA SUPERIOR
// - obtener el nombre de usuario almacenado en localStorage
let usuario = localStorage.getItem("usuario");

// Si hay un nombre de usuario, mostrarlo en el botón del menú desplegable
if (usuario) {
    document.querySelector("#user-menu").textContent = usuario;
}

// Función para verificar si el usuario ha iniciado sesión
function checkLogin() {
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html"; // Redirigir a la página de inicio de sesión
    }
}

// Llamar a la función checkLogin al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    checkLogin();

    const album = document.querySelector('.album');
    const bgImg = document.querySelector('.jumbotron');

     for (let id = 101; id <= 109; id++) {
    document.getElementById(id.toString()).addEventListener("click", function () {
        localStorage.setItem("catID", id);
        window.location = "products.html";
    });
}


document.getElementById("logout").addEventListener("click", function () {
// Eliminar el nombre de usuario de localStorage
localStorage.removeItem("usuario");
// Eliminar el estado de sesión
sessionStorage.removeItem("isLoggedIn");
// Redirigir a la página de inicio de sesión
window.location.href = "login.html";
});


window.onload = checkLogin;

// checkLogin antes estaba presente al final de cada código en los siguientes js: 
// products.js, sell.js, product-info.js (excepcionalmente se encontraba al principio), 
// my-profile.js, index.js, categories.js, cart.js.
    
//// se crea el evento que se activa cuando el estado del switch cambia
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode'); //se añade la clase dark-mode al bod si no está presente, o la elimina si ya está presente.
  
// Alternar clase 'bg-light' y 'bg-dark' en la clase album
  if (album.classList.contains('bg-light')) {
    album.classList.replace('bg-light', 'bg-dark');
  } else {
    album.classList.replace('bg-dark', 'bg-light');
  };

  
// Cambiar imagen de fondo en la jumbotron según el tema
if (document.body.classList.contains('dark-mode')) {
  bgImg.style.background = 'url("img/cover-back_Dark-mode-1.png")'; // Fondo para tema oscuro
} else {
  bgImg.style.background = 'url("img/cover_back.png")'; // Fondo para tema claro
}
bgImg.style.backgroundSize = 'cover';  // Asegurar que la imagen se ajuste bien
bgImg.style.backgroundPosition = 'center';


  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  saveToLocalStorage('theme', theme); //se guarda el tema en localStorage con la funcion que definimos antes
});



//// al cargar la pagina se aplica el tema guardado
  const savedTheme = localStorage.getItem('theme'); //se trae el valor de la clave theme del localStorage
  if (savedTheme) { // se verifica que tenga un valor
      document.body.classList.toggle('dark-mode', savedTheme === 'dark'); // se accede a la lista de clases del elemento body 
      // si el el valor guardado es dark, con toggle se añade la clase dark-mode, de lo contrario se elimina.
      themeSwitch.checked = savedTheme === 'dark'; //se actualiza el estado del switch
  }

  // Asegurarnos de que la clase del álbum sea coherente con el tema guardado
  if (savedTheme === 'dark') {
    album.classList.replace('bg-light', 'bg-dark');
    bgImg.style.background = 'url("img/cover-back_Dark-mode-1.png")';
  } else {
    album.classList.replace('bg-dark', 'bg-light');
    bgImg.style.background = 'url("img/cover_back.png")';

  }
  bgImg.style.backgroundSize = 'cover';
  bgImg.style.backgroundPosition = 'center';

});

document.getElementById("logout").addEventListener("click", function () {
  // Eliminar el nombre de usuario de localStorage
  localStorage.removeItem("usuario");
  // Eliminar el estado de sesión
  sessionStorage.removeItem("isLoggedIn");
  // Redirigir a la página de inicio de sesión
  window.location.href = "login.html";
});


window.onload = checkLogin;

// checkLogin antes estaba presente al final de cada código en los siguientes js: 
// products.js, sell.js, product-info.js (excepcionalmente se encontraba al principio), 
// my-profile.js, index.js, categories.js, cart.js.




