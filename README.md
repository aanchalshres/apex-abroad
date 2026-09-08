<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/443862ab-2c2b-495a-b49d-d55f07189099

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# Apex Abroad

International education consultancy website for study abroad counseling, test prep (IELTS, PTE, SAT), visa guidance, and university admissions.

## Features

- **Study Abroad Counseling**: Expert guidance for international education
- **Test Preparation**: IELTS, PTE, and SAT coaching
- **Visa Assistance**: Complete visa guidance and support
- **University Partners**: Partnerships with top universities worldwide
- **Responsive Design**: Modern, mobile-friendly interface

## Getting Started

**Prerequisites:**  Node.js (v16+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- **React 19.0.1** - UI framework
- **TypeScript ~5.8.2** - Type safety
- **Tailwind CSS 4.1.14** - Utility-first styling
- **Vite 6.2.3** - Modern bundler

## Project Structure

- `/css` - Stylesheets
- `/js` - JavaScript utilities and form handlers
- `/courses` - Course pages (IELTS, PTE, SAT)
- `/destinations` - Study destination guides
- `/services` - Service offerings
- `/resources` - Blogs, FAQs, scholarships
- `/public` - Static assets and images
- `/src` - React components and TypeScript source
