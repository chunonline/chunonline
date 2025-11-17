# Scripts for Managing Public Notes

## Setup

First, apply the migration to add public note functions to your database:

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/rqwkhltixyfpryustlft/sql/new
2. Copy the SQL from `../supabase/migrations/20241117000000_add_public_note_creation.sql`
3. Run it

## Create a Test Public Note

Run this script to create a sample public note:

```bash
node scripts/create-test-public-note.mjs
```

This will create a public note at `http://localhost:3000/notes/welcome`

## Using the API in Your Code

You can now create, update, and delete public notes programmatically using the helper functions in `lib/create-public-note.ts`:

### Create a Public Note

```typescript
import { createPublicNote } from '@/lib/create-public-note';

const { id, error } = await createPublicNote({
  title: 'My Public Note',
  content: '# Hello World\n\nThis is my note content.',
  slug: 'my-public-note',
  emoji: '📝',
  category: 'blog'
});
```

### Update a Public Note

```typescript
import { updatePublicNote } from '@/lib/create-public-note';

const { error } = await updatePublicNote('my-public-note', {
  title: 'Updated Title',
  content: 'New content...'
});
```

### Delete a Public Note

```typescript
import { deletePublicNote } from '@/lib/create-public-note';

const { error } = await deletePublicNote('my-public-note');
```

## Database Functions

The migration adds these PostgreSQL functions:

- `create_public_note(title, content, slug, emoji, category)` - Creates a public note
- `update_public_note(slug, title, content, emoji, category)` - Updates a public note
- `delete_public_note(slug)` - Deletes a public note

These use `SECURITY DEFINER` to bypass Row Level Security policies.

