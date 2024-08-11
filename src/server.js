MONGODB_URI=mongodb+srv://<bookingnadarecrds@gmail.com>:<LTltqZFVhxeCte3b>@cluster0.mongodb.net/FlirtGenius?retryWrites=true&w=majority
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
FRONTEND_URL=http://localhost:0000

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 0000/0;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/products', productRoutes);
app.use('/payments', paymentRoutes);

app.use(errorHandler);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API for managing products and payments',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
