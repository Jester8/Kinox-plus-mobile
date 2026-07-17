import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "react-native";
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchMoviesByGenre,
  fetchMovieDetails,
  searchMovies,
} from "@/services/tmdb";
import { tmdbMovieToTitle, tmdbDetailsToTitle } from "@/lib/tmdbAdapter";
import { TMDB_GENRE_ID_BY_NAME, type Genre, type Title } from "@/lib/mockData";

const FIVE_MINUTES = 5 * 60 * 1000;

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["tmdb", "trending"],
    queryFn: async () => (await fetchTrendingMovies()).results.map(tmdbMovieToTitle),
    staleTime: FIVE_MINUTES,
  });
}

export function usePopularMovies() {
  return useQuery({
    queryKey: ["tmdb", "popular"],
    queryFn: async () => (await fetchPopularMovies()).results.map(tmdbMovieToTitle),
    staleTime: FIVE_MINUTES,
  });
}

export function useMoviesByGenre(genreId: number | null) {
  return useQuery({
    queryKey: ["tmdb", "genre", genreId],
    queryFn: async () => (await fetchMoviesByGenre(genreId!)).results.map(tmdbMovieToTitle),
    enabled: genreId !== null,
    staleTime: FIVE_MINUTES,
  });
}

export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: ["tmdb", "movie", id],
    queryFn: async () => tmdbDetailsToTitle(await fetchMovieDetails(id!)),
    enabled: id !== null,
    staleTime: FIVE_MINUTES,
  });
}

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["tmdb", "search", query],
    queryFn: async () => (await searchMovies(query)).results.map(tmdbMovieToTitle),
    enabled: query.trim().length > 1,
    staleTime: FIVE_MINUTES,
  });
}

// Warms the cache for the user's onboarding genres so Category Browse feels
// instant when they tap in from Discover, instead of showing a spinner.
export function usePrefetchGenres(genres: Genre[]) {
  const queryClient = useQueryClient();
  const key = genres.join(",");

  useEffect(() => {
    for (const genre of genres) {
      const genreId = TMDB_GENRE_ID_BY_NAME[genre];
      if (!genreId) continue;
      queryClient.prefetchQuery({
        queryKey: ["tmdb", "genre", genreId],
        queryFn: async () => (await fetchMoviesByGenre(genreId)).results.map(tmdbMovieToTitle),
        staleTime: FIVE_MINUTES,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, queryClient]);
}

// Warms the details cache for titles already visible in a rail, so tapping
// through to TitleDetails skips its loading spinner.
export function usePrefetchMovieDetails(ids: number[]) {
  const queryClient = useQueryClient();
  const key = ids.join(",");

  useEffect(() => {
    for (const id of ids) {
      queryClient.prefetchQuery({
        queryKey: ["tmdb", "movie", id],
        queryFn: async () => tmdbDetailsToTitle(await fetchMovieDetails(id)),
        staleTime: FIVE_MINUTES,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, queryClient]);
}

// Warms the OS image cache for poster/backdrop art already fetched, so
// TitleDetails and Player screens paint immediately instead of popping in.
export function usePrefetchTitleImages(titles: Title[] | undefined) {
  useEffect(() => {
    titles?.forEach((title) => {
      if (title.posterImageUrl) Image.prefetch(title.posterImageUrl);
      if (title.backdropImageUrl) Image.prefetch(title.backdropImageUrl);
    });
  }, [titles]);
}
