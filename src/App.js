import React, { useState, useEffect } from "react";
import "./App.css";
import BookCard from "./components/BookCard";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const saveFavorites = (items) => {
    setFavorites(items);
    localStorage.setItem("favorites", JSON.stringify(items));
  };

  const handleFavorite = (book) => {
    const exists = favorites.find((b) => b.key === book.key);
    if (exists) {
      const updated = favorites.filter((b) => b.key !== book.key);
      saveFavorites(updated);
      showToast("❌ Removed from Favorites");
    } else {
      const updated = [...favorites, book];
      saveFavorites(updated);
      showToast("⭐ Added to Favorites");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=40`
      );
      const data = await response.json();

      if (!data.docs || data.docs.length === 0) {
        setError("📚 No books found — try another title!");
      } else {
        setBooks(data.docs.slice(0, 30));
      }
    } catch {
      setError("⚠️ Network error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setBooks([]);
    setError(null);
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>📚 Books Finder</h1>
        <p>Search. Discover. Read. Your next adventure starts here! </p>
      </header>

      <form onSubmit={searchBooks} className="search-bar">
        <input
          type="text"
          value={query}
          placeholder="Search for a book title..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">🔍 Search</button>
        <button type="button" className="clear-btn" onClick={clearSearch}>
           Clear
        </button>
      </form>

      {loading && <p className="info">⏳ Searching books...</p>}
      {error && <p className="error">{error}</p>}
      {toast && <div className="toast">{toast}</div>}

      <h2 className="section-title">📘 Search Results</h2>
      <div className="book-list">
        {books.map((book, i) => (
          <BookCard key={i} book={book} onFavorite={handleFavorite} />
        ))}
      </div>

      {favorites.length > 0 && (
        <>
          <h2 className="section-title">⭐ Your Favorites</h2>
          <div className="book-list">
            {favorites.map((book, i) => (
              <BookCard key={i} book={book} onFavorite={handleFavorite} />
            ))}
          </div>
        </>
      )}

      <footer>
        <p>
          Made with ❤️ for readers{" "}
          <a href="https://openlibrary.org/" target="_blank" rel="noreferrer">
            
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
