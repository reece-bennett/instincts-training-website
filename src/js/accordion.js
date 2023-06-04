const accordionHeaders = document.querySelectorAll('[data-module="accordion"]');
accordionHeaders.forEach(accordionHeader => {
  let target = accordionHeader.parentElement.nextElementSibling;
  target.hidden = true
  accordionHeader.onclick = () => {
    let expanded = accordionHeader.getAttribute('aria-expanded') === 'true' || false;
    accordionHeader.setAttribute('aria-expanded', !expanded);
    target.hidden = expanded;
  }
})
