import React, { useState, useCallback } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import styles from './App.module.css';
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setMovies([]);
    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.info('No movies found for your request.');
      }
      setMovies(results);
    } catch (e: any) {
      setError('There was an error, please try again...');
      toast.error('There was an error, please try again...');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className={styles.container}>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleModalClose} />
        )}
      </main>
    </div>
  );
};

export default App;