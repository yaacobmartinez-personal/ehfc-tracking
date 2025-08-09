# Malolos Tracking Map

An interactive map application for tracking locations in Malolos, Bulacan with pin management and Supabase integration.

## 🗺️ Features

- **Interactive Map**: Mapbox-powered map of Malolos, Bulacan
- **Pin Management**: Add, edit, and delete location pins
- **Pin Details**: Each pin can include:
  - Location name
  - Assignees (multiple)
  - Target families (multiple)
- **Persistent Storage**: Pins are saved to Supabase database
- **Responsive Design**: Works on desktop and mobile devices
- **Long-press Support**: Add pins with long-press on mobile
- **Barangay Visualization**: Interactive barangay boundaries with hover effects

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Mapbox account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ehfc-tracking.git
   cd ehfc-tracking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase**
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Run the database migration

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The application uses Supabase for data persistence. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

### Database Schema

```sql
CREATE TABLE pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  assignees TEXT[] DEFAULT '{}',
  target_families TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Usage

### Adding Pins
1. Click the floating action button (bottom-right)
2. Long-press on the map where you want to add a pin
3. Fill in the pin details:
   - Location name (required)
   - Assignees (optional, press Enter or comma to add)
   - Target families (optional, press Enter or comma to add)
4. Click "Add Location"

### Editing Pins
1. Click on an existing pin
2. Click the "Edit" button in the popup
3. Modify the details
4. Click "Save Changes"

### Deleting Pins
1. Click on a pin
2. Click the "Delete" button in the popup

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── MalolosMap.tsx    # Main map component
│   ├── AddPinDialog.tsx  # Pin creation/editing dialog
│   ├── BarangayInfo.tsx  # Barangay information display
│   └── FloatingActionButton.tsx # FAB component
├── hooks/                # Custom React hooks
│   └── usePinManagement.ts
├── lib/                  # Library configurations
│   └── supabase.ts
├── services/             # API services
│   └── pinService.ts
├── types/                # TypeScript type definitions
│   └── map.ts
└── utils/                # Utility functions
    └── pinUtils.ts

supabase/
└── migrations/           # Database migrations
    └── 20241201000000_create_pins_table.sql
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox API access token | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Map Configuration

The map is configured for Malolos, Bulacan with:
- **Center**: [120.8114, 14.8433]
- **Zoom**: 11-18
- **Bounds**: Restricted to Malolos area
- **Style**: Mapbox Light theme

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mapbox](https://mapbox.com) for mapping services
- [Supabase](https://supabase.com) for backend services
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
2. Review the [Issues](../../issues) page
3. Create a new issue with detailed information

---

**Note**: Make sure to replace `yourusername` in the clone URL with your actual GitHub username.
