<?php 
session_start();
error_reporting(0);
if(isset($_SESSION['islogin']) && $_SESSION['islogin']=="1"){
	$data = 1;
}
else {
	$data =  0;
}
echo json_encode($data);
?>