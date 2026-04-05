const Word = require('../models/Word');
const axios = require('axios');
const https = require('https');

const FREE_DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const agent = new https.Agent({ family: 4 });

exports.getAllWords = async (req, res) => {
  try {
    const words = await Word.find({ user: req.user.id }).sort({ word: 1 });
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchWord = async (req, res) => {
  const term = req.params.word.toLowerCase();
  try {
    const existing = await Word.findOne({ word: term, user: req.user.id });
    if (existing) return res.json({ source: 'db', data: existing });

    const response = await axios.get(`${FREE_DICT_API}/${term}`, {
      timeout: 8000,
      httpsAgent: agent,
    });

    const entry = response.data[0];
    const meanings = entry.meanings.map(m => ({
      partOfSpeech: m.partOfSpeech,
      definitions: m.definitions.slice(0, 2).map(d => ({
        definition: d.definition,
        example: d.example || null,
      })),
    }));

    const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';

    res.json({
      source: 'api',
      data: {
        word: entry.word,
        phonetic,
        meanings,
        audio: entry.phonetics?.find(p => p.audio)?.audio || null,
      },
    });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ message: 'Word not found' });
    res.status(500).json({ message: err.message });
  }
};

exports.addWord = async (req, res) => {
  try {
    const newWord = new Word({ ...req.body, user: req.user.id });
    const saved = await newWord.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    await Word.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Word deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};