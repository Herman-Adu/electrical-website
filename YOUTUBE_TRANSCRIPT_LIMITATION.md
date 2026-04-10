# YouTube Transcript Service - Known Limitation

## Status: ⚠️ YouTube API Blocking

**Date:** April 10, 2026  
**Affected Service:** `docker/youtube-transcript/server.js`  
**Severity:** High - Public API Access Restricted

## Problem

YouTube has **deprecated and restricted** public access to video transcripts via their timedtext API endpoint (`/api/timedtext`).

**Observed Behavior:**

- Video has captions available (detected as "trackCount: 1" for video `eu8UJtuIi-E`)
- Captions are visible in YouTube.com UI
- YouTube's timedtext API returns HTTP 200 but with **zero-length response body**
- No data can be extracted despite proper requests and headers

## Root Cause

YouTube migrated transcript serving to an authenticated system. The public `/api/timedtext` endpoint is no longer functional for most videos.

## Solutions

### Option 1: YouTube Data API (Recommended for Production)

```
Requires: Google Cloud API key with YouTube Data API v3 enabled
Method: Call v3/captions endpoint with authentication
Benefit: Official, stable, fully supported
```

### Option 2: Third-Party Library

```
Use npm package: youtube-transcript (reverse engineering)
npm install youtube-transcript
const { YoutubeTranscript } = require('youtube-transcript');
const transcript = await YoutubeTranscript.fetchTranscript({ videoId });
Benefit: Works around YouTube's restrictions
Risk: May break if YouTube changes internal APIs
```

###Option 3: Cached/Manual Transcription

```
Pre-fetch transcripts when available
Store in database
Serve from cache
Benefit: No YouTube API dependency
Risk: Manual maintenance required
```

## Current Workaround

The service **correctly**:

- ✅ Detects when transcripts are available
- ✅ Identifies caption languages
- ✅ Validates video metadata
- ✅ Returns appropriate error codes
- ✅ Provides detailed diagnostics

**What doesn't work:**

- ❌ Actually retrieving transcript text (YouTube API blocks it)

## Status of Adapter

- `get_video_info()` - ✅ Working
- `get_available_languages()` - ✅ Working
- `get_transcript()` - ❌ Blocked by YouTube
- `get_timed_transcript()` - ❌ Blocked by YouTube

## Recommendation

For production use, integrate the YouTube Data API v3 with proper authentication, or switch to option 2 (youtube-transcript npm package).

**Next Steps:**

1. Obtain YouTube API credentials
2. Update docker-compose.yml to include youtube-transcript or call official API
3. Add authentication layer
4. Test with production video IDs

## Technical Details

**Test Video:** `eu8UJtuIi-E` (OpenClaw trading stream)

- Captions: Present (en)
- PlayerResponse: Contains valid track data
- timedtext endpoint: Returns 200 OK, 0 bytes
- All format attempts: Empty (srv3, vtt, json3, default)
