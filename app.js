const express = require('express');
const bodyParser = require('body-parser');
const vagasRouter = require('./routes/vagas');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use('/vagas', vagasRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
