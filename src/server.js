MONGODB_URI=mongodb+srv://<bookingnadarecrds@gmail.com>:<LTltqZFVhxeCte3b>@cluster0.mongodb.net/FlirtGenius?retryWrites=true&w=majority
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
FRONTEND_URL=http://localhost:0000

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payments', paymentRoutes);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payments', paymentRoutes);
const morgan = require('morgan');
app.use(morgan('dev'));
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

