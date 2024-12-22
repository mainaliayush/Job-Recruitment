import pool from '../config/db.js';

export const addJobApplication = async (applicationData) => {
    const { applicantId, jobId, first_name, last_name, phone_number, email, resume, github_link, linkedin_link, status } = applicationData;


    const query = `
        INSERT INTO applications 
        (applicant_id, job_id, first_name, last_name, phone_number, email, resume, github_link, linkedin_link, status, ranking, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FLOOR(RANDOM() * 101), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;

    const values = [
        applicantId,
        jobId,
        first_name,
        last_name,
        phone_number,
        email,
        resume,
        github_link,
        linkedin_link,
        status || 'applied',  
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Query execution error:", error);
        throw new Error('Failed to submit application');
    }
};

export const getAllApplicationsFromDB = async (jobId) => {
    const query = `
        SELECT 
            applications.id AS application_id,
            applications.status,
            applications.created_at,
            applications.updated_at,
            jobs.title AS job_title,
            applications.first_name,
            applications.last_name,
            applications.email,
            applications.phone_number,
            applications.resume,
            applications.ranking
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE jobs.id = $1
        ORDER BY applications.created_at DESC;
    `;
    try {
        const result = await pool.query(query, [jobId]);
        return result.rows || [];
    } catch (error) {
        console.error('Database query error:', error);
        return []
    }
};


export const getAllApplicationsHistoryFromDB = async (userId) => {
    const query = `
    SELECT 
        jobs.title AS job_title,
        jobs.location,
        jobs.industry,
        jobs.salary,
        jobs.posted_date,
        employers.company_name, 
        applications.job_id,
        applications.id as application_id,
        applications.status,
        applications.created_at,
        applications.applicant_id
    FROM applications
    JOIN jobs ON applications.job_id = jobs.id
    JOIN employers ON jobs.company_id = employers.id
    WHERE applications.applicant_id = (SELECT id FROM applicants WHERE user_id = $1)
    ORDER BY applications.created_at DESC;
`;


    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Failed to fetch applications');
    }
};
