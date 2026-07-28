const shelfUnit = document.getElementById('shelf-unit');
const toggleFormBtn = document.getElementById('toggle-form-btn');
const addBookForm = document.getElementById('add-book-form');
const detailsPanel = document.getElementById('details-panel');
const deleteBookBtn = document.getElementById('delete-book-btn');
const closeDetailBtn = document.getElementById('close-detail-btn');

let currentBookId = null;
const NUM_CUBBIES = 6; // how many shelf compartments to show

const genreColors = {
  'Fantasy': '#6b3fa0',
  'Sci-Fi': '#2980b9',
  'Self-Help': '#27ae60',
  'Romance': '#c0392b',
  'Mystery': '#34495e',
  'Uncategorized': '#7f8c8d'
};

function getColorForGenre(genre) {
  return genreColors[genre] || '#8e6e53';
}

toggleFormBtn.addEventListener('click', () => {
  addBookForm.classList.toggle('hidden');
});

async function fetchBooks() {
  try {
    const response = await fetch('/books');
    const books = await response.json();
    renderShelf(books);
  } catch (err) {
    shelfUnit.innerHTML = `<p class="empty-cubby-message">Failed to load books.</p>`;
    console.error(err);
  }
}

function renderShelf(books) {
  shelfUnit.innerHTML = '';

  // Split books evenly across cubbies
  const cubbies = Array.from({ length: NUM_CUBBIES }, () => []);
  books.forEach((book, i) => {
    cubbies[i % NUM_CUBBIES].push(book);
  });

  cubbies.forEach(cubbyBooks => {
    const cubby = document.createElement('div');
    cubby.className = 'cubby';

    if (cubbyBooks.length === 0) {
      cubby.innerHTML = `<p class="empty-cubby-message"></p>`;
    } else {
      cubbyBooks.forEach(book => {
        const spine = document.createElement('div');
        spine.className = 'book-spine';
        if (book._id === currentBookId) spine.classList.add('selected');
        spine.style.backgroundColor = getColorForGenre(book.genre);
        spine.textContent = book.title;
        spine.addEventListener('click', () => showDetails(book));
        cubby.appendChild(spine);
      });
    }

    shelfUnit.appendChild(cubby);
  });
}

function showDetails(book) {
  currentBookId = book._id;
  document.getElementById('detail-title').textContent = book.title;
  document.getElementById('detail-author').textContent = `by ${book.author}`;
  document.getElementById('detail-genre').textContent = `Genre: ${book.genre}`;
  document.getElementById('detail-pages').textContent = book.pages ? `Pages: ${book.pages}` : '';
  document.getElementById('detail-status').textContent = `Status: ${book.status}`;
  document.getElementById('detail-mood').textContent = book.mood ? `Mood: ${book.mood}` : '';
  detailsPanel.classList.remove('hidden');
  fetchBooks(); // re-render to highlight selected spine
}

closeDetailBtn.addEventListener('click', () => {
  detailsPanel.classList.add('hidden');
  currentBookId = null;
  fetchBooks();
});

deleteBookBtn.addEventListener('click', async () => {
  if (!currentBookId) return;
  try {
    await fetch(`/books/${currentBookId}`, { method: 'DELETE' });
    detailsPanel.classList.add('hidden');
    currentBookId = null;
    fetchBooks();
  } catch (err) {
    console.error(err);
  }
});

addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newBook = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    genre: document.getElementById('genre').value,
    pages: document.getElementById('pages').value || undefined,
    status: document.getElementById('status').value,
    mood: document.getElementById('mood').value || undefined
  };
  try {
    await fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });
    addBookForm.reset();
    addBookForm.classList.add('hidden');
    fetchBooks();
  } catch (err) {
    console.error(err);
  }
});

fetchBooks();