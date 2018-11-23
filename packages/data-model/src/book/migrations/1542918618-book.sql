
CREATE TABLE book (
  -- BASE
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,

  -- EDITORIA BASE
  deleted BOOLEAN DEFAULT FALSE,

  -- FOREIGN
  collection_id UUID NOT NULL references book_collection,
  /*
    TO DO
    We cannot enforce the integrity of division id's, as an array of foreign
    keys is not yet supported in postgres. There seems to be some work on this,
    so we should update when the feature is in postgres.
  */
  divisions JSONB NOT NULL,

  -- OWN
  archived BOOLEAN DEFAULT FALSE,
  copyright_statement TEXT,
  copyright_holder TEXT,
  copyright_year INT,
  edition INT,
  license TEXT,
  publication_date DATE,
  reference_id UUID
);
