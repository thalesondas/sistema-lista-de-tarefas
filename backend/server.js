const { Sequelize } = require('sequelize');
const cors = require('cors');
const config = require('./config/config.js');
const taskRoutes = require('./routes/taskRoutes.js');

const sequelize = new Sequelize(config.development);

sequelize.authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados bem-sucedida!")
    })
    .catch(err => {
        console.error(`Erro ao conectar com o banco de dados: ${err}`);
    });

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', taskRoutes);

const PORT = 3000;
app.listen(PORT, ()  => {
    console.log(`Servidor rodando na porta ${PORT}`);
});