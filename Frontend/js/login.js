document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener valores de los campos del formulario
    let usuario = document.getElementById("usuario").value.trim(); // Valor ingresado en el campo "usuario"
    let contraseña = document.getElementById("contraseña").value.trim(); // Valor ingresado en el campo "contraseña"

    // Validar campos vacíos
    if (usuario === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Enviar las credenciales al backend con los valores introducidos por el usuario
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Aquí estamos tomando los valores de los campos del formulario
        body: JSON.stringify({ username: usuario, password: contraseña })
    })
    .then(response => {
        if (!response.ok) {
            // Manejo de errores (credenciales incorrectas, etc.)
            return response.json().then(data => { throw new Error(data.message); });
        }
        return response.json();
    })
    .then(data => {
        // Guardar el token en localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("usuario", usuario);

        // Redirigir a la página de portada
        window.location.href = "index.html";
    })
    .catch(error => {
        // Mostrar mensaje de error al usuario
        alert(error.message || "Error al iniciar sesión. Por favor, intenta nuevamente.");
    });
});

// Lógica para ocultar/mostrar contraseña
document.querySelector('.toggle-eye').addEventListener('click', togglePassword);

function togglePassword() {
    const passwordInput = document.getElementById('contraseña');
    const toggleButton = document.querySelector('.toggle-eye');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}