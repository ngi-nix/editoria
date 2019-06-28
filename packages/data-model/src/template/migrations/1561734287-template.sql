create table template (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- editoria base
  deleted boolean default false,

  --foreign
  book_id uuid references book,
  reference_id uuid,
  templateName text not null
  files text[],
);