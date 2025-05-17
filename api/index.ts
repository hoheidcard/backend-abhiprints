// api/index.ts

import server from '../src/main'; // Adjust the path to where your `default server` is exported
import { createServer } from 'http';

module.exports = (req: any, res: any) => {
  server(req, res);
};
