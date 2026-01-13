/**
 * SEOBOT PROJECTS TABLE
 * Stores user projects with research data and content plans
 */
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  url text not null,
  research_data jsonb,
  plan jsonb,
  chat_history jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url)
);

alter table projects enable row level security;

create policy "Users can view own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on projects
  for delete using (auth.uid() = user_id);

create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_url_idx on projects(url);

/**
 * SEOBOT ARTICLES TABLE
 * Stores generated articles linked to projects
 */
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects on delete cascade,
  user_id uuid references auth.users not null,
  topic text not null,
  content text not null,
  keywords text[],
  word_count integer,
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table articles enable row level security;

create policy "Users can view own articles" on articles
  for select using (auth.uid() = user_id);

create policy "Users can insert own articles" on articles
  for insert with check (auth.uid() = user_id);

create policy "Users can update own articles" on articles
  for update using (auth.uid() = user_id);

create policy "Users can delete own articles" on articles
  for delete using (auth.uid() = user_id);

create index if not exists articles_project_id_idx on articles(project_id);
create index if not exists articles_user_id_idx on articles(user_id);

/**
 * Update trigger for projects updated_at
 */
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();
