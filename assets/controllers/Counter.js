import { state } from '../lib/State.js';

export default function CounterController(counterView) {
  let $ = {
    counter: [...document.querySelectorAll('[ref="counter"')],
    incButton: document.querySelector('[ref="incButton"]'),
    double: counterView.querySelector('[ref="double"]')
  };

  let $counter = state(3);
  let $double = state($counter.val * 2);

  let subscription = $counter.subscribe((val) => {
    $.counter.forEach(counter => counter.innerHTML = val);
    $double.val = val * 2
  });

  let doubleSubscription = $double.subscribe((val) => {
    $.double.textContent = val
  })

  $.incButton.addEventListener('click', () => {
    $counter.val += 1;
  });
}
