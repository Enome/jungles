CREATE TABLE IF NOT EXISTS settings(id serial NOT NULL, 
                                    key varchar(64) NOT NULL UNIQUE,
                                    value text NOT NULL,
                                    PRIMARY KEY (id));

INSERT INTO settings(key, value) values('version', '0');
