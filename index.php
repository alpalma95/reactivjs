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
      app
      <br>
      <span ref="count"> app > count</span>
      <div ref="text">
        app > text
        <br>
        <span ref="count"> app > text > count</span>
      </div>
      <ul ref="list">
        <li ref="listItem"></li>
        <li ref="listItem"></li>
        <li ref="listItem"></li>
      </ul>
    </div>
  </body>
</html>