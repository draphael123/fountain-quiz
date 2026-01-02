const API_BASE = 'http://localhost:3000'; // Change to your production URL

document.addEventListener('DOMContentLoaded', () => {
  const startQuizBtn = document.getElementById('startQuiz');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');

  // Load settings
  chrome.storage.sync.get(['defaultTags', 'difficulty', 'questionCount'], (settings) => {
    // Settings loaded, can be used for quiz
  });

  startQuizBtn.addEventListener('click', async () => {
    startQuizBtn.disabled = true;
    startQuizBtn.textContent = 'Starting...';

    try {
      // Get settings
      const settings = await new Promise((resolve) => {
        chrome.storage.sync.get(['defaultTags', 'difficulty', 'questionCount'], resolve);
      });

      const response = await fetch(`${API_BASE}/api/quiz/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: settings.defaultTags || [],
          difficulty: settings.difficulty || 3,
          length: settings.questionCount || 5,
          mode: 'quick-quiz',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Open quiz in new tab
        chrome.tabs.create({ url: `${API_BASE}/session/${data.attemptId}` });
      } else {
        alert('Failed to start quiz');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz. Make sure the website is running.');
    } finally {
      startQuizBtn.disabled = false;
      startQuizBtn.textContent = 'Start 5-Question Quiz';
    }
  });

  const performSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    searchResults.innerHTML = '<div class="loading">Searching...</div>';

    try {
      const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        searchResults.innerHTML = data.results
          .map(
            (result) => `
            <div class="result-item">
              <h3>${result.prompt}</h3>
              <p>${result.explanation}</p>
            </div>
          `
          )
          .join('');
      } else {
        searchResults.innerHTML = '<div class="loading">No results found</div>';
      }
    } catch (error) {
      console.error('Error searching:', error);
      searchResults.innerHTML = '<div class="loading">Error searching. Make sure the website is running.</div>';
    }
  };

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
});

