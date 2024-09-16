import express from 'express';
import { AccessToken } from 'livekit-server-sdk';

const createToken = async (userName) => {
    const roomName = 'livekit-demo';

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, { identity: userName, ttl: '10m' });
    at.addGrant({ roomJoin: true, room: roomName })
    
    return await at.toJwt();
}
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/tokens/:userName', async (req, res, next) => {
    try {
        const { userName } = req.params;
        // console.log('token generating', userName);
    
        const newToken = await createToken(userName);
    
        res.status(200).json({newToken})

    } catch (error) {
        next(error)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Sever running on port ${process.env.PORT}`)
})