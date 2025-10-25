CREATE TABLE IF NOT EXISTS fame_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    description TEXT,
    photo_url TEXT,
    caste VARCHAR(50) NOT NULL CHECK (caste IN ('фейм', 'малый фейм', 'средний фейм', 'главный фейм', 'новичок', 'скамер')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_caste ON fame_profiles(caste);
CREATE INDEX idx_views ON fame_profiles(views DESC);