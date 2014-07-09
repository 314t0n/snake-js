<?php

class Session{

    public static function init(){
        @session_start();
    }
    public static function destroy(){
        session_destroy();
    }
    public static function set($key,$value){
        $_SESSION[$key] = $value;
    }
    public static function get($key){
        if (isset($_SESSION[$key]))
            return $_SESSION[$key];       
        else
            return false;
    }
    public static function timeout() {
        if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 7200)) {
            session_unset();     
            session_destroy();
        }
        $_SESSION['LAST_ACTIVITY'] = time(); 
    }
}
?>
