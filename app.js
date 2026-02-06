const donorForm = document.getElementById('donorForm');
const feed = document.getElementById('feed');
const routeResult = document.getElementById('routeResult');
const radius = document.getElementById('radius');
const badges = document.getElementById('badges');

const mealsRescued = document.getElementById('mealsRescued');
const kgSaved = document.getElementById('kgSaved');
const socialCredits = document.getElementById('socialCredits');

let listings = [];
let metrics = { meals: 0, kg: 0, credits: 0 };

function safeId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function randomDistance() {
  return Math.floor(Math.random() * 14) + 1;
}

function renderMetrics() {
  mealsRescued.textContent = metrics.meals;
  kgSaved.textContent = metrics.kg;
  socialCredits.textContent = metrics.credits;
}

function awardBadges() {
  badges.innerHTML = '';
  if (metrics.credits >= 10) badges.innerHTML += '<span class="badge">Starter Rescuer</span>';
  if (metrics.credits >= 30) badges.innerHTML += '<span class="badge">Community Hero</span>';
  if (metrics.credits >= 60) badges.innerHTML += '<span class="badge">Hunger Fighter</span>';
}

function bestRouteSuggestion() {
  if (!listings.length) {
    routeResult.textContent = 'Create listings to see route recommendations.';
    return;
  }

  const maxDistance = Number(radius.value);
  const candidates = listings
    .filter((item) => item.status !== 'Delivered')
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => {
      if (a.deadline !== b.deadline) return a.deadline.localeCompare(b.deadline);
      return a.distance - b.distance;
    });

  if (!candidates.length) {
    routeResult.textContent = `No listings found within ${maxDistance} km radius.`;
    return;
  }

  const best = candidates[0];
  routeResult.innerHTML = `<strong>Suggested pickup:</strong> ${best.item} at ${best.location} (${best.distance} km, deadline ${best.deadline})`;
}

function nextStatus(current) {
  if (current === 'Posted') return 'Claimed';
  if (current === 'Claimed') return 'Picked Up';
  if (current === 'Picked Up') return 'Delivered';
  return 'Delivered';
}

function renderFeed() {
  if (!listings.length) {
    feed.className = 'feed empty';
    feed.textContent = 'No live listings yet.';
    return;
  }

  feed.className = 'feed';
  feed.innerHTML = listings
    .map(
      (entry) => `
      <article class="listing">
        <span class="status">${entry.status}</span>
        <h4>${entry.item} (${entry.qty} kg)</h4>
        <p>📍 ${entry.location} | ⏱ ${entry.deadline} | 🚴 ${entry.distance} km</p>
        <button onclick="advance('${entry.id}')">Advance Status</button>
      </article>
    `,
    )
    .join('');
}

window.advance = function advance(id) {
  listings = listings.map((entry) => {
    if (entry.id !== id) return entry;
    const updated = { ...entry, status: nextStatus(entry.status) };
    if (updated.status === 'Delivered' && entry.status !== 'Delivered') {
      metrics.meals += Math.ceil(updated.qty * 4);
      metrics.kg += Number(updated.qty);
      metrics.credits += 10;
    }
    return updated;
  });

  renderFeed();
  renderMetrics();
  awardBadges();
  bestRouteSuggestion();
};

function createListing(item, qty, deadline, location) {
  listings.unshift({
    id: safeId(),
    item,
    qty,
    deadline,
    location,
    distance: randomDistance(),
    status: 'Posted',
  });
}

function seedDemoData() {
  createListing('Rice and Dal', 5, '16:00', 'Campus Gate 2');
  createListing('Chapati and Curry', 3, '15:30', 'Hostel Block A');
}

if (donorForm) {
  donorForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const item = document.getElementById('foodItem').value.trim();
    const qty = Number(document.getElementById('quantity').value);
    const deadline = document.getElementById('deadline').value;
    const location = document.getElementById('location').value.trim();

    createListing(item, qty, deadline, location);

    donorForm.reset();
    renderFeed();
    bestRouteSuggestion();
  });
}

if (radius) {
  radius.addEventListener('input', bestRouteSuggestion);
}

seedDemoData();
renderFeed();
bestRouteSuggestion();
renderMetrics();
awardBadges();
