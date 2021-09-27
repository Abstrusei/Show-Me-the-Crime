<?php

$to = "deco1800@atpc.xyz";
$subject = "SMTC Contact Form";

$message = "<p>".$_POST['subject']."</p>";
$from_addr = $_POST['fullname'].'<'.$_POST['emailaddress'].'>';

$header = "From: ".$from_addr." \r\n";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-type: text/html\r\n";

$retval = mail($to,$subject,$message,$header);

if( $retval == true ) {
   echo "Message sent successfully...";
}else {
   echo "Message could not be sent...";
}

header("Refresh:5; url=..");
