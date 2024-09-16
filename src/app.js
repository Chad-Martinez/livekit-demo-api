import express, { json } from 'express';
import cors from 'cors';
import { createToken } from './utils/createToken.js';

export const allowedOrigins = [
  'http://localhost:5173',
  'https://livekit-demo-ui.onrender.com',
];

const app = express();

app.use(json());
app.use(
  cors({
    origin: (origin = '', callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new HttpErrorResponse(400, 'Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET, POST, PUT, PATCH, DELETE, OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    optionsSuccessStatus: 200,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/tokens', async (req, res, next) => {
  try {
    const { roomName, userName } = req.body;

    const newToken = await createToken(userName, roomName);

    res.status(200).json({ newToken });
  } catch (error) {
    next(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Sever running on port ${process.env.PORT}`);
});
