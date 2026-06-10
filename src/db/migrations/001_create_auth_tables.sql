create table users (
    id uuid primary key,
    email text not null unique,
    password_hash text not null,
    role text not null default 'admin',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint users_role_check check (role in ('admin'))
);

create table sessions (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    session_token_hash text not null unique,
    user_agent text,
    ip_address text,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null
);

create index sessions_user_id_idx on sessions(user_id);
create index sessions_expires_at_idx on sessions(expires_at);

create unique index sessions_one_active_session_per_user_idx on sessions(user_id);
