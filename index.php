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
  // $people_ssr = []
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
            <span :data-text="count" :test="count">0</span>
            <button :onclick="inc" data-increment-by="1">Inc count</button>
        </div>
        <div ref="CounterController" data-initial-count="2">
            <span :data-text="count" :test="count">0</span>
            <button :onclick="inc" data-increment-by="2">Inc count</button>
        </div>
  
        <div ref="FormController">
          <input type="text" :data-model="text">
          <p :data-text="text"></p>
          <p :data-if="text">Input is not empty!</p>
          <button :onclick="clear">clear input</button>
        </div>
    <div ref="app"> <!---Hydrated client side --> </div>
  </body>
</html>