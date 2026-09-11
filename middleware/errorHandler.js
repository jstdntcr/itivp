function notFound(req, res) {
  res.status(404).json({ error: 'Маршрут не найден' });
}

function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Тело запроса не является корректным JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}

module.exports = { notFound, errorHandler };
