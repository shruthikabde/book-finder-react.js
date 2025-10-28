import React, { useState } from "react";
import "./BookCard.css";

function BookCard({ book, onFavorite }) {
  const [showDetails, setShowDetails] = useState(false);

  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  const openLibraryUrl = `https://openlibrary.org${book.key}`;
  const shareText = `Check out this book: ${book.title} by ${book.author_name?.[0]}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + openLibraryUrl)}`;

  return (
    <>
      <div className="book-card">
        <img src={coverUrl} alt={book.title} onClick={() => setShowDetails(true)} />
        <div className="book-info">
          <h3>{book.title}</h3>
          <p>{book.author_name?.join(", ") || "Unknown Author"}</p>
          <p>📅 {book.first_publish_year || "N/A"}</p>
          <div className="book-actions">
            <button onClick={() => onFavorite(book)}>⭐ Favorite</button>
            <a href={openLibraryUrl} target="_blank" rel="noreferrer" className="read-btn">
              📖 Read Online
            </a>
            <a href={shareUrl} target="_blank" rel="noreferrer" className="share-btn">
              🔗 Share
            </a>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="modal" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDetails(false)}>✖</button>
            <img src={coverUrl} alt={book.title} className="modal-img" />
            <h2>{book.title}</h2>
            <p><b>Author:</b> {book.author_name?.join(", ")}</p>
            <p><b>First Published:</b> {book.first_publish_year}</p>
            <p><b>Publisher:</b> {book.publisher?.[0] || "Unknown"}</p>
            <p><b>Subjects:</b> {book.subject?.slice(0, 5).join(", ") || "N/A"}</p>
            <a href={openLibraryUrl} target="_blank" rel="noreferrer" className="modal-link">
              🔗 View on Open Library
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default BookCard;
