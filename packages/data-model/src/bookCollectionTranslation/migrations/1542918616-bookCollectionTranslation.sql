CREATE TABLE book_collection_translation (
  -- BASE
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,

  -- EDITORIA BASE
  deleted BOOLEAN DEFAULT FALSE,

  --FOREIGN
  collection_id UUID NOT NULL REFERENCES book_collection,
  language_id UUID NOT NULL REFERENCES language,

  --OWN
  description TEXT,
  title TEXT NOT NULL
);
