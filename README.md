# Wirecraft - AI Hardware Engineering Workspace

A React + TypeScript + Vite application for hardware engineering, featuring schematic editing with react-flow, 3D model visualization with Three.js, and PCB layout viewing with Canvas/WebGL.

## Features

- **Wiring Schematic Editor**: Interactive node-based editor using react-flow
- **3D Model Viewer**: Real-time 3D visualization with Three.js
- **PCB Layout Viewer**: Canvas-based PCB trace layer visualization
- **Bill of Materials (BOM)**: Component tracking with sourcing links
- **Assembly Instructions**: Step-by-step assembly guide
- **Design Rule Checker (DRC)**: Circuit validation
- **Theme System**: 4 engineering themes (Dark Steel, Engineering Paper, Midnight PCB, Blueprint)
- **Supabase Integration**: Cloud sync for projects (optional)

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials (optional):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### GitHub Setup

1. Create a new GitHub repository named `wirecraft`
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add remote and push:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git branch -M main
   git push -u origin main
   ```

## Supabase Setup (Optional)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the following SQL in the Supabase SQL editor:

```sql
-- Projects table
create table wc_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null default 'Untitled Project',
  data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Usage tracking
create table wc_usage (
  user_id uuid references auth.users not null,
  week_start date not null,
  count int default 0,
  primary key (user_id, week_start)
);

-- Row level security
alter table wc_projects enable row level security;
alter table wc_usage enable row level security;

create policy "Users own their projects"
  on wc_projects for all
  using (auth.uid() = user_id);

create policy "Users own their usage"
  on wc_usage for all
  using (auth.uid() = user_id);
```

3. Enable Google and GitHub OAuth providers in Authentication → Providers
4. Copy your Project URL and anon public key from Settings → API
5. Add them to your `.env.local` file

## Project Structure

```
wirecraft/
├── src/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── WiringEditor.tsx
│   │   ├── PCBViewer.tsx
│   │   ├── Model3DViewer.tsx
│   │   ├── OverviewBlock.tsx
│   │   ├── BOMBlock.tsx
│   │   ├── AssemblyBlock.tsx
│   │   ├── DRCBlock.tsx
│   │   ├── AuthModal.tsx
│   │   └── EmptyWorkspace.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useWirecraft.ts
│   ├── lib/             # Utility libraries
│   │   └── supabase.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── index.html           # Original HTML file (reference)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-flow** - Schematic editor
- **Three.js** - 3D visualization
- **Supabase** - Backend services (optional)
- **Lucide React** - Icons

## License

MIT
