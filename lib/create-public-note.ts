import { createClient } from "@/utils/supabase/client";

export interface CreatePublicNoteParams {
  title: string;
  content: string;
  slug: string;
  emoji?: string;
  category?: string;
}

export async function createPublicNote({
  title,
  content,
  slug,
  emoji = "📝",
  category = null,
}: CreatePublicNoteParams): Promise<{ id: string | null; error: any }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc("create_public_note", {
      title_arg: title,
      content_arg: content,
      slug_arg: slug,
      emoji_arg: emoji,
      category_arg: category,
    });

    if (error) {
      console.error("Error creating public note:", error);
      return { id: null, error };
    }

    return { id: data, error: null };
  } catch (error) {
    console.error("Error creating public note:", error);
    return { id: null, error };
  }
}

export async function updatePublicNote(
  slug: string,
  updates: {
    title?: string;
    content?: string;
    emoji?: string;
    category?: string;
  }
): Promise<{ error: any }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.rpc("update_public_note", {
      slug_arg: slug,
      title_arg: updates.title || null,
      content_arg: updates.content || null,
      emoji_arg: updates.emoji || null,
      category_arg: updates.category || null,
    });

    if (error) {
      console.error("Error updating public note:", error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error("Error updating public note:", error);
    return { error };
  }
}

export async function deletePublicNote(
  slug: string
): Promise<{ error: any }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.rpc("delete_public_note", {
      slug_arg: slug,
    });

    if (error) {
      console.error("Error deleting public note:", error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error("Error deleting public note:", error);
    return { error };
  }
}

