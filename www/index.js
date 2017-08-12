var express = require('express');
var timeout = require('connect-timeout');
var compression = require('compression');
var bodyParser = require('body-parser');
var api = require('./api/api');
var allowCors = require('./allowCors');

var publicPath = __dirname + '/../dist';

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(allowCors);
app.use(timeout('60s'));
app.use(compression());
app.use(express.static(publicPath));

// parse application/json
app.use(bodyParser.json({ limit: '5mb' }));

app.use((req, res, next) => {
    if (!req.timedout) next();
});

// views is directory for all template files
app.set('views', publicPath);
app.set('view engine', 'ejs');

api.init(app);

app.get('/', (request, response) => response.render('index'));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
