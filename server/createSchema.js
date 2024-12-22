import fs from 'fs';
import path from 'path';
import pool from './config/db.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const runSchema = async () => {
    try {
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('Database schema created successfully.');
    } catch (err) {
        console.error('Error creating database schema:', err);
    } finally {
        await pool.end(); 
    }
};

runSchema();
