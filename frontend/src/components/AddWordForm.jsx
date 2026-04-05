import { useState } from 'react';

export default function AddWordForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ word: '', definition: '', example: '', partOfSpeech: 'noun' });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (form.word && form.definition) {
      onAdd(form);
      setForm({ word: '', definition: '', example: '', partOfSpeech: 'noun' });
      setOpen(false);
    }
  };

  return (
    <div className="add-section">
      <button className="add-toggle" onClick={() => setOpen(!open)}>
        <span>{open ? '−' : '+'}</span> {open ? 'Cancel' : 'Add custom word'}
      </button>
      {open && (
        <form onSubmit={submit} className="add-form">
          <div className="form-row">
            <input name="word" placeholder="Word" value={form.word} onChange={handle} required />
            <select name="partOfSpeech" value={form.partOfSpeech} onChange={handle}>
              {['noun','verb','adjective','adverb','other'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <textarea name="definition" placeholder="Definition" value={form.definition} onChange={handle} required />
          <input name="example" placeholder="Example sentence (optional)" value={form.example} onChange={handle} />
          <button type="submit" className="add-submit">Save word</button>
        </form>
      )}
    </div>
  );
}