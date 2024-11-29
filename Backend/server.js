const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = "claveSecreta123";

// Configuración del servidor
app.use(cors());
app.use(express.json());

// Ruta de prueba para asegurarse de que el servidor funciona
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




// Middleware para verificar el token
const authorize = (req, res, next) => {
  // Obtener el header de autorización
  const authHeader = req.headers['authorization'];
  
  // Si no se proporciona el header de autorización
  if (!authHeader) {
    console.log('No se proporcionó el token'); // Depuración
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Obtener el token del header (se espera formato "Bearer <token>")
  const token = authHeader.split(' ')[1];

  // Si no se proporciona un token después de "Bearer"
  if (!token) {
    console.log('El formato del token es incorrecto o no se proporcionó token'); // Depuración
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar el token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token inválido o expirado'); // Depuración
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    // Almacenar los datos del usuario en la solicitud (req.user)
    req.user = user;
    next();
  });
};


/////////////////////////////////////////////////////////////////////////////////7



// Ruta para obtener todos los productos (en la carpeta 'products')
app.get('/products', authorize, (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'products');
  const products = [];

  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de productos', err); // Depuración
      return res.status(500).json({ error: 'Error al leer los archivos' });
    }

    files.forEach((file) => {
      const filePath = path.join(dataPath, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      products.push(content);
    });

    res.json(products);
  });
});

// Ruta para obtener un producto específico por su ID (en la carpeta 'products')
app.get('/products/:id',  authorize, (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'data', 'products', `${id}.json`);

  console.log('Buscando producto en:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el producto', err); // Depuración
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});


////////////////////////////////////////////////////////////////////////////////////////////

// Ruta para obtener el carrito de compras (en la carpeta 'cart')
app.get('/cart',  authorize, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'cart', 'buy.json');
  console.log('Buscando carrito en:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el carrito', err); // Depuración
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener los productos de las categorías (en la carpeta 'cats_products')
app.get('/cats_products',  authorize, (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'cats_products');
  const products = [];

  console.log('Buscando productos en cats_products:', dataPath); // Depuración

  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de cats_products', err); // Depuración
      return res.status(500).json({ error: 'Error al leer los archivos' });
    }

    files.forEach((file) => {
      const filePath = path.join(dataPath, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      products.push(content);
    });

    res.json(products);
  });
});

// Ruta para obtener un producto específico por su ID en 'cats_products'
app.get('/cats_products/:id', authorize, (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'data', 'cats_products', `${id}.json`);

  console.log('Buscando producto en cats_products:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el producto de cats_products', err); // Depuración
      return res.status(404).json({ error: 'Producto no encontrado en cats_products' });
    }
    res.json(JSON.parse(data));
  });
});


// Ruta para obtener comentarios de productos (en la carpeta 'products_comments')
app.get('/products_comments',  authorize, (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'products_comments');
  const comments = [];


  fs.readdir(dataPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de products_comments', err); // Depuración
      return res.status(500).json({ error: 'Error al leer los archivos' });
    }

    files.forEach((file) => {
      const filePath = path.join(dataPath, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      comments.push(content);
    });

    res.json(comments);
  });
});

// Ruta para obtener un comentario específico por su ID (en la carpeta 'products_comments')
app.get('/products_comments/:id',  authorize, (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'data', 'products_comments', `${id}.json`);
  

  console.log('Buscando comentario en products_comments:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el comentario', err); // Depuración
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener el archivo de publicación (en la carpeta 'sell')
app.get('/sell', authorize, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'sell', 'publish.json');

  console.log('Buscando archivo de publicación en sell:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de publicación', err); // Depuración
      return res.status(404).json({ error: 'Archivo de publicación no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener el carrito de usuario (en la carpeta 'user_cart')
app.get('/user_cart',  authorize, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'user_cart', '25801.json');

  console.log('Buscando carrito de usuario en user_cart:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el carrito de usuario', err); // Depuración
      return res.status(404).json({ error: 'Carrito de usuario no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para obtener el archivo cat.json (en la carpeta 'cats')
app.get('/cats',  authorize, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'cats', 'cat.json');

  console.log('Buscando archivo cat.json en cats:', filePath); // Depuración

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo cat.json', err); // Depuración
      return res.status(404).json({ error: 'Archivo cat.json no encontrado' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Datos recibidos en backend:', req.body); // Verificar que los datos recibidos son correctos

  if (!username || !password) {
    return res.status(400).json({ message: "Faltan credenciales" });
  }

  if (username === "admin@gmail.com" && password === "admin") {
    // Generar token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ message: "Login exitoso", token });
} else {
    res.status(401).json({ message: "Credenciales incorrectas" });
}
});