BEGIN;
CREATE TABLE IF NOT EXISTS instances(id serial NOT NULL,
                                     type text NOT NULL,
                                     path text NOT NULL,
                                     name text NOT NULL,
                                     sort text NOT NULL,
                                     data text,
                                     PRIMARY KEY (id));

UPDATE settings SET value = '1' WHERE key = 'version';
COMMIT;
