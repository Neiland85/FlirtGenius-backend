FlirtGenius Backend
Este repositorio contiene el código backend para la aplicación FlirtGenius. El backend está construido con Node.js y Express, y utiliza MongoDB como base de datos para gestionar la información de productos y transacciones.

Contenido
Instalación
Configuración
Ejecución del Servidor
Estructura del Proyecto
Endpoints
Observabilidad y Trazabilidad
Manejo de Errores
Pruebas
Contribución
Licencia
Instalación
Para comenzar, clona el repositorio y luego instala las dependencias necesarias:

bash
Copiar código
git clone https://github.com/Neiland85/FlirtGenius-backend.git
cd FlirtGenius-backend
npm install
Configuración
Configura las variables de entorno necesarias en un archivo .env. Ejemplo:

bash
Copiar código
PORT=3000
MONGO_URI=mongodb://localhost:27017/flirtgenius
Ejecución del Servidor
Para iniciar el servidor, usa el siguiente comando:

bash
Copiar código
npm start
El servidor estará corriendo en http://localhost:3000.

Estructura del Proyecto
plaintext
Copiar código
src/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
└── index.js
Endpoints
Productos
GET /products: Devuelve una lista de productos.
GET /products/
: Devuelve los detalles de un producto específico.
POST /products: Crea un nuevo producto.
PUT /products/
: Actualiza un producto existente.
DELETE /products/
: Elimina un producto.
Ejemplo de Uso
bash
Copiar código
curl -X GET http://localhost:3000/products
Gestión de Pagos
POST /checkout: Procesa una transacción de pago.
GET /transactions: Devuelve el historial de transacciones.
Ejemplo de Uso
bash
Copiar código
curl -X POST http://localhost:3000/checkout -H "Content-Type: application/json" -d '{"products": [...], "paymentInfo": {...}}'
Observabilidad y Trazabilidad
Este proyecto utiliza Winston para el logging de eventos importantes, errores y transacciones. Los logs se almacenan en formato JSON y pueden ser consultados para rastrear el flujo de datos y eventos en la aplicación.

Configuración de Winston
javascript
Copiar código
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
Manejo de Errores
Se implementa un sistema centralizado de manejo de errores que garantiza que todas las excepciones sean registradas adecuadamente y que los usuarios reciban mensajes de error claros y útiles.

Pruebas
Para ejecutar pruebas, asegúrate de que el entorno de pruebas esté configurado y luego utiliza el siguiente comando:

bash
Copiar código
npm test
Contribución
Si deseas contribuir, por favor realiza un fork del repositorio, crea una nueva rama, realiza tus cambios y envía un Pull Request.


Licencia
Este proyecto está bajo la Licencia MIT.
