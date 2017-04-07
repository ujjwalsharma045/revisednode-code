<?php
session_start(); 
$data = array();
$data['success'] = 0;
if(isset($_SESSION['islogin']) && $_SESSION['islogin']=="1"){  
    session_destroy();
    $data['success'] = 1;
}
echo json_encode($data);
?>