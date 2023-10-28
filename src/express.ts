import * as path from 'path';

require('dotenv-safe').config({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example'),
    allowEmptyValues: true
});
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import routes from './apis';
import log from './logger';
import * as error from './middleware/error';
import moment from 'moment';

const logger = log(__filename);
const app = express();

// enable cookies
app.use(cookieParser());

// set the view engine to ejs
app.set('view engine', 'ejs');
    moment.locale('nl');
app.locals.moment = moment;

// request logging. dev: console | production: file
app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { 'stream': logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/api', routes);
app.use('/', express.static('public'));
app.use('/public', express.static('public'));

process.on('uncaughtException', function (err, req) {
    logger.error(err.message, err);
});

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

/**
 * Exports express
 * @public
 */
export default app;
