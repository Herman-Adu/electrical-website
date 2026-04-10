/**
 * CommonJS wrapper to load youtube-transcript ESM module
 */

let YoutubeTranscript = null;

async function load() {
  try {
    const mod = await import("youtube-transcript");
    // Extract the default export or named exports
    YoutubeTranscript = mod.default || mod;
    return YoutubeTranscript;
  } catch (error) {
    console.error("Failed to load youtube-transcript:", error.message);
    return null;
  }
}

// Export a promise that resolves to the loaded module
module.exports = { load, get: () => YoutubeTranscript };
