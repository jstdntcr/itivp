// Контроллер: обработка HTTP-запросов и бизнес-логика.
// Данные теперь берутся из PostgreSQL через Sequelize-модель Tutor (ЛР№2),
// раньше (ЛР№1) здесь был массив в памяти. Маршруты и middleware не изменились.

const { Tutor } = require('../models');

// Валидация тела запроса. Возвращает массив ошибок (пустой = ок).
function validateTutor(body) {
  const errors = [];
  if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('Поле "name" обязательно и должно быть непустой строкой');
  }
  if (typeof body.subject !== 'string' || body.subject.trim() === '') {
    errors.push('Поле "subject" обязательно и должно быть непустой строкой');
  }
  if (body.bio !== undefined && body.bio !== null && typeof body.bio !== 'string') {
    errors.push('Поле "bio" должно быть строкой');
  }
  if (body.hourlyRate !== undefined && body.hourlyRate !== null) {
    if (!Number.isInteger(body.hourlyRate) || body.hourlyRate < 0) {
      errors.push('Поле "hourlyRate" должно быть неотрицательным целым числом');
    }
  }
  return errors;
}

// Приводит тело запроса к чистому объекту репетитора.
function buildTutor(body) {
  return {
    name: body.name.trim(),
    subject: body.subject.trim(),
    bio: body.bio ? body.bio.trim() : null,
    hourlyRate: body.hourlyRate ?? null,
  };
}

// GET /tutors
async function getAll(req, res, next) {
  try {
    const tutors = await Tutor.findAll({ order: [['id', 'ASC']] });
    res.json(tutors);
  } catch (err) {
    next(err);
  }
}

// GET /tutors/:id
async function getById(req, res, next) {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) {
      return res.status(404).json({ error: 'Репетитор не найден' });
    }
    res.json(tutor);
  } catch (err) {
    next(err);
  }
}

// POST /tutors
async function create(req, res, next) {
  const errors = validateTutor(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  try {
    const tutor = await Tutor.create(buildTutor(req.body));
    res.status(201).json(tutor);
  } catch (err) {
    next(err);
  }
}

// PUT /tutors/:id
async function update(req, res, next) {
  const errors = validateTutor(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) {
      return res.status(404).json({ error: 'Репетитор не найден' });
    }
    await tutor.update(buildTutor(req.body));
    res.json(tutor);
  } catch (err) {
    next(err);
  }
}

// DELETE /tutors/:id
async function remove(req, res, next) {
  try {
    const tutor = await Tutor.findByPk(req.params.id);
    if (!tutor) {
      return res.status(404).json({ error: 'Репетитор не найден' });
    }
    await tutor.destroy();
    res.json(tutor);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
