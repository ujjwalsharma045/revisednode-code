<?php 
session_start();
error_reporting(0);
mysql_connect('localhost' , 'root' , '');
mysql_select_db('entries');
$data = array();
$data['records'] = array();
$data['authen'] = 1;
if(!isset($_SESSION['islogin']) || $_SESSION['islogin']!="1"){
	$data['authen'] = 0;
}
else {	
	$is_executed = mysql_query("select * from employee where id ='".$_REQUEST['id']."'") or die(mysql_error());
	if(mysql_num_rows($is_executed)>0){
		$result = mysql_fetch_array($is_executed , MYSQL_ASSOC);
		$data['records'] = $result;
	}
}
echo json_encode($data);
?>