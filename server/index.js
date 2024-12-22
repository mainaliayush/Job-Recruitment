import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pool from './config/db.js';

import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Connected to the database!!');
    }
});

server.get('/', (req, res) => {
    res.send("Hello from backend Homepage!");
});

server.use('/api/auth', authRoutes); 
server.use('/api/users', userRoutes);
server.use('/api/jobs', jobRoutes);
server.use('/api/applications', applicationRoutes);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
