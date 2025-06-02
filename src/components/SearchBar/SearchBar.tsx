import React from 'react';
import styles from './SearchBar.module.css';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (query: string) => void; // Змінено на onSubmit
}

// Form Action для обробки форми
const searchAction = async (formData: FormData) => {
  const query = formData.get('query') as string;

  if (!query || query.trim() === '') {
    toast.error('Please enter your search query.');
    return;
  }

  return query.trim(); // Повертаємо рядок для подальшої обробки
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = await searchAction(formData);
    if (query) {
      onSubmit(query); // Викликаємо onSubmit з рядком
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
          Powered by TMDB
        </a>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;