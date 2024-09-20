import express, { json } from 'express';
import cors from 'cors';
import { createToken } from './utils/createToken.js';
import { RoomServiceClient } from 'livekit-server-sdk';

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_HOST,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

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

app.get('/api/rooms/:roomId', async (req, res, next) => {
  try {
    const opts = {
      name: req.params.roomId,
      emptyTimeout: 10 * 60,
      maxParticipants: 2,
    };
    const rooms = await roomService.listRooms();
    const roomExists = rooms.find((room) => room.name === req.params.roomId);

    if (!roomExists) await roomService.createRoom(opts);

    res.status(200).json({ message: 'Room Ready' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/tokens', async (req, res, next) => {
  try {
    const { roomName, username } = req.body;

    const newToken = await createToken(username, roomName);

    res.status(200).json({ newToken });
  } catch (error) {
    next(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Sever running on port ${process.env.PORT}`);
});
