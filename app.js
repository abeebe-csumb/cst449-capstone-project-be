const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get('/', (req, res) => {
    res.send('hello world');
  }); //test

//listen
app.listen(3000, () => {
    console.log('server started');
});