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
          <span :rv-text="name"><?= $person->name ?? '' ?></span>
          <button :onclick="deletePerson" :data-deletes="id">
            Delete person <rv-text :="id"><?= $person->id ?? '' ?></rv-text>
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
    <style>
      .class1 {
        color: red;
      }
      .class2 {
        color: blue;
      }
      .class3 {
        color: green;
      }
    </style>
  </head>
  <body>
        <h1> Generated server side </h1>
        <div data-ref="count"></div>
        <!-- "Props" are just dataset properties -->
        <div data-ref="CounterController" data-initial-count="1" :rv-custom="t">
            <span :rv-text="count" :test="count" :rv-custom="t">0</span>
            <button :onclick="inc" data-increment-by="1">Inc count</button>
        </div>
        <div data-ref="CounterController" data-initial-count="2">
            <span  :test="count">Count is: <rv-text :="count">2</rv-text></span>
            <button :onclick="inc" data-increment-by="1">Inc count</button>
        </div>

        <ul data-ref="SSR" data-track-by="id" data-populate='<?= json_encode($people)?>'>
          <?php foreach($people as $person):
            echo $PersonComponent($person);
          endforeach; ?>
          <?php if(empty($people)):?>
              <template>
                <?= $PersonComponent() ?>
              </template>
          <?php endif; ?>
        </ul>

        <div data-ref="FormController">
          <input type="text" :rv-model="text">
          <p :rv-text="text"></p>
          <p :rv-if="text">Input is not empty!</p>
          <button :onclick="clear">clear input</button>
        </div>
    <div data-ref="app"> <!---Hydrated client side --> </div>
  </body>
</html>