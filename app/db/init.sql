\c online_school;

CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS teacher (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES person(id),
    subject VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES person(id)
);

CREATE TABLE IF NOT EXISTS techer_student (
    teacher_id INT REFERENCES teacher(id),
    student_id INT REFERENCES student(id)
);

CREATE TABLE IF NOT EXISTS grade (
    id SERIAL PRIMARY KEY,
    value INT,
    student_id INT REFERENCES student(id)
);

CREATE TABLE IF NOT EXISTS lesson (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher(id),
    theme VARCHAR(255),
    description TEXT,
    cover VARCHAR(255),
    duration INT,
    subject VARCHAR(255),
    complexity VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS homework (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lesson(id),
    description TEXT,
    file VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS future_lesson (
    id SERIAL PRIMARY KEY,
    start_datetime TIMESTAMP,
    teacher_id INT REFERENCES teacher(id),
    student_id INT REFERENCES student(id),
    is_denied BOOLEAN DEFAULT(false),
    is_conducted BOOLEAN DEFAULT(false)
);

CREATE TABLE IF NOT EXISTS csrf_token (
    token VARCHAR(255) UNIQUE,
    user_id INTEGER REFERENCES person(id)
)
