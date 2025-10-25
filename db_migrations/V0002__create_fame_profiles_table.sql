-- Create table for fame profiles
CREATE TABLE IF NOT EXISTS fame_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    description TEXT,
    photo_url TEXT,
    caste VARCHAR(50) NOT NULL CHECK (caste IN ('новичок', 'малый фейм', 'средний фейм', 'фейм', 'главный фейм', 'скамер')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on caste for faster filtering
CREATE INDEX idx_fame_profiles_caste ON fame_profiles(caste);

-- Create index on created_at for sorting
CREATE INDEX idx_fame_profiles_created_at ON fame_profiles(created_at DESC);