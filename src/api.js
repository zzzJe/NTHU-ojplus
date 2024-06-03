import express from 'express';

const app = express();

app.get('/', function(req, res){
    res.send('Hello, Express JS!');
});

export default app;
