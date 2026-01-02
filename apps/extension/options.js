const availableTags = [
  'labs',
  'labcorp-link',
  'lab-scheduling',
  'orders-billing',
  'refills',
  'pharmacies',
  'shipping',
  'pharmacy-tph',
  'pharmacy-curexa',
  'pharmacy-belmar',
  'routing',
  'escalations',
  'leads',
  'unsubscribe',
  'hrt-faqs',
  'glp-faqs',
];

document.addEventListener('DOMContentLoaded', () => {
  const tagsContainer = document.getElementById('tagsContainer');
  const difficultySelect = document.getElementById('difficulty');
  const questionCountInput = document.getElementById('questionCount');
  const settingsForm = document.getElementById('settingsForm');
  const savedMessage = document.getElementById('savedMessage');

  // Load saved settings
  chrome.storage.sync.get(['defaultTags', 'difficulty', 'questionCount'], (settings) => {
    if (settings.difficulty) {
      difficultySelect.value = settings.difficulty;
    }
    if (settings.questionCount) {
      questionCountInput.value = settings.questionCount;
    }

    // Render tag checkboxes
    availableTags.forEach((tag) => {
      const label = document.createElement('label');
      label.className = 'checkbox-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = tag;
      if (settings.defaultTags && settings.defaultTags.includes(tag)) {
        checkbox.checked = true;
      }
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(tag));
      tagsContainer.appendChild(label);
    });
  });

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedTags = Array.from(tagsContainer.querySelectorAll('input:checked')).map(
      (cb) => cb.value
    );

    chrome.storage.sync.set(
      {
        defaultTags: selectedTags,
        difficulty: parseInt(difficultySelect.value),
        questionCount: parseInt(questionCountInput.value),
      },
      () => {
        savedMessage.style.display = 'block';
        setTimeout(() => {
          savedMessage.style.display = 'none';
        }, 2000);
      }
    );
  });
});

