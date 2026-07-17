// Placeholder catalog/social data so every screen renders something
// realistic before the real KinoX Plus API is wired up via src/services/api.ts.

// Mirrors TMDb's official movie genre list (used to map real TMDb data 1:1),
// plus Anime as a supplementary category per the product spec.
export type Genre =
  | "Action"
  | "Adventure"
  | "Animation"
  | "Anime"
  | "Comedy"
  | "Crime"
  | "Documentary"
  | "Drama"
  | "Family"
  | "Fantasy"
  | "History"
  | "Horror"
  | "Music"
  | "Mystery"
  | "Romance"
  | "Sci-Fi"
  | "Thriller"
  | "War"
  | "Western";

export const genres: Genre[] = [
  "Action",
  "Adventure",
  "Animation",
  "Anime",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

// TMDb's official genre_id → name map (movie genres), used to translate
// TMDb API responses into our Genre labels.
export const TMDB_GENRE_MAP: Record<number, Genre> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Reverse lookup (Genre label → TMDb genre_id) for /discover/movie calls.
// "Anime" has no dedicated TMDb genre id — Category Browse falls back to
// mock data for it.
export const TMDB_GENRE_ID_BY_NAME: Partial<Record<Genre, number>> = Object.fromEntries(
  Object.entries(TMDB_GENRE_MAP).map(([id, name]) => [name, Number(id)])
);

export type Title = {
  id: string;
  name: string;
  synopsis: string;
  posterColor: string;
  posterImageUrl?: string | null;
  backdropImageUrl?: string | null;
  genre: Genre;
  runtimeMinutes: number;
  year: number;
  rating: string;
  cast: string[];
  isSeries?: boolean;
  episodes?: { id: string; title: string; runtimeMinutes: number }[];
};

const posterColors = ["#0047ab", "#0f52ba", "#4169e1", "#007fff", "#3a3a3a"];

export const titles: Title[] = [
  {
    id: "midnight-signal",
    name: "Midnight Signal",
    synopsis: "A late-night radio host starts receiving broadcasts from a future that hasn't happened yet.",
    posterColor: posterColors[0],
    genre: "Sci-Fi",
    runtimeMinutes: 118,
    year: 2025,
    rating: "PG-13",
    cast: ["Ade Okafor", "Priya Nair", "Tom Halvorsen"],
  },
  {
    id: "the-long-goodbye",
    name: "The Long Goodbye",
    synopsis: "Two exes take one last road trip before one of them moves across the world.",
    posterColor: posterColors[1],
    genre: "Romance",
    runtimeMinutes: 104,
    year: 2024,
    rating: "R",
    cast: ["Maya Lindqvist", "Sam Okonkwo"],
  },
  {
    id: "the-quiet-floor",
    name: "The Quiet Floor",
    synopsis: "A hospital night shift nurse realizes the empty ward isn't as empty as it should be.",
    posterColor: posterColors[3],
    genre: "Horror",
    runtimeMinutes: 96,
    year: 2025,
    rating: "R",
    cast: ["Elena Brooks", "Marcus Webb"],
  },
  {
    id: "hangar-9",
    name: "Hangar 9",
    synopsis: "A crew of misfit mechanics steal back their own ship from a corrupt syndicate.",
    posterColor: posterColors[4],
    genre: "Action",
    runtimeMinutes: 132,
    year: 2023,
    rating: "PG-13",
    cast: ["Jonah Reyes", "Kimiko Sato", "Dev Patel-Wright"],
  },
  {
    id: "flatline-comedy-hour",
    name: "Flatline Comedy Hour",
    synopsis: "Four strangers get stuck in an elevator during a blackout and decide to put on a show.",
    posterColor: posterColors[2],
    genre: "Comedy",
    runtimeMinutes: 92,
    year: 2024,
    rating: "PG-13",
    cast: ["Grace Odom", "Felix Tran"],
  },
  {
    id: "reef-runners",
    name: "Reef Runners",
    synopsis: "A found-footage documentary following free divers mapping the last untouched reefs.",
    posterColor: posterColors[0],
    genre: "Documentary",
    runtimeMinutes: 84,
    year: 2025,
    rating: "PG",
    cast: [],
  },
  {
    id: "paper-lanterns",
    name: "Paper Lanterns",
    isSeries: true,
    synopsis: "A slice-of-life anime about four roommates running a lantern shop in a floating city.",
    posterColor: posterColors[1],
    genre: "Anime",
    runtimeMinutes: 24,
    year: 2024,
    rating: "TV-14",
    cast: [],
    episodes: [
      { id: "s1e1", title: "The Shop Opens", runtimeMinutes: 24 },
      { id: "s1e2", title: "Rent Is Due", runtimeMinutes: 23 },
      { id: "s1e3", title: "The Festival", runtimeMinutes: 25 },
    ],
  },
  {
    id: "the-last-picnic",
    name: "The Last Picnic",
    synopsis: "Three generations of one family gather for what might be their final summer together.",
    posterColor: posterColors[3],
    genre: "Family",
    runtimeMinutes: 101,
    year: 2023,
    rating: "PG",
    cast: ["Ruth Mensah", "Old Bear Whitfield"],
  },
];

export const continueWatching = titles.slice(0, 3).map((t) => ({ ...t, progress: 0.42 }));
export const trendingInRooms = titles.slice(2, 6);

export type Friend = {
  id: string;
  name: string;
  username: string;
  online: boolean;
};

export const friends: Friend[] = [
  { id: "f1", name: "Priya Nair", username: "priyan", online: true },
  { id: "f2", name: "Tom Halvorsen", username: "tomh", online: true },
  { id: "f3", name: "Elena Brooks", username: "elenab", online: false },
  { id: "f4", name: "Dev Patel-Wright", username: "devpw", online: false },
];

export type AppNotification = {
  id: string;
  kind: "room-started" | "invite" | "reminder" | "system";
  message: string;
  timeAgo: string;
  read: boolean;
};

export const notifications: AppNotification[] = [
  { id: "n1", kind: "room-started", message: "Priya started a room for Midnight Signal", timeAgo: "2m", read: false },
  { id: "n2", kind: "invite", message: "Tom invited you to Hangar 9", timeAgo: "18m", read: false },
  { id: "n3", kind: "reminder", message: "Your room starts in 10 min", timeAgo: "1h", read: true },
  { id: "n4", kind: "system", message: "New feature: reaction bursts are here", timeAgo: "1d", read: true },
];

export const avatarPresets = ["#0047ab", "#4169e1", "#0f52ba", "#007fff", "#3a3a3a", "#c0c0c0"];

// Mirrors src/lib/data.ts `faqs` on the web app, per the Help & Support spec.
export const faqs = [
  {
    question: "How is this different from screen sharing on a call?",
    answer:
      "Screen share compresses video badly and drifts out of sync fast. KinoX Plus streams the source natively to every viewer and keeps playback locked in sync, while a separate live video layer carries your friends' faces in full quality.",
  },
  {
    question: "Do my friends need an account to join a room?",
    answer:
      "No. Room hosts need a KinoX Plus account, but guests can join instantly with just a link and a name. Camera and mic permissions are all that's asked.",
  },
  {
    question: "What can I watch?",
    answer:
      "We're building a curated on demand library alongside support for scheduled live premieres and community watch alongs. The waitlist is how we prioritize what launches first.",
  },
  {
    question: "When do I get access?",
    answer:
      "We're rolling out invites in waves. Joining the waitlist secures your spot and moves you up as you refer friends who also want in.",
  },
];
