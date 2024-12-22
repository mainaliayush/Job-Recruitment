CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('applicant', 'employer')) NOT NULL
);

CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,  
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    resume TEXT,
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    profile_photo TEXT,
    address TEXT,
    dob DATE,
    user_id INTEGER UNIQUE NOT NULL,  
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  
);


CREATE TABLE IF NOT EXISTS employers (
    id SERIAL PRIMARY KEY,  
    company_name VARCHAR(255),
    company_phone VARCHAR(20),
    company_address TEXT,
    num_employees INTEGER,
    industry VARCHAR(255),
    company_website VARCHAR(255),
    profile_photo TEXT,
    user_id INTEGER UNIQUE NOT NULL,  
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  
);


CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    industry VARCHAR(255),
    description TEXT,
    salary INTEGER,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_deadline DATE,
    company_id INTEGER REFERENCES employers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    resume TEXT,
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    status VARCHAR(50) DEFAULT 'applied',
    ranking INTEGER DEFAULT FLOOR(RANDOM() * 101),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
