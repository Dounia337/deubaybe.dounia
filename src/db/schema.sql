-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT now()::text
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  impact TEXT,
  tech_stack TEXT NOT NULL DEFAULT '[]',
  image_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT now()::text,
  updated_at TEXT NOT NULL DEFAULT now()::text
);

-- Cybersecurity lab entries
CREATE TABLE IF NOT EXISTS cyber_entries (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Blue Team',
  tools_used TEXT NOT NULL DEFAULT '[]',
  logs_analysis TEXT,
  what_i_learned TEXT,
  image_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT now()::text,
  updated_at TEXT NOT NULL DEFAULT now()::text
);
ALTER TABLE cyber_entries ADD COLUMN IF NOT EXISTS featured INTEGER NOT NULL DEFAULT 0;

-- Experiences / trainings / convenings
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Training',
  event_date TEXT NOT NULL,
  description TEXT NOT NULL,
  key_takeaway TEXT,
  image_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT now()::text,
  updated_at TEXT NOT NULL DEFAULT now()::text
);
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS featured INTEGER NOT NULL DEFAULT 0;

-- Reflections (blog-style posts)
CREATE TABLE IF NOT EXISTS reflections (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  image_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  post_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT now()::text,
  updated_at TEXT NOT NULL DEFAULT now()::text
);
ALTER TABLE reflections ADD COLUMN IF NOT EXISTS featured INTEGER NOT NULL DEFAULT 0;

-- Contact messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT now()::text
);

-- CV profile (single row)
CREATE TABLE IF NOT EXISTS cv_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  links TEXT NOT NULL DEFAULT '[]',
  photo_url TEXT
);

CREATE TABLE IF NOT EXISTS cv_education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cv_experience (
  id SERIAL PRIMARY KEY,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cv_skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 3,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cv_leadership (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Social media links shown as icon buttons in the hero (fixed set of platforms, admin-managed)
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  platform TEXT UNIQUE NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'facebook', 'youtube')),
  url TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT now()::text
);
