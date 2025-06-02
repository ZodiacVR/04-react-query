import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie, MovieResponse } from "../../types/movie";
import styles from "./App.module.css";
import { AxiosError } from "axios";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const debouncedSearch = useDebounce(query, 500);

  const { data, isLoading, isError, error } = useQuery<MovieResponse, Error>({
    queryKey: ["movies", debouncedSearch, page],
    queryFn: () => fetchMovies(debouncedSearch, page),
    enabled: !!debouncedSearch,
    retry: 1,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(query.trim());
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching movies:", error);
    }
    if (!isLoading && !isError && debouncedSearch && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, isError, debouncedSearch, error]);

  return (
    <div className={styles.container}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage
          message={
            error instanceof AxiosError
              ? `Failed to fetch movies: ${error.response?.data?.status_message || error.message}`
              : "There was an error, please try again..."
          }
        />
      )}
      {data && data.results && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }: { selected: number }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      <Toaster position="top-right" />
    </div>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}