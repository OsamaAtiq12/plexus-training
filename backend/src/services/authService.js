import { createUser, findUserByEmail, verifyPassword } from '../users.js';
import { generateToken } from '../utils/jwt.js';

export async function signup(body, session) {
  const { name, email, password } = body || {};
  if (!name || !email || !password) {
    return { status: 400, data: { message: 'Name, email and password are required' } };
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    return { status: 409, data: { message: 'User already exists' } };
  }
  const user = await createUser({ name, email, password });
  const token = generateToken({ id: user.id, email: user.email, name: user.name });
  session.user = { id: user.id, email: user.email, name: user.name };
  session.token = token;
  return {
    status: 201,
    data: { user: { id: user.id, email: user.email, name: user.name }, token },
  };
}

export async function login(body, session) {
  const { email, password } = body || {};
  if (!email || !password) {
    return { status: 400, data: { message: 'Email and password are required' } };
  }
  const user = await findUserByEmail(email);
  if (!user) {
    return { status: 401, data: { message: 'Invalid credentials' } };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { status: 401, data: { message: 'Invalid credentials' } };
  }
  const token = generateToken({ id: user.id, email: user.email, name: user.name });
  session.user = { id: user.id, email: user.email, name: user.name };
  session.token = token;
  return {
    status: 200,
    data: { user: { id: user.id, email: user.email, name: user.name }, token },
  };
}
