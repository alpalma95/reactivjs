const views = [...document.querySelectorAll('[data-controller]')];

views.forEach(async (view) => {
  /** @type {string} */
  const controllerName = view.getAttribute('data-controller').replaceAll('.', '/');

  const controller = await import(`../controllers/${controllerName}.js`);
  controller.default(view)
});

