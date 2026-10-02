const modal = document.querySelector('#care-modal');
const modalBody = document.querySelector('#modal-body');
const modalTitle = document.querySelector('#modal-title');
const modalClose = document.querySelector('#modal-close');
const bookingForm = document.querySelector('#booking-form');
const doctorSearch = document.querySelector('#doctor-search');
const specialtyFilter = document.querySelector('#specialty-filter');
const locationFilter = document.querySelector('#location-filter');
const doctorGrid = document.querySelector('#doctor-grid');
const noResults = document.querySelector('#no-results');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const siteHeader = document.querySelector('[data-header]');
let lastFocused = null;

function openModal(type) {
  if (!modal) return;
  modalTitle.textContent = type === 'portal' ? 'Patient portal preview' : 'Book an appointment';
  if (type === 'portal') {
    modalBody.innerHTML = '<div class="portal-preview"><div class="portal-symbol">↗</div><h3>A calmer way to stay connected.</h3><p>The CarePilot patient portal is not connected in this preview. In a live service, this space can hold appointments, care plans, and shared results with appropriate security and access controls.</p><button class="button button-primary" type="button" data-close-modal>Got it</button></div>';
  } else {
    modalBody.innerHTML = '<p class="modal-intro">Tell us a little about what you need. This preview does not send information or confirm a real appointment.</p><form id="booking-form" class="booking-form"><label>Full name<input name="name" type="text" autocomplete="name" required placeholder="Your name"></label><label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>What can we help with?<select name="reason" required><option value="">Choose a care option</option><option>Find a doctor</option><option>Book a visit</option><option>Explore a service</option><option>Something else</option></select></label><label>Preferred contact<select name="contact" required><option value="">Choose one</option><option>Phone</option><option>Email</option></select></label><label class="form-full">Message <textarea name="message" rows="3" placeholder="Anything you would like us to know?"></textarea></label><div class="form-full form-actions"><button class="button button-primary" type="submit">Preview request <span aria-hidden="true">→</span></button><small>No data is sent from this demo.</small></div></form>';
  }
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose.focus();
  const newForm = document.querySelector('#booking-form');
  if (newForm) newForm.addEventListener('submit', handleBooking);
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocused) lastFocused.focus();
  lastFocused = null;
}

function handleBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  modalTitle.textContent = 'You are all set to preview';
  modalBody.innerHTML = '<div class="success-state"><div class="success-mark">✓</div><h3>Thanks — your preview request is ready.</h3><p>This demo keeps everything in your browser and has not sent an appointment request. Connect a secure scheduling service before using this flow with real patients.</p><button class="button button-primary" type="button" data-close-modal>Close preview</button></div>';
}

function filterDoctors() {
  if (!doctorGrid) return;
  const query = (doctorSearch?.value || '').toLowerCase().trim();
  const specialty = (specialtyFilter?.value || '').toLowerCase();
  const location = (locationFilter?.value || '').toLowerCase();
  const cards = [...doctorGrid.querySelectorAll('.doctor-card')];
  let visible = 0;
  cards.forEach((card) => {
    const matches = !query || card.dataset.search.includes(query);
    const matchesSpecialty = !specialty || card.dataset.specialty === specialty;
    const matchesLocation = !location || card.dataset.location === location;
    const show = matches && matchesSpecialty && matchesLocation;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (noResults) noResults.hidden = visible !== 0;
}

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open-modal]');
  if (opener) openModal(opener.dataset.openModal);
  if (event.target.closest('[data-close-modal]') || event.target === modal) closeModal();
});

modalClose?.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
});
[doctorSearch, specialtyFilter, locationFilter].forEach((control) => control?.addEventListener('input', filterDoctors));

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  mobileNav?.classList.toggle('is-open', !open);
});
mobileNav?.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  mobileNav.classList.remove('is-open');
}));

function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.querySelectorAll('.location-row').forEach((row) => row.addEventListener('click', () => {
  document.querySelectorAll('.location-row').forEach((item) => item.classList.remove('is-selected'));
  row.classList.add('is-selected');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .12 });
document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
