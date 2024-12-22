import pool from '../config/db.js';

export const addJob = async (jobData) => {
  const { title, location, industry, description, salary, application_deadline, id } = jobData;


  let employerId;
  try {
    const employerQuery = 'SELECT id FROM employers WHERE user_id = $1';
    const employerResult = await pool.query(employerQuery, [id]);

    if (employerResult.rows.length === 0) {
      throw new Error('Employer not found for the given user ID');
    }

    employerId = employerResult.rows[0].id;
  } catch (error) {
    console.error('Error fetching employer ID:', error);
    throw new Error('Failed to find employer');
  }

  const query = `
        INSERT INTO jobs (title, location, industry, description, salary, posted_date, application_deadline, company_id)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)
        RETURNING *
    `;

  const values = [title, location, industry, description, salary, application_deadline, employerId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Query execution error:", error);
    throw new Error('Database insertion failed');
  }
};

export const fetchEmployerJobListing = async (userId) => {
  let companyId;

  try {
    const fetchEmployerIdQuery = 'SELECT id FROM employers WHERE user_id = $1';
    const employerQuery = await pool.query(fetchEmployerIdQuery, [userId]);

    if (employerQuery.rows.length === 0) {
      throw new Error('Employer not found for the given user ID');
    }

    companyId = employerQuery.rows[0].id;
  } catch (error) {
    console.error("Error fetching employer ID:", error);
    throw new Error('Failed to execute fetch employerId query');
  }

  const query = `
    SELECT jobs.*, employers.company_name, employers.user_id 
    FROM jobs
    INNER JOIN employers ON jobs.company_id = employers.id
    WHERE employers.id = $1;
  `;

  try {
    const result = await pool.query(query, [companyId]);
    return result.rows;
  } catch (error) {
    console.error("Error executing query to fetch jobs:", error);
    throw new Error('Failed to execute job query');
  }
};

export const fetchApplicantJobView = async () => {
  const query = `
      SELECT jobs.*, employers.company_name 
      FROM jobs 
      INNER JOIN employers ON jobs.company_id = employers.id
    `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error executing query to fetch all jobs:", error);
    throw new Error('Failed to execute job query');
  }
};

export const editJobById = async (jobId, job) => {
  const { title, location, description, salary } = job;
  
  const query = `
    UPDATE jobs
    SET title = $1, location = $2, description = $3, salary = $4
    WHERE id = $5
  `;
  
  const values = [title, location, description, salary, jobId];

  try {
    const result = await pool.query(query, values);
    return result.rowCount > 0 ? { id: jobId, ...job } : null;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJobById = async (jobId) => {
  const query = 'DELETE FROM jobs WHERE id = $1';
  await pool.query(query, [jobId]);
};
