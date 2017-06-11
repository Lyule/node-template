'use strice';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const path = require('path');

const config = require('./config');
const lib = require('../lib');

lib.global(config,'app');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('hbs', hbs.express4({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'main/view/layout'),
    defaultLayout: path.resolve(__dirname, 'main/view/layout.hbs'),
    partialsDir: path.join(__dirname, 'main/view/partial')
}));
app.set('view engine','hbs');
app.set('views', path.join(__dirname,'main/view'));

app.use('/',(res,req)=>{
    req.send('hello world');
});

try {

    require('./dispatch')(app);

    app.all('*', errorHanlde.notFound()); // 404
    app.use(errorHanlde.serverError()); // 500

} catch (err){
    console.log(err);
}

app.listen(config.port || 3000, function() {
    console.log(`${config.app} service start`);
});