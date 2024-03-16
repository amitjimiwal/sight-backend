import express, { Express, Request, Response } from 'express';
import config from './config/config.js';
const app: Express = express();
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});
app.listen(config.port, () => {
  console.log(` TS Server is running on port ${config.port}`);
});
