create table login_attempts(
    identifier_hash text primary key,
    failed_attempt_count integer not null default 0,
    first_failed_at timestamptz not null default now(),
    last_failed_at timestamptz not null default now(),
    locked_until timestamptz
);

create index login_attempts_locked_until_idx on login_attempts(locked_until);
