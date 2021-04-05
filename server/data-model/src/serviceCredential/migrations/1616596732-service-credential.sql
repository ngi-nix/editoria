create table service_credential (
  id uuid primary key,
  name text not null,
  type text not null,
  access_token text,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  deleted boolean default false
);
