import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

export const fetchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<{ results: Movie[]; total_pages: number }>('https://api.themoviedb.org/3/search/movie', {
      params: { query, page },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjBmYmViZWVhM2ViMGYxYTY1ZjIwYWViMWI4NjVjOSIsIm5iZiI6MTc0NzAzMzc5NC41ODksInN1YiI6IjY4MjE5ZWMyZDI5ZGI5OWU5YjdlN2MzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rOIsmXWDygQooz8ASzc5E6oC1eHmmlCZFGyPCUrVz8M`, 
      },
    });
    return { results: response.data.results, total_pages: response.data.total_pages };
  } catch (error) {
    throw new Error('Failed to fetch movies');
  }
};