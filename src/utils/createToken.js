import { AccessToken } from 'livekit-server-sdk';

export const createToken = async (userName, roomName) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: userName, ttl: '10m' }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};
