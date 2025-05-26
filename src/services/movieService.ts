import axios, { AxiosResponse } from 'axios';
import { Movie } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

interface SearchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response: AxiosResponse<SearchMoviesResponse> = await axios.get(
      `${BASE_URL}/search/movie`,
      {
        params: {
          query,
          language: 'uk-UA',
        },
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://via.placeholder.com/150'; // Або інше зображення за замовчуванням
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};