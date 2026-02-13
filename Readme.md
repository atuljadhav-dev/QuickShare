# InstantDrop

InstantDrop is a real-time room-based chat and file sharing app built with Node.js, Express, Socket.IO, and Tailwind CSS.

Live URL: `https://instantdrop.atuljadhav.tech`

## Features

- Private room-based messaging
- Real-time text chat with Socket.IO
- File sharing up to `50MB`
- Download received files instantly
- Theme support with system theme as default
- Responsive UI with dark/light mode
- No database required (in-memory transfer)

## Security and Performance

- Socket.IO payload limit enforced (`50MB`)
- Server-side validation for:
  - room ID format and length
  - message length
  - file name and size
- Security headers:
  - `Content-Security-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- `x-powered-by` disabled
- Static asset caching enabled for images and static files
- Safer DOM rendering using `textContent` for chat/file content

## SEO and Branding

- Meta title, description, keywords, canonical URL
- Open Graph and Twitter card metadata
- Favicon and banner image integration
- `site.webmanifest` for app metadata
- `robots.txt` and `sitemap.xml` added

## Tech Stack

Frontend:
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Socket.IO client

Backend:
- Node.js
- Express.js
- Socket.IO

## Project Structure

```txt
QuickShare/
|-- app.js
|-- index.html
|-- package.json
|-- site.webmanifest
|-- robots.txt
|-- sitemap.xml
`-- images/
    |-- favicon.ico
    `-- banner.png
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm start
```

For development:

```bash
npm run dev
```

3. Open:

```txt
http://localhost:3000
```

## Environment Variable

Optional:

- `ALLOWED_ORIGINS`: comma-separated allowed origins for Socket.IO CORS.

Example:

```bash
ALLOWED_ORIGINS=https://instantdrop.atuljadhav.tech,http://localhost:3000
```

## File Upload Rules

- Maximum file size: `50MB`
- Files larger than `50MB` are rejected by server

## License

MIT
