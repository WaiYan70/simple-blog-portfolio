create table posts (
    id uuid primary key,
    slug text not null,
    title text not null,
    description text not null,
    content_markdown text not null,
    tags text[] not null default '{}',

    status text not null default 'draft',
    publication_data date not null,
    published_at timestamptz,

    version integer not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestemptz not null default now(),

    constraint posts_slug_unique unique (slug),

    constraint posts_slug_check check (
        char_length(slug) between 1 and 100
        and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

    constraint post_title_check check (char_length(btrim(title)) between 1 and 120),

    constraint post_description_check check (char_length(btrim(description)) between 1 and 300),

    constraint post_content_check check (
        char_length(btrim(content_markdown)) > 0
        and char_length(content_markdown) <= 200000
    ),

    constraint posts_tags_check check (cardinality(tags) <= 10),

    constraint posts_status_check check (status in ('draft', 'published')),

    constraint posts_publication_check check (status <> 'published' or published_at is not null),

    constraint posts_version_check check (version > 0)

);

create index posts_publication_data_idx
    on posts (publication_data desc, id desc)
    where status = 'published';
