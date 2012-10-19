CREATE or REPLACE FUNCTION cast_varchar_to_intarray (s varchar) RETURNS int[] AS $$

DECLARE
  
BEGIN
  RETURN regexp_split_to_array(trim(leading '/' from $1), E'/');
END;

$$ LANGUAGE plpgsql;

-- Alter sort from string to int[]

ALTER TABLE instances ALTER COLUMN sort TYPE int[] USING cast_varchar_to_intarray(sort);

-- Update version

UPDATE settings SET value = '2' WHERE key = 'version';
