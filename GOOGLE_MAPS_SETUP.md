# Google Maps API Setup Guide

## Issue
You're seeing this error:
```
Google Maps JavaScript API error: RefererNotAllowedMapError
Your site URL to be authorized: http://192.168.1.3:3000/equipment/trucks
```

## Solution

### 1. Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Key Restrictions
1. In the Google Cloud Console, go to **Credentials**
2. Click on your API key
3. Under **Application restrictions**, select **HTTP referrers (web sites)**
4. Add these URLs to the **Website restrictions**:
   ```
   http://localhost:3000/*
   http://192.168.1.3:3000/*
   https://your-production-domain.com/*
   ```
5. Under **API restrictions**, select **Restrict key** and choose **Maps JavaScript API**
6. Click **Save**

### 3. Add Environment Variable
Create a `.env.local` file in your project root and add:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Restart Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Alternative: Use Fallback Map
If you don't want to set up Google Maps API right now, the application will automatically use a fallback map view that shows truck locations without requiring an API key.

## Notes
- The API key is prefixed with `NEXT_PUBLIC_` so it can be used in the browser
- Make sure to add your production domain to the authorized referrers when you deploy
- The fallback map will work without any API key configuration 