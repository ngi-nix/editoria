CREATE TABLE book_translation (
  -- BASE
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,

  -- EDITORIA BASE
  deleted BOOLEAN DEFAULT FALSE,

  -- FOREIGN
  language_id UUID NOT NULL REFERENCES language,
  book_id UUID NOT NULL REFERENCES book,

  -- OWN
  abstract_content TEXT,
  abstract_title TEXT,
  alternative_title TEXT,
  keywords TEXT [],
  subtitle TEXT,
  title TEXT NOT NULL
);
