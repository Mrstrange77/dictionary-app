import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ query, setQuery, onSearch, loading }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSugg(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/words?sp=${query}*&max=6`
        );
        const data = await res.json();
        setSuggestions(data.map(d => d.word));
        setShowSugg(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSugg(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pickSuggestion = (word) => {
    setQuery(word);
    setSuggestions([]);
    setShowSugg(false);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={(e) => { onSearch(e); setShowSugg(false); }} className="search-form">
        <div className="search-inner">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search any word..."
            value={query}
            onChange={e => { setQuery(e.target.value); }}
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {showSugg && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((word, i) => (
            <li key={i} onClick={() => pickSuggestion(word)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}