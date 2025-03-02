import express from 'express';
import cors from 'cors';
import http from 'http';
import env from './config/env.js';
import routes from './routes/index.js';

const app = express();

// CORS Configuration
const corsOptions = {
    origin: env.corsOrigin,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use(routes);

const server = http.createServer(app);

server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});