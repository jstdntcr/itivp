const Tutor = require('../models/tutorModel');

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
  return errors;
}

function buildTutor(body) {
  return {
    name: body.name.trim(),
    subject: body.subject.trim(),
    bio: body.bio ? body.bio.trim() : null,
  };
}

function getAll(req, res) {
  res.json(Tutor.findAll());
}

function getById(req, res) {
  const tutor = Tutor.findById(Number(req.params.id));
  if (!tutor) {
    return res.status(404).json({ error: 'Репетитор не найден' });
  }
  res.json(tutor);
}

function create(req, res) {
  const errors = validateTutor(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  const tutor = Tutor.create(buildTutor(req.body));
  res.status(201).json(tutor);
}

function update(req, res) {
  const id = Number(req.params.id);
  if (!Tutor.findById(id)) {
    return res.status(404).json({ error: 'Репетитор не найден' });
  }
  const errors = validateTutor(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Некорректные данные', details: errors });
  }
  const tutor = Tutor.update(id, buildTutor(req.body));
  res.json(tutor);
}

function remove(req, res) {
  const removed = Tutor.remove(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'Репетитор не найден' });
  }
  res.json(removed);
}

module.exports = { getAll, getById, create, update, remove };
