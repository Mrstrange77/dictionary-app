import { useEffect, useState, useRef } from 'react';
import Auth from './components/Auth';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import AddWordForm from './components/AddWordForm';
import { fetchAllWords, searchWord, addWord, deleteWord } from './api/words';
import './index.css';

export default function App() {
  const [user, setUser] = useState(localStorage.getItem('name'));
  const [words, setWords] = useState([]);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (user) fetchAllWords().then(r => setWords(r.data)).catch(() => {});
  }, [user]);

  const handleAuth = (name) => setUser(name);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUser(null);
    setWords([]);
    setResult(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await searchWord(query.trim());
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Word not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    const res = await addWord(data);
    setWords([...words, res.data]);
  };

  const handleDelete = async (id) => {
    await deleteWord(id);
    setWords(words.filter(w => w._id !== id));
    if (result?.source === 'db' && result?.data?._id === id) setResult(null);
  };

  if (!user) return <Auth onAuth={handleAuth} />;

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">λ</span>
          <span className="brand-name">Lexicon</span>
        </div>
        <div className="header-right">
          <span className="header-user">Hey, {user}</span>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <h1 className="hero-title">What word are you<br/><em>looking for?</em></h1>
          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} loading={loading} />
          {error && <p className="error-msg">{error}</p>}
        </div>

        {result && result.source === 'api' && (
          <div className="result-card">
            <div className="result-top">
              <div>
                <h2 className="result-word">{result.data.word}</h2>
                {result.data.phonetic && <span className="result-phonetic">{result.data.phonetic}</span>}
              </div>
              <div className="result-actions">
                {result.data.audio && (
                  <>
                    <audio ref={audioRef} src={result.data.audio} />
                    <button className="audio-btn" onClick={() => audioRef.current?.play()}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                      Listen
                    </button>
                  </>
                )}
              </div>
            </div>
            {result.data.meanings.map((m, i) => (
              <div key={i} className="meaning">
                <span className="meaning-pos">{m.partOfSpeech}</span>
                {m.definitions.map((d, j) => (
                  <div key={j} className="meaning-def">
                    <p>{d.definition}</p>
                    {d.example && <p className="meaning-example">"{d.example}"</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {result && result.source === 'db' && (
          <WordCard word={result.data} onDelete={handleDelete} />
        )}

        <div className="bottom-section">
          <AddWordForm onAdd={handleAdd} />
          {words.length > 0 && (
            <div className="saved-section">
              <h3 className="saved-title">Your saved words <span>{words.length}</span></h3>
              <div className="word-grid">
                {words.map(w => <WordCard key={w._id} word={w} onDelete={handleDelete} />)}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}