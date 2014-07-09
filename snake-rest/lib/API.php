<?php

namespace PitonAPI;

class API {

    //put your code here
    private $model;

    function __construct(Rest $model, $args = null) {
        $this->model = $model;       
        $this->handleRequest($args);
    }

    private function handleRequest($args) {
        $method = $_SERVER['REQUEST_METHOD'];
        $request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
        try {
            switch ($method) {
                case 'PUT':                   
                    break;
                case 'POST':                   
                    $this->model->index_post($args);
                    break;
                case 'GET':
                    $this->model->index_get($args);
                    break;
                case 'HEAD':
                    //rest_head($request);
                    break;
                case 'DELETE':
                    //rest_delete($request);
                    break;
                case 'OPTIONS':
                    //rest_options($request);
                    break;
                default:
                    //rest_error($request);
                    break;
            }
        } catch (Exception $e) {
            
        }
    }

    public static function responseJSON($data) {
        header('Content-type: application/json; charset=utf-8');

        return json_encode($data);
    }
    
     public static function generateKey() {       
         
        $key = md5(str_shuffle("ASd,12k35mlkmtadfadf6896scv,olv,odfaspőr234234365"));

        return $key;
    }

    
}

?>
