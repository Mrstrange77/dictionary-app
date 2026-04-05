const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllWords, searchWord, addWord, deleteWord } = require('../controllers/wordController');

router.get('/', auth, getAllWords);
router.get('/search/:word', auth, searchWord);
router.post('/', auth, addWord);
router.delete('/:id', auth, deleteWord);

module.exports = router;