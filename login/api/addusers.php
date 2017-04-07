<?php 
session_start();
error_reporting(0);
mysql_connect('localhost' , 'root' , '');
mysql_select_db('entries');


$data['success'] = 0;
$data['authen'] = 1;

if(!isset($_SESSION['islogin']) || $_SESSION['islogin']!="1"){
	$data['authen'] = 0;
}
else {
    $is_executed = mysql_query("INSERT into employee(`first_name` , `last_name` , `email`) values('".$_REQUEST['firstname']."', '".$_REQUEST['lastname']."', '".$_REQUEST['email']."')") or die(mysql_error());
    $data['success'] = 1;
}
echo json_encode($data);
?>