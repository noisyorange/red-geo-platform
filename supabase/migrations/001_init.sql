-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  brand_name TEXT NOT NULL,
  product_name TEXT,
  industry TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  form_data JSONB DEFAULT '{}',
  submit_time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 项目数据表（存储上传的Excel数据）
CREATE TABLE IF NOT EXISTS project_data (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT,
  data JSONB DEFAULT '[]',
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_data ENABLE ROW LEVEL SECURITY;

-- 项目表权限
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;

-- 项目数据表权限
GRANT SELECT, INSERT, UPDATE, DELETE ON project_data TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON project_data TO authenticated;

-- RLS策略 - 允许所有操作
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on project_data" ON project_data;
CREATE POLICY "Allow all operations on project_data" ON project_data FOR ALL USING (true) WITH CHECK (true);
