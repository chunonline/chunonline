-- Add function to create public notes
-- This uses SECURITY DEFINER to bypass RLS, allowing creation of public notes
CREATE OR REPLACE FUNCTION public.create_public_note(
    title_arg text,
    content_arg text,
    slug_arg text,
    emoji_arg text DEFAULT '📝',
    category_arg text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    new_note_id uuid;
BEGIN
    INSERT INTO public.notes (title, content, slug, emoji, category, public, session_id)
    VALUES (title_arg, content_arg, slug_arg, emoji_arg, category_arg, true, NULL)
    RETURNING id INTO new_note_id;
    
    RETURN new_note_id;
END;
$function$;

-- Add function to update public notes
CREATE OR REPLACE FUNCTION public.update_public_note(
    slug_arg text,
    title_arg text DEFAULT NULL,
    content_arg text DEFAULT NULL,
    emoji_arg text DEFAULT NULL,
    category_arg text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    UPDATE public.notes
    SET 
        title = COALESCE(title_arg, title),
        content = COALESCE(content_arg, content),
        emoji = COALESCE(emoji_arg, emoji),
        category = COALESCE(category_arg, category)
    WHERE slug = slug_arg AND public = true;
END;
$function$;

-- Add function to delete public notes
CREATE OR REPLACE FUNCTION public.delete_public_note(slug_arg text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    DELETE FROM public.notes
    WHERE slug = slug_arg AND public = true;
END;
$function$;

