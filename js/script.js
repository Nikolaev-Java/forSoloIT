/* 'use strict' */
new Gallery(document.getElementById('test'), { name: 'general', dots: false, arrow: true, gap: 17 });
new Gallery(document.getElementById('gallery-1'), { name: 'none', dots: true });
new Gallery(document.getElementById('gallery-2'), { name: 'flower', dots: true });
new Gallery(document.getElementById('gallery-3'), { name: 'watch', dots: true });
new Gallery(document.getElementById('gallery-4'), { name: 'ring', dots: true });
new Gallery(document.getElementById('gallery-5'), { name: 'watchClone', dots: true });

const tabLinks = document.querySelectorAll('.tabs__item'),
  tabElements = document.querySelectorAll('.products'),
  controlAmount = document.querySelectorAll('.control-amount');
tabLinks.forEach((element) =>
  element.addEventListener('click', hadleSwitchTabs));
controlAmount.forEach(element =>
  element.addEventListener('click', handleControlAmount, false));

function hadleSwitchTabs(event) {
  const id = event.target.getAttribute('href').replace('#', '');
  event.preventDefault();
  tabLinks.forEach(element => { element.classList.remove('active') });
  tabElements.forEach(element => { element.classList.remove('active') });
  event.target.classList.add('active');
  document.getElementById(id).classList.add('active');
}
function handleControlAmount(event) {
  if (!event.target.closest('.control-amount__btn')) {
    return false;
  }
  const btn = event.target;
  const counterElement = btn.closest('.control-amount').querySelector('.control-amount__info');
  let counter = +counterElement.textContent;
  if (btn.closest('.control-amount__btn--decrease') && counter > 0) {
    counter--;
  } else if (btn.closest('.control-amount__btn--increase')) {
    counter++;
  }
  counterElement.textContent = counter;
}
