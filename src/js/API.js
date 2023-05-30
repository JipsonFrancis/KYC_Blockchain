const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(
    PORT,
    () => console.log(`blockchained on http://localhost:${PORT}`)
);


app.get('/users/:id', (req, res) => {
    res.status(200).send(
        {
            id: 8,
            name: `kingKLong`
        }
    )
});

app.post('/user', (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    if (!name){
        res.status(418).send({message: 'Need a name'})
    }
    res.send({
        id: 8,
        name: `kingKLong`
    })
});