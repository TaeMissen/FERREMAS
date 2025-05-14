const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio INTEGER NOT NULL
  )`);
  
  // Tabla para mantener IDs disponibles
  db.run(`CREATE TABLE IF NOT EXISTS ids_disponibles (
    id INTEGER PRIMARY KEY
  )`);
});

// Definir funciones de CRUD
const getAllProductos = (callback) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    callback(err, rows);
  });
};

const getProductoById = (id, callback) => {
  db.get('SELECT * FROM productos WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
};

// Función para agregar producto con reutilización de ID
const addProducto = (nombre, cantidad, precio, callback) => {
  // Verificar si hay IDs disponibles
  db.get('SELECT id FROM ids_disponibles ORDER BY id LIMIT 1', [], (err, row) => {
    if (row) {
      // Reutilizar el ID disponible
      const idDisponible = row.id;
      db.run('INSERT INTO productos (id, nombre, cantidad, precio) VALUES (?, ?, ?, ?)', [idDisponible, nombre, cantidad, precio], function(err) {
        if (err) {
          callback(err, null);
        } else {
          // Eliminar el ID de la tabla ids_disponibles
          db.run('DELETE FROM ids_disponibles WHERE id = ?', [idDisponible], function(err) {
            callback(err, idDisponible);
          });
        }
      });
    } else {
      // Insertar nuevo producto con nuevo ID
      db.run('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)', [nombre, cantidad, precio], function(err) {
        callback(err, this.lastID);
      });
    }
  });
};

// Actualizar Producto
const updateProducto = (id, nombre, cantidad, precio, callback) => {
  db.run('UPDATE productos SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre, cantidad, precio, id], function(err) {
    callback(err, this.changes);
  });
};

// Función para eliminar producto y marcar el ID como disponible
const deleteProducto = (id, callback) => {
  db.run('DELETE FROM productos WHERE id = ?', [id], function(err) {
    if (err) {
      callback(err, null);
    } else {
      // Añadir el ID eliminado a la tabla ids_disponibles
      db.run('INSERT INTO ids_disponibles (id) VALUES (?)', [id], function(err) {
        callback(err, this.changes);
      });
    }
  });
};

// Para Enviar productos a sucursal
const enviarProducto = (id, cantidad, callback) => {
  db.get('SELECT cantidad FROM productos WHERE id = ?', [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else if (row && row.cantidad >= cantidad) {
      const nuevaCantidad = row.cantidad - cantidad;
      db.run('UPDATE productos SET cantidad = ? WHERE id = ?', [nuevaCantidad, id], function(err) {
        callback(err, this.changes);
      });
    } else {
      callback(new Error('Cantidad no disponible o producto no encontrado'), null);
    }
  });
};




module.exports = {
  getAllProductos,
  getProductoById,
  addProducto,
  updateProducto,
  deleteProducto,
  enviarProducto
};
