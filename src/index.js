// Fichero src/index.js

// Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Creamos el servidor
const server = express();

server.use(cors());
server.use(express.json({
    limit: "10mb"
}));

server.set("view engine", "ejs");

// Arrancamos el servidor en el puerto 3000
const serverPort = process.env.PORT || 4000;
server.listen(serverPort, () => {
    console.log(`Server listening at http://localhost:${serverPort}`);
});

//configurar el servidor de estáticos
const pathServerPublic = "./src/public-react";
server.use(express.static(pathServerPublic));

const pathServerPublicStyles = "./src/public-css";
server.use(express.static(pathServerPublicStyles));


//listado hoy --- bd
const savedCards = [];

//Endpoints: get, post, put, delete
server.post("/card", (req, res) => {

    if (req.body.name !== '' && req.body.email !== '') {
        //creee la tarjeta que es un objeto
        const newCard = {
            ...req.body,
            id: uuidv4()
        }
        console.log(newCard);
        //añadir al listado de tarjetas
        savedCards.push(newCard);
        //creo la respuesta
        const responseSuccess = {
            success: true,
            cardURL: `https://localhost:4000/card/${newCard.id}`
        }
        //envio la respuesta
        res.json(responseSuccess);
    }
    else {

        const responseError = {
            success: false,
            error: "Faltan parámetros"
        }
        res.json(responseError);
    }

});

server.get("/card/:id", (req, res) => {

    const userCard = savedCards.find(card => card.id === req.params.id);
    res.render("card", userCard);

});
