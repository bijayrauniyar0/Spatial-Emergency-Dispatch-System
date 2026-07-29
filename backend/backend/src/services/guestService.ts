import { randomUUID } from 'crypto';
import User from '../models/userModels';

export const createGuestUser = async () => {
  const guestId = randomUUID();
  return User.create({
    name: 'Guest',
    email: `guest-${guestId}@guest.local`,
    password: null,
    oauth_provider: 'guest',
    verified: true,
    role: 'citizen',
  });
};
