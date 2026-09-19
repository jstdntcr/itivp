const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SALT_ROUNDS = 10;

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
}

function validateCredentials(body) {
  const errors = [];
  if (typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push('Поле "email" обязательно');
  }
  if (typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('Поле "password" обязательно и должно быть не короче 6 символов');
  }
  return errors;
}

async function register(req, res, next) {
  const errors = validateCredentials(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  try {
    const email = req.body.email.trim().toLowerCase();

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await User.create({ email, passwordHash });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const errors = validateCredentials(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  try {
    const email = req.body.email.trim().toLowerCase();

    const user = await User.unscoped().findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const ok = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Требуется refreshToken' });
  }
  try {
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Недействительный или просроченный refresh-токен' });
    }

    const user = await User.unscoped().findByPk(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Refresh-токен отозван или не найден' });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken; // ротация refresh-токена
    await user.save();

    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, me };
