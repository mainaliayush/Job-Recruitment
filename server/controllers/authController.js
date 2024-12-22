import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import * as userModel from '../models/userModels.js';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    const { username, email, password, role, ...profileDetails } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const result = await client.query('INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING id', [username, password_hash, email, role]);
        const userId = result.rows[0].id;
        console.log("FK id: ", userId);

        if (role === 'applicant') {
            const { first_name, last_name, phone_number } = profileDetails;
            await userModel.createApplicantProfile(client, userId, { first_name, last_name, phone_number });
        } else if (role === 'employer') {
            const { company_name, company_phone } = profileDetails;
            await userModel.createEmployerProfile(client, userId, { company_name, company_phone });
        } else {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Invalid role.' });
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        client.release();
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        generateTokenAndSetCookie(user.id, user.role, res);

        res.status(200).json({
			id: user.id,
			username: user.username,
			email: user.email,
            role: user.role
		});

        // const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.json({ token });
    } catch (error) {
        console.error('Error in logging controller:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};