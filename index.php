<?php

include('snake-rest/lib/Session.php');

Session::init();

Session::set('active',true);

include('snake.html');

?>   

