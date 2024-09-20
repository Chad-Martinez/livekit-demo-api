import { AccessToken } from 'livekit-server-sdk';

export const createToken = async (username, roomName) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username, ttl: '10m' }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};
