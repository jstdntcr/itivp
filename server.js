require('dotenv').config();
const express = require('express');
const tutorRoutes = require('./routes/tutorRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

const port = process.env.PORT || 8080;

app.use('/tutors', tutorRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
