import app from './express';

import log from './logger';
const logger = log(__filename);
import { initMongoose } from './db';

const port = process.env.PORT || 3000;


// open mongoose connection
if (process.env.NODE_ENV !== 'test') {
  initMongoose().then(() => {
    // monitor events
    const env = process.env.NODE_ENV || 'development';

    // listen to requests
    app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});
