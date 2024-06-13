const express = require('express');
const bodyParser = require('body-parser');
const vagasRouter = require('./routes/vagas');
const usersRouter = require('./routes/users');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: 'https://tecjobs2.onrender.com/',
  optionsSucessStatus:200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Vagas',
      version: '1.0.0',
      description: 'API para gerenciar vagas e usuários',
      contact: {
        name: 'Seu Nome',
        url: 'http://seusite.com',
        email: 'seuemail@dominio.com'
      },
      servers: [
        {
          url: 'http://localhost:8000',
          description: 'Servidor Local'
        }
      ]
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/vagas', vagasRouter); // Endpoint base para vagas
app.use('/users', usersRouter); // Endpoint base para usuários

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
