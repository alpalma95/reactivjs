<?php 
  $people_ssr = [
    [
      "id" => 1,
      "name" => "Test 1"
    ],
    [
      "id" => 2,
      "name" => "Test 2"
    ],
    [
      "id" => 3,
      "name" => "Test 3"
    ]
  ];
  $people = [];
  foreach ($people_ssr as $person) {
    $people[] = (object)$person;
  }

  $PersonComponent = function($person = null) {
    return <<<HTML
        <li ref="person" :data-key="id">
          <span :z-text="name"><?= $person->name ?? '' ?></span>
          <button :onclick="deletePerson" :data-deletes="id">
            Delete person <span :z-text="id"><?= $person->id ?? '' ?></span>
          </button>
        </li>
    HTML;
  };
  
?> 

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/index.js"></script>
  </head>
  <body>
        <h1> Generated server side </h1>
        <div ref="count"></div>
        <!-- "Props" are just dataset properties -->
        <div ref="CounterController" data-initial-count="1">
            <span :z-text="count" :test="count">0</span>
            <button :onclick="inc" data-increment-by="1">Inc count</button>
        </div>
        <div ref="CounterController" data-initial-count="2">
            <span :z-text="count" :test="count">0</span>
            <button :onclick="inc" data-increment-by="2">Inc count</button>
        </div>

        <ul ref="SSR" data-track-by="id" data-populate='<?= json_encode($people)?>'>
          <?php foreach($people as $person):
            echo $PersonComponent($person);
          endforeach; ?>
          <?php if(empty($people)):?>
              <template>
                <?= $PersonComponent() ?>
              </template>
          <?php endif; ?>
        </ul>

        <div ref="FormController">
          <input type="text" :z-model="text">
          <p :z-text="text"></p>
          <p :z-if="text">Input is not empty!</p>
          <button :onclick="clear">clear input</button>
        </div>
    <div ref="app"> <!---Hydrated client side --> </div>
  </body>
</html>