import pool from '../config/db.js';

export const createUser = async (username, password_hash, email, role) => {
    const query = `
        INSERT INTO users (username, password_hash, email, role) 
        VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const result = await pool.query(query, [username, password_hash, email, role]);
    return result.rows[0].id; 
};

export const createApplicantProfile = async (client, userId, profileDetails) => {
    const { first_name, last_name, phone_number } = profileDetails;

    console.log('createApplicantProfile inputs:', { userId, profileDetails });

    const query = `
        INSERT INTO applicants (first_name, last_name, phone_number, user_id) 
        VALUES ($1, $2, $3, $4)
    `;
    await client.query(query, [first_name, last_name, phone_number, userId]);
};

export const createEmployerProfile = async (client, userId, profileDetails) => {
    const { company_name, company_phone } = profileDetails;

    const query = `
        INSERT INTO employers (company_name, company_phone, user_id) 
        VALUES ($1, $2, $3)
    `;
    await client.query(query, [company_name, company_phone, userId]);
};

export const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
};

export const findUserById = async (userId) => {
    // Query general user data
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const userData = userResult.rows[0];

    // console.log("userData: ", userData)

    if (!userData) {
        throw new Error('User not found');
    }

    let roleQuery;
    if (userData.role === 'applicant') {
        roleQuery = 'SELECT * FROM applicants WHERE user_id = $1'; 
    } else if (userData.role === 'employer') {
        roleQuery = 'SELECT * FROM employers WHERE user_id = $1'; 
    } else {
        throw new Error('Invalid role');
    }

    const roleResult = await pool.query(roleQuery, [userId]);
    const roleData = roleResult.rows[0];

    if (!roleData) {
        throw new Error('Role-specific details not found');
    }

    return { ...userData, ...roleData };
};

export const updateUserById = async (userId, updates, role) => {
    const applicantFields = [
        'first_name',
        'last_name',
        'phone_number',
        'profile_photo',
        'address',
        'dob',
        'resume',
        'linkedin_link',
        'github_link'
    ];

    const employerFields = [
        'company_name',
        'company_phone',
        'company_address',
        'num_employees',
        'industry',
        'company_website',
        'profile_photo'
    ];

    let fields, setString, query, values;

    if (role === 'applicant') {
        fields = applicantFields;
    } else if (role === 'employer') {
        fields = employerFields;
    } else {
        throw new Error('Invalid role');
    }

    setString = fields
        .filter(field => updates[field] !== undefined)
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');


    if (setString.length === 0) {
        console.log("No fields to update.");
        return null;
    }

    query = `
        UPDATE ${role}s
        SET ${setString}
        WHERE user_id = $${fields.length + 1}
        RETURNING *
    `;


    values = fields
        .filter(field => updates[field] !== undefined)
        .map(field => {
            if (field === 'dob' && updates[field] === '') {
                return null;
            }
            return updates[field] === '' ? null : updates[field];
        });
    values.push(userId);

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Query execution error:", error);
        throw new Error('Database update failed');
    }
};

export const deleteUserById = async (userId) => {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [userId]);
};
