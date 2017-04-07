<?php 
session_start();
error_reporting(0);
mysql_connect('localhost' , 'root' , '');
mysql_select_db('entries');
$data = array();

$data['success'] = 0;
$data['authen'] = 1;
if(!isset($_SESSION['islogin']) || $_SESSION['islogin']!="1"){
   $data['authen'] = 0;
}
else {
   $is_executed = mysql_query("delete from employee where id ='".$_REQUEST['id']."'") or die(mysql_error());
   if(mysql_num_rows($is_executed)>0){
		
   }
   $data['success'] = 1;
}
echo json_encode($data);
?>