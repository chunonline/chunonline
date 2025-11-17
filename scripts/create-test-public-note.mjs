import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=["']?([^"']+)["']?$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestPublicNote() {
  console.log('🚀 Creating test public note...\n');

  const { data, error } = await supabase.rpc('create_public_note', {
    title_arg: 'Welcome to Notes',
    content_arg: `# Welcome to Notes! 👋

This is your first public note created programmatically.

## What You Can Do

### ✍️ Create Notes
- Use the UI to create private notes
- Use code to create public notes (like this one!)

### 📝 Markdown Support
Write with **bold**, *italics*, and \`code\`

### ✅ Task Lists
- [ ] Create your first note
- [ ] Customize the styling
- [ ] Add more content

### 📊 Tables

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Public Notes | ✅ |
| Dark Mode | ✅ |

---

Edit this note in your Supabase dashboard or update it programmatically!`,
    slug_arg: 'welcome',
    emoji_arg: '👋',
    category_arg: 'getting-started'
  });

  if (error) {
    console.error('❌ Error creating note:', error);
    console.error('\n💡 Make sure you ran the SQL migration first!');
    console.log('   Go to: https://supabase.com/dashboard/project/rqwkhltixyfpryustlft/sql/new');
    console.log('   And run the SQL from: supabase/migrations/20241117000000_add_public_note_creation.sql\n');
    process.exit(1);
  }

  console.log('✅ Public note created successfully!');
  console.log(`📝 Note ID: ${data}`);
  console.log('🌐 View it at: http://localhost:3000/notes/welcome\n');
}

createTestPublicNote();

