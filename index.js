const express = require('express');
const routerApi = require('./routes');
const cors = require('cors');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whiteList = ['http://localhost:3000/'];
const options = {
  origin: (origin, callbacks) => {
    if(whiteList.includes(origin) || !origin){
      callbacks(null, true)
    } else {
      callbacks(new Error('No permitido'))
    }
  }
};
app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
})

app.get('/home', (req, res) => {
  res.send('Este es mi Home');
})

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Mi port: ' + port);
})
