const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  runtime?: number;
};

export type TmdbMovieDetails = TmdbMovie & {
  runtime: number;
  genres: { id: number; name: string }[];
  credits?: { cast: { id: number; name: string }[] };
};

type PagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
};

async function tmdbFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  if (!ACCESS_TOKEN) {
    throw new Error("Missing EXPO_PUBLIC_TMDB_ACCESS_TOKEN — add it to .env to enable real movie data.");
  }
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const response = await fetch(`${TMDB_BASE_URL}${path}${query}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`TMDb request failed (${response.status}): ${path}`);
  }
  return (await response.json()) as T;
}

export function posterUrl(path: string | null, size: "w185" | "w342" | "w500" = "w342") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" = "w780") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

export function fetchTrendingMovies() {
  return tmdbFetch<PagedResponse<TmdbMovie>>("/trending/movie/week");
}

export function fetchPopularMovies() {
  return tmdbFetch<PagedResponse<TmdbMovie>>("/movie/popular");
}

export function fetchMoviesByGenre(genreId: number) {
  return tmdbFetch<PagedResponse<TmdbMovie>>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
  });
}

export function fetchMovieDetails(id: number) {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`, { append_to_response: "credits" });
}

export function searchMovies(query: string) {
  return tmdbFetch<PagedResponse<TmdbMovie>>("/search/movie", { query });
}
