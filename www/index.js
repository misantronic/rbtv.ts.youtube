const fs = require('fs');

if (fs.existsSync(__dirname + '/env.js')) {
    require('./env');
}

const express = require('express');
const timeout = require('connect-timeout');
const compression = require('compression');
const bodyParser = require('body-parser');
const api = require('./api/api');
const allowCors = require('./allowCors');

const publicPath = __dirname + '/../dist';

const app = express();

app.set('port', process.env.PORT || 5000);

app.use(allowCors);
app.use(timeout('60s'));
app.use(compression());
app.use(express.static(publicPath));

// parse application/json
app.use(bodyParser.json({ limit: '5mb' }));

app.use((req, res, next) => !req.timedout && next());

// views is directory for all template files
app.set('views', publicPath);
app.set('view engine', 'ejs');

api.init(app);

app.get('/', (request, response) => response.render('index'));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
