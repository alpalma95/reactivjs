<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="module" src="/assets/index.js" defer></script>
  </head>
  <body>
    <div ref="app">
        <div ref="counter">
            <span ref="count" data-initial-count="1" style="display: none;">0</span>
            <button ref="incButton">Inc count</button>
        </div>
        <div ref="counter">
            <span ref="count" data-initial-count="2" style="display: none;">0</span>
            <button ref="incButton">Inc count</button>
        </div>
    </div>
  </body>
</html>