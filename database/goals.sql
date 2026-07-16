CREATE TABLE goals (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id) ON DELETE CASCADE,

    goal_name VARCHAR(100) NOT NULL,

    goal_type VARCHAR(50),

    exam_date DATE,

    daily_hours INT,

    preferred_time VARCHAR(30),

    syllabus_file VARCHAR(255),

    progress INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);