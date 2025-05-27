import axios from 'axios';
import type { MovieResponse } from '../types/movie';

export const fetchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch movies: ${error.response?.data?.status_message || error.message}`);
    }
    throw new Error('Failed to fetch movies');
  }
};