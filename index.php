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
    <div ref="app">
        <!-- "Props" are just dataset properties -->
        <div ref="count"></div>
        <div ref="CounterController" data-initial-count="1">
            <span ref="count">0</span>
            <button ref="incButton">Inc count</button>
        </div>
        <div ref="CounterController" data-initial-count="2">
            <span ref="count">0</span>
            <button ref="incButton">Inc count</button>
        </div>
    </div>
  </body>
</html>