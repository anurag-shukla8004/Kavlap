This is the [Kavlap](https://kavlap.com) car wash booking application built with [Next.js](https://nextjs.org).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=kavlap&utm_campaign=kavlap-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Features

### Real-time Notifications
The admin dashboard includes real-time notifications for new bookings:
- **Browser Notifications**: Get instant desktop notifications when customers book car wash services
- **Permission Management**: Click "Enable Notifications" button in the admin panel to grant permission
- **Real-time Updates**: Uses Supabase real-time subscriptions to listen for new bookings in the `user_booking` table
- **Auto-play Sound**: Optional notification sound (add `notification.mp3` to `/public` folder)
- **Click to Focus**: Clicking notifications brings the admin panel into focus

**How it works:**
1. Admin logs into `/admin` page
2. Clicks "Enable Notifications" button to grant browser permission
3. When a customer submits a booking form, Supabase triggers real-time event
4. Admin receives instant browser notification with booking details
5. Notification shows customer name, package type, and booking date
6. Clicking notification focuses the admin window

**Supported Browsers:** Chrome, Firefox, Safari, Edge (any browser with Notification API support)
