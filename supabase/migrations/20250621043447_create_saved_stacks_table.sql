create table saved_stacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now() not null,
  codename text not null,
  title text not null,
  description text not null,
  stack_data jsonb not null
);

-- RLS Policies
alter table saved_stacks enable row level security;

create policy "Users can view their own saved stacks"
on saved_stacks for select
using (auth.uid() = user_id);

create policy "Users can insert their own saved stacks"
on saved_stacks for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own saved stacks"
on saved_stacks for delete
using (auth.uid() = user_id);
