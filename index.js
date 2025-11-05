const express = require('express');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});