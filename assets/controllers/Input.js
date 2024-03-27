import { $name, setName } from '../services/InputService.js';

export default function InputController(input) {
    const $ = {
        inputElement: input.querySelector('input'),
        pElement: input.querySelector('[data-content]')
    }

    $name.subscribe((val) => ($.pElement.textContent = val));

    $.inputElement.addEventListener(
        'input',
        () => $name.val = $.inputElement.value
    );
}
