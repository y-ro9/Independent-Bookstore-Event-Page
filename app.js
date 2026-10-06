(function () {
  'use strict';

  /* ---------- Helpers ---------- */

  const sanitizeText = (value) => {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML.trim();
  };

  const track = () => {
    // eslint-disable-next-line no-console
    console.log('[Analytics] User interacted with Independent Bookstore Events Page');
  };

  const debounce = (fn, waitMs) => {
    let timer = 0;
    return function debounced(...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), waitMs);
    };
  };

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  /* ---------- State (mock data) ---------- */

  const events = [
    { id: 1, title: 'Poetry Night with Maya Rao', author: 'Maya Rao',        date: '2026-10-15', time: '18:30', capacity: 40 },
    { id: 2, title: 'Mystery Book Club',          author: 'Ravi Khanna',     date: '2026-10-18', time: '17:00', capacity: 25 },
    { id: 3, title: 'Children Story Hour',        author: 'Leela Menon',     date: '2026-10-20', time: '11:00', capacity: 30 },
    { id: 4, title: 'Sci-Fi Author Talk',         author: 'Arjun Patel',     date: '2026-10-22', time: '19:00', capacity: 60 },
    { id: 5, title: 'Local Writers Open Mic',     author: 'Community Voices',date: '2026-10-25', time: '16:00', capacity: 50 }
  ];

  let nextId = events.length + 1;
  let searchTerm = '';

  /* ---------- DOM refs ---------- */

  const listEl      = document.getElementById('event-list');
  const emptyEl     = document.getElementById('empty-state');
  const loadingEl   = document.getElementById('loading');
  const searchInput = document.getElementById('search-input');
  const form        = document.getElementById('event-form');
  const submitBtn   = form.querySelector('button[type="submit"]');

  /* ---------- Rendering ---------- */

  const matchesSearch = (ev) => {
    if (!searchTerm) return true;
    const haystack = `${ev.title} ${ev.author}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  };

  const buildCard = (ev) => {
    const li = document.createElement('li');
    li.className = 'event-card';

    const title = document.createElement('h3');
    title.className = 'event-title';
    title.textContent = sanitizeText(ev.title);

    const author = document.createElement('p');
    author.className = 'event-meta';
    author.textContent = `By ${sanitizeText(ev.author)}`;

    const when = document.createElement('p');
    when.className = 'event-meta';
    when.textContent = `${sanitizeText(ev.date)} · ${sanitizeText(ev.time)}`;

    const cap = document.createElement('p');
    cap.className = 'event-meta';
    cap.textContent = `Capacity: ${Number(ev.capacity) || 0}`;

    li.append(title, author, when, cap);
    return li;
  };

  const renderEvents = () => {
    const filtered = events.filter(matchesSearch);
    listEl.replaceChildren();

    if (filtered.length === 0) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    const frag = document.createDocumentFragment();
    filtered.forEach((ev) => frag.appendChild(buildCard(ev)));
    listEl.appendChild(frag);
  };

  const setLoading = (state) => {
    loadingEl.hidden = !state;
    listEl.setAttribute('aria-busy', state ? 'true' : 'false');
  };

  const refreshList = async () => {
    setLoading(true);
    await wait(300); // simulate slow 3G
    renderEvents();
    setLoading(false);
    track();
  };

  /* ---------- Search ---------- */

  const onSearchInput = (event) => {
    searchTerm = sanitizeText(event.target.value);
    refreshList();
  };

  searchInput.addEventListener('input', debounce(onSearchInput, 250));

  /* ---------- Form validation ---------- */

  const fields = [
    { id: 'event-title',    errorId: 'title-error',    validate: (v) => v.trim().length >= 2,
      message: 'Please enter an event title (at least 2 characters).' },
    { id: 'event-author',   errorId: 'author-error',   validate: (v) => v.trim().length >= 2,
      message: 'Please enter the author or guest name.' },
    { id: 'event-date',     errorId: 'date-error',     validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: 'Please select a valid date.' },
    { id: 'event-time',     errorId: 'time-error',     validate: (v) => /^\d{2}:\d{2}$/.test(v),
      message: 'Please select a valid time.' },
    { id: 'event-capacity', errorId: 'capacity-error', validate: (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 500;
      },
      message: 'Capacity must be a whole number between 1 and 500.' }
  ];

  const setFieldError = (field, message) => {
    const input = document.getElementById(field.id);
    const errEl = document.getElementById(field.errorId);
    if (message) {
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      errEl.textContent = message;
      errEl.hidden = false;
    } else {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      errEl.textContent = '';
      errEl.hidden = true;
    }
  };

  const validateField = (field) => {
    const value = document.getElementById(field.id).value;
    const ok = field.validate(value);
    setFieldError(field, ok ? '' : field.message);
    return ok;
  };

  const clearForm = () => {
    form.reset();
    fields.forEach((f) => setFieldError(f, ''));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let firstInvalidId = null;
    let allValid = true;

    fields.forEach((field) => {
      const ok = validateField(field);
      if (!ok) {
        allValid = false;
        if (!firstInvalidId) firstInvalidId = field.id;
      }
    });

    if (!allValid) {
      track();
      if (firstInvalidId) document.getElementById(firstInvalidId).focus();
      return;
    }

    const newEvent = {
      id: nextId++,
      title:    sanitizeText(document.getElementById('event-title').value),
      author:   sanitizeText(document.getElementById('event-author').value),
      date:     sanitizeText(document.getElementById('event-date').value),
      time:     sanitizeText(document.getElementById('event-time').value),
      capacity: Number(document.getElementById('event-capacity').value)
    };

    submitBtn.disabled = true;
    setLoading(true);
    await wait(400);
    events.unshift(newEvent);
    renderEvents();
    setLoading(false);
    submitBtn.disabled = false;

    clearForm();
    track();
  };

  form.addEventListener('submit', onSubmit);
  fields.forEach((field) => {
    document.getElementById(field.id).addEventListener('blur', () => validateField(field));
  });

  /* ---------- Boot ---------- */

  refreshList();
})();
