import * as authService from '../services/authService.js';

export async function signup(req, res) {
  try {
    const result = await authService.signup(req.body, req.session);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body, req.session);
    res.status(result.status).json(result.data);
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function me(req, res) {
  const user = req.session && req.session.user;
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
}

export function debugSession(req, res) {
  res.json({ session: req.session });
}
