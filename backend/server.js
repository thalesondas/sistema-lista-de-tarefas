const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/taskRoutes'));

connectDB();

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});