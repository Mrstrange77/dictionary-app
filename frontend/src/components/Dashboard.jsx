import { useState, useEffect, useRef } from 'react';
import { fetchAllWords, searchWord, addWord, deleteWord } from '../api/words';

export default function Dashboard({ user, onLogout }) {
  const [words, setWords] = useState([]);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ word: '', definition: '', example: '', partOfSpeech: 'noun' });
  const audioRef = useRef(null);

  useEffect(() => {
    fetchAllWords().then(res => setWords(res.data));
  }, []);

  const handleSearch = async e => {
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

  const handleAdd = async e => {
    e.preventDefault();
    try {
      const res = await addWord(form);
      setWords([...words, res.data]);
      setForm({ word: '', definition: '', example: '', partOfSpeech: 'noun' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add word');
    }
  };

  const handleDelete = async id => {
    await deleteWord(id);
    setWords(words.filter(w => w._id !== id));
    if (result?.source === 'db' && result?.data?._id === id) setResult(null);
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">
          <span>📖</span>
          <span className="dash-logo-text">Lexicon</span>
        </div>
        <div className="dash-user">
          <span className="user-greeting">Hey, {user.name.split(' ')[0]} 👋</span>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="hero-section">
          <h2 className="hero-title">What word are you<br /><span className="hero-accent">looking for?</span></h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search any English word..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>
        </div>

        {loading && <div className="status-msg">Looking up <strong>{query}</strong>...</div>}
        {error && <div className="status-msg error">{error}</div>}

        {result && result.source === 'api' && (
          <div className="result-card">
            <div className="result-header">
              <div>
                <h2 className="result-word">{result.data.word}</h2>
                {result.data.phonetic && <span className="result-phonetic">{result.data.phonetic}</span>}
              </div>
              <div className="result-actions">
                {result.data.audio && (
                  <>
                    <audio ref={audioRef} src={result.data.audio} />
                    <button className="icon-btn" onClick={() => audioRef.current?.play()}>🔊</button>
                  </>
                )}
                <span className="api-badge">dictionary</span>
              </div>
            </div>
            {result.data.meanings.map((m, i) => (
              <div key={i} className="meaning">
                <span className="pos-tag">{m.partOfSpeech}</span>
                {m.definitions.map((d, j) => (
                  <div key={j} className="def-block">
                    <p className="def-text">{d.definition}</p>
                    {d.example && <p className="def-example">"{d.example}"</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {result && result.source === 'db' && (
          <div className="result-card saved-card">
            <div className="result-header">
              <div>
                <h2 className="result-word">{result.data.word}</h2>
                <span className="pos-tag">{result.data.partOfSpeech}</span>
              </div>
              <div className="result-actions">
                <span className="saved-badge">saved</span>
                <button className="icon-btn danger" onClick={() => handleDelete(result.data._id)}>🗑</button>
              </div>
            </div>
            <p className="def-text">{result.data.definition}</p>
            {result.data.example && <p className="def-example">"{result.data.example}"</p>}
          </div>
        )}

        <div className="library-section">
          <div className="library-header">
            <h3 className="library-title">My Library <span className="word-count">{words.length}</span></h3>
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Word'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="add-form">
              <div className="form-row">
                <input placeholder="Word" value={form.word} onChange={e => setForm({...form, word: e.target.value})} required />
                <select value={form.partOfSpeech} onChange={e => setForm({...form, partOfSpeech: e.target.value})}>
                  {['noun','verb','adjective','adverb','other'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <textarea placeholder="Definition" value={form.definition} onChange={e => setForm({...form, definition: e.target.value})} required />
              <input placeholder="Example sentence (optional)" value={form.example} onChange={e => setForm({...form, example: e.target.value})} />
              <button type="submit" className="save-btn">Save Word</button>
            </form>
          )}

          {words.length === 0 && !showForm && (
            <div className="empty-state">
              <p>Your library is empty.</p>
              <p>Search a word and save it, or add one manually.</p>
            </div>
          )}

          <div className="word-grid">
            {words.map(w => (
              <div key={w._id} className="word-tile">
                <div className="tile-top">
                  <span className="tile-word">{w.word}</span>
                  <span className="tile-pos">{w.partOfSpeech}</span>
                </div>
                <p className="tile-def">{w.definition}</p>
                {w.example && <p className="tile-example">"{w.example}"</p>}
                <button className="tile-delete" onClick={() => handleDelete(w._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}