# PlayerScreen Fixes ✅

## Changes Made
1. **Removed TMDB backdrop fetch** — Removed the `useEffect` that called `searchMovies()` on mount to fetch a backdrop image. This was causing "request not found" errors in the console for titles not in TMDB.
2. **Fixed player initialization** — Changed `useVideoPlayer` source from `{ uri: "https://example.com/placeholder.mp4" }` to `null` when no real URL is available. This ensures accurate duration reporting from the real video source.
3. **Removed banner/poster on pause** — Removed the TMDB backdrop `<Image>` component from the controls overlay. The overlay gradient alone provides sufficient readability.
4. **Cleaned up imports** — Removed unused `Image`, `searchMovies`, and `backdropUrl` imports.

