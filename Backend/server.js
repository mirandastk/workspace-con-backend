const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

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



/////////////////////////////////////////////////////////////////////////////////7



// Ruta para obtener todos los productos (en la carpeta 'products')
app.get('/products', (req, res) => {
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
app.get('/products/:id', (req, res) => {
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
app.get('/cart', (req, res) => {
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
app.get('/cats_products', (req, res) => {
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
app.get('/cats_products/:id', (req, res) => {
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
app.get('/products_comments', (req, res) => {
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
app.get('/products_comments/:id', (req, res) => {
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
app.get('/sell', (req, res) => {
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
app.get('/user_cart', (req, res) => {
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




