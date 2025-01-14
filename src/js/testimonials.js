const container = document.getElementById('testimonials');
const testimonials = document.querySelectorAll('#testimonials > div');
const buttons = document.querySelectorAll('#testimonial-buttons > button');

const INTERVAL = 10000;
const TRANSITION_DURATION = 500;

const total = testimonials.length;
let active = 0;
let lastInteractionTime = 0;

function updateContainerHeight() {
  container.style.height = `${testimonials[active].clientHeight}px`;
}

function updateTestimonials() {
  for (let i = 0; i < total; i++) {
    const testimonial = testimonials[i];
    const button = buttons[i];
    if (i === active) {
      testimonial.classList.remove('hidden');
      setTimeout(() => {
        testimonial.classList.remove('opacity-0');
      });
      button.classList.add('bg-neutral-600');
    } else {
      testimonial.classList.add('opacity-0');
      setTimeout(() => {
        testimonial.classList.add('hidden');
      }, TRANSITION_DURATION);
      button.classList.remove('bg-neutral-600');
    }
  }
  testimonials.forEach((testimonial, i) => {
    if (i === active) {
      testimonial.classList.remove('hidden');
      setTimeout(() => {
        testimonial.classList.remove('opacity-0');
      });
    } else {
      testimonial.classList.add('opacity-0');
      setTimeout(() => {
        testimonial.classList.add('hidden');
      }, TRANSITION_DURATION);
    }
  });
  updateContainerHeight()
}

window.addEventListener('resize', () => {
  // Remove transition so change happens instantly, then re-add
  container.classList.remove('height-transition');
  updateContainerHeight();
  container.classList.add('height-transition');
});

updateContainerHeight();

setInterval(() => {
  if (Date.now() - lastInteractionTime > INTERVAL) {
    active = (active + 1) % buttons.length;
    updateTestimonials();
  }
}, INTERVAL);

function setActiveTestimonial(index) {
  active = index;
  updateTestimonials();
  lastInteractionTime = Date.now();
}
