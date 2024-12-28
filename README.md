# Minimal AI Todo

A minimalist, AI-powered todo list application with dark mode and drag-and-drop functionality. Generate todo items using Mistral AI, organize them with drag-and-drop, and toggle between light and dark modes.

## Features

- 🤖 AI-powered todo generation using Mistral AI
- 🌓 Dark mode support
- ✨ Clean, minimal UI
- 🎯 Create, edit, and delete todos
- ✅ Mark todos as complete
- 🔄 Drag and drop to reorder todos
- ⚙️ Custom API key support

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/minimal-ai-todo.git
cd minimal-ai-todo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Mistral API key to `.env.local`
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_MISTRAL_API_KEY`: Your Mistral AI API key (required)

You can either:
- Add it to `.env.local` (recommended for development)
- Or use the settings dialog in the app to add your API key (stored in browser)

## Technologies Used

- Next.js 13
- React
- TypeScript
- Tailwind CSS
- Radix UI
- DND Kit
- Mistral AI API

## License

This project is licensed under the MIT License. 