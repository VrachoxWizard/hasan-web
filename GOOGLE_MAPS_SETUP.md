# Google Maps API Setup

## Current Error

You're seeing a `RefererNotAllowedMapError` because the site URL needs to be authorized in the Google Cloud Console.

## How to Fix

### 1. Go to Google Cloud Console

Visit: https://console.cloud.google.com/google/maps-apis/credentials

### 2. Select Your API Key

Find the API key being used for the Google Maps Embed API.

### 3. Add Authorized Referrers

In the "Application restrictions" section:

- Select "HTTP referrers (web sites)"
- Add the following referrers:
  ```
  localhost:3000/*
  localhost:*
  produktauto.com/*
  *.produktauto.com/*
  ```

If you're deploying to Vercel or another platform, also add:

```
*.vercel.app/*
```

### 4. Enable Required APIs

Make sure these APIs are enabled in your project:

- Maps Embed API
- Maps JavaScript API (if using interactive maps)

### 5. Save Changes

Click "Save" and wait a few minutes for the changes to propagate.

## Alternative: Use Static Map

If you don't need an interactive map, you can use the Google Maps Static API which has different quotas and restrictions.

## Current Map Configuration

The embed URL is configured in `src/lib/constants.ts`:

```typescript
maps: {
  embedUrl: "https://www.google.com/maps/embed?pb=...",
  directionsUrl: "https://maps.google.com/?q=..."
}
```

## Testing

After making changes:

1. Clear your browser cache
2. Reload the page
3. The map should load without errors

## Documentation

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/embed/get-started)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
