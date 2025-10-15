-- Fix duplicate columns by directly addressing known issues

-- Step 1: Check which tables have duplicate storage_path
DO $$
DECLARE
    v_table_name text;
    v_count integer;
BEGIN
    FOR v_table_name IN 
        SELECT DISTINCT c.table_name::text
        FROM information_schema.columns c
        WHERE c.column_name = 'storage_path'
        AND c.table_schema = 'public'
    LOOP
        SELECT COUNT(*) INTO v_count
        FROM information_schema.columns c2
        WHERE c2.column_name = 'storage_path'
        AND c2.table_name = v_table_name
        AND c2.table_schema = 'public';
        
        IF v_count > 1 THEN
            RAISE NOTICE 'Table % has % storage_path columns - needs manual review', v_table_name, v_count;
        END IF;
    END LOOP;
END $$;

-- Step 2: Check which tables have duplicate paid_at
DO $$
DECLARE
    v_table_name text;
    v_count integer;
BEGIN
    FOR v_table_name IN 
        SELECT DISTINCT c.table_name::text
        FROM information_schema.columns c
        WHERE c.column_name = 'paid_at'
        AND c.table_schema = 'public'
    LOOP
        SELECT COUNT(*) INTO v_count
        FROM information_schema.columns c2
        WHERE c2.column_name = 'paid_at'
        AND c2.table_name = v_table_name
        AND c2.table_schema = 'public';
        
        IF v_count > 1 THEN
            RAISE NOTICE 'Table % has % paid_at columns - needs manual review', v_table_name, v_count;
        END IF;
    END LOOP;
END $$;

-- Step 3: Add storage_path properly to content_items if it doesn't exist
-- (This column is actually needed based on the code)
ALTER TABLE IF EXISTS content_items 
ADD COLUMN IF NOT EXISTS storage_path text;

-- Step 4: Create comment explaining the schema
COMMENT ON COLUMN content_items.storage_path IS 'Path to the file in Supabase Storage';

-- Step 5: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_storage_path 
ON content_items(storage_path) 
WHERE storage_path IS NOT NULL;