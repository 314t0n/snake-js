<?php

include('config/conf.php');
include('lib/Rest.php');
include('lib/API.php');
include('lib/Database.php');
include('lib/Session.php');

Session::init();

$models = array();
foreach (new DirectoryIterator('model') as $file) {
    if ($file->isFile()) {
        $model = preg_replace("/\\.[^.\\s]{3,4}$/", "", $file->getFilename());
        array_push($models, strtolower($model));
    }
}

$request = explode('/', $_SERVER['QUERY_STRING']);

if (in_array(strtolower($request[0]), $models)) {    
    $class = ucfirst($request[0]);    
    include('model/'.$request[0].'.php');    
    $app = new PitonAPI\API(new $class(),$request);
} else {
    header("HTTP/1.0 404 Not Found");
}


//$app = new API(new Rest());
?>
