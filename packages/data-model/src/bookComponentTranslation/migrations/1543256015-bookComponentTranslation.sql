create table book_component_translation (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- editoria base
  deleted boolean default false,

  -- foreign
  book_component_id uuid not null references book_component,
  language_id uuid not null references language,

  -- own
  content text,
  notes jsonb,
  title text
);
