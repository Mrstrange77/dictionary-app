export default function WordCard({ word, onDelete }) {
  return (
    <div className="word-card">
      <div className="card-top">
        <div>
          <h3 className="card-word">{word.word}</h3>
          <span className="card-pos">{word.partOfSpeech}</span>
        </div>
        <button className="card-delete" onClick={() => onDelete(word._id)} title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
        </button>
      </div>
      <p className="card-def">{word.definition}</p>
      {word.example && <p className="card-example">"{word.example}"</p>}
    </div>
  );
}