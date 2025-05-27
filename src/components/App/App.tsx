import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error } = useQuery<MovieResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    retry: 1,
    placeholderData: keepPreviousData, // Додаємо для безперервної пагінації
  });

  const handleSearch = (formData: FormData) => {
    const newQuery = formData.get("query") as string;
    if (newQuery.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(newQuery.trim());
    setPage(1); // Скидаємо сторінку на першу при новому пошуку
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!isLoading && !isError && query && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, isError, query]); // Викликаємо toast, коли змінюються дані або стан завантаження

  return (
    <div className={styles.container}>
      <SearchBar action={handleSearch} />
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
      {data?.results.length ? (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      ) : null}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}