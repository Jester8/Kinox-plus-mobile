import { posterUrl, backdropUrl, type TmdbMovie, type TmdbMovieDetails } from "@/services/tmdb";
import { TMDB_GENRE_MAP, type Title } from "@/lib/mockData";

const FALLBACK_TINTS = ["#0047ab", "#0f52ba", "#4169e1", "#007fff", "#3a3a3a"];

function tintFor(id: number) {
  return FALLBACK_TINTS[id % FALLBACK_TINTS.length];
}

export function tmdbMovieToTitle(movie: TmdbMovie): Title {
  return {
    id: String(movie.id),
    name: movie.title,
    synopsis: movie.overview,
    posterColor: tintFor(movie.id),
    posterImageUrl: posterUrl(movie.poster_path),
    backdropImageUrl: backdropUrl(movie.backdrop_path),
    genre: TMDB_GENRE_MAP[movie.genre_ids[0]] ?? "Drama",
    runtimeMinutes: movie.runtime ?? 0,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
    rating: movie.vote_average ? `${movie.vote_average.toFixed(1)}★` : "NR",
    cast: [],
  };
}

export function tmdbDetailsToTitle(movie: TmdbMovieDetails): Title {
  return {
    ...tmdbMovieToTitle(movie),
    runtimeMinutes: movie.runtime,
    genre: TMDB_GENRE_MAP[movie.genres?.[0]?.id] ?? "Drama",
    cast: movie.credits?.cast?.slice(0, 6).map((c) => c.name) ?? [],
  };
}

export function isTmdbId(titleId: string) {
  return /^\d+$/.test(titleId);
}
