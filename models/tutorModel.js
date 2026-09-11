let tutors = [
  { id: 1, name: 'Анна Смирнова', subject: 'Математика', bio: 'Готовлю к ЦТ и олимпиадам.' },
  { id: 2, name: 'Игорь Петров', subject: 'Английский язык', bio: 'Разговорный английский, IELTS.' },
];
let nextId = 3;

function findAll() {
  return tutors;
}

function findById(id) {
  return tutors.find((t) => t.id === id);
}

function create(data) {
  const tutor = { id: nextId++, ...data };
  tutors.push(tutor);
  return tutor;
}

function update(id, data) {
  const tutor = findById(id);
  if (!tutor) return null;
  Object.assign(tutor, data);
  return tutor;
}

function remove(id) {
  const index = tutors.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [removed] = tutors.splice(index, 1);
  return removed;
}

module.exports = { findAll, findById, create, update, remove };
