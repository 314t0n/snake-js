<?php

class Scores implements PitonAPI\Rest {

    private $db;

    function __construct() {
        try {
            $this->db = new Database();
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    public function index_get($args = null) {
        $message = array(
            'message' => 'Twas GET request!'
        );

        try {

            $sql = 'SELECT name,score,date FROM "Piton" order by score desc';

            $sth = $this->db->prepare($sql);

            $sth->execute();
                        
            $message['message'] = $sth->fetchAll(PDO::FETCH_ASSOC);
            $message['status'] = 'success';
            
        } catch (Exception $e) {
            $message['status'] = 'error';
            $message['message'] = $e->getMessage();
        }

        echo PitonAPI\API::responseJSON($message);
    }

    public function index_post($args = null) {
        
        $message = array(
            'message' => 'Twas POST request!',
            'status' => 'error'
        );  
        
        if($_POST){
       
         try {

            $sql = 'INSERT INTO "Piton" 
                (name,score,ip,date)
                values(:name,:score,:ip,:date)';

            $sth = $this->db->prepare($sql);

            $sth->execute(array(
                ':name'=> $_POST['name'],
                ':score'=> $_POST['score'],
                ':ip'=> $_SERVER['REMOTE_ADDR'],
                ':date'=> date('Y-m-d H:i:s'),
            ));
             
            $message['message'] = $_POST['name'] . ' : ' . $_POST['score'] . ' inserted.';
            $message['status'] = 'success';
            
        } catch (Exception $e) {
            $message['status'] = 'error';
            $message['message'] = $e->getMessage();
        }
        
       }else{
           $message['message'] = 'No data';
       }

       echo PitonAPI\API::responseJSON($message);
    }

    private function getScores() {
        
    }

}

?>
