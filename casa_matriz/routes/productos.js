const express = require('express');
const axios = require('axios');
const router = express.Router();
const productoModel = require('../models/Producto');

// Obtener todos los productos
router.get('/', (req, res) => {
  productoModel.getAllProductos((err, productos) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(productos);
    }
  });
});

// Agregar nuevo producto
router.post('/', (req, res) => {
  const { nombre, cantidad, precio } = req.body;
  productoModel.addProducto(nombre, cantidad, precio ,(err, id) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id, nombre, cantidad, precio });
    }
  });
});

// Eliminar un producto por ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  productoModel.deleteProducto(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes) {
      res.json({ message: `Producto con id ${id} eliminado con éxito.` });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});

module.exports = router;

// Actualizar un producto existente
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, cantidad, precio } = req.body;
  productoModel.updateProducto(id, nombre, cantidad, precio ,(err, changes) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (changes) {
      res.json({ id, nombre, cantidad, precio });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});

// Ruta para enviar productos a la sucursal
router.post('/enviar', async (req, res) => {
  const { id, cantidad } = req.body;

  try {
    const producto = await new Promise((resolve, reject) => {
      productoModel.getProductoById(id, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (producto && producto.cantidad >= cantidad) {
      // Actualizar la cantidad del producto en la casa matriz
      await new Promise((resolve, reject) => {
        productoModel.enviarProducto(id, cantidad, (err, changes) => {
          if (err) reject(err);
          resolve(changes);
        });
      });

      // Enviar producto a la sucursal
      const response = await axios.post('http://localhost:3001/productos/recibir', {
        id,
        cantidad,
        nombre: producto.nombre,
        precio: producto.precio
      });

      res.json({ message: 'Producto enviado con éxito a la sucursal', data: response.data });
    } else {
      res.status(400).json({ error: 'Cantidad no disponible o producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// Ruta para recibir productos desde la sucursal
router.post('/recibir', (req, res) => {
  const { id, cantidad, nombre, precio } = req.body;
  productoModel.getProductoById(id, (err, producto) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (producto) {
      productoModel.updateProducto(id, producto.nombre, producto.cantidad + cantidad,  producto.precio, (err, changes) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Producto recibido con éxito', producto: { id, nombre, cantidad: producto.cantidad + cantidad, precio } });
        }
      });
    } else {
      // Agregar el producto si no existe
      productoModel.addProducto(nombre, cantidad, precio ,(err, id) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: 'Producto recibido y agregado con éxito', producto: { id, nombre, cantidad, precio } });
        }
      });
    }
  });
});

