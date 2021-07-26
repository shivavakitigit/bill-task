const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

/*express config*/
const app = express();
app.use(cors({origin:'*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/*routes*/
const billsRouter = require('./routes/bills');
const itemsRouter = require('./routes/items');
app.get('/',(req,res)=>{
  res.send("Welcome to REST API");
});
app.use('/api/bills/', billsRouter);
app.use('/api/items/', itemsRouter);

/*server*/
app.listen(port,() => {
  console.log("Server is running on port: "+port);
});

