<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/mistakes/SendMailSmtpClass.php';

$method = $_SERVER['REQUEST_METHOD'];
$subject = 'Ошибка на сайте';
$form_name = ' Форма ошибки';
$page = $_SERVER['HTTP_REFERER'];
$time = date("Hч:iм - d.m.y г.  ");
$site_name = "Ваше название сайта";
$from = "$site_name<admin@yandex.ru>";
$mailto = 'Куда будут приходить письма';
$mailSMTP = new SendMailSmtpClass('lab.ves@yandex.ru', '1qw23e$r', 'ssl://smtp.yandex.ru', $site_name, 465);


if($method === 'POST'){
    $mistake_msg = mistakeStability($_POST['mistake_message']);
    $mistake = full_trim($_POST['mistake_string']);
    $mistake_full = mistakeStability($_POST['mistake_full_text']);

    $message = "<table align='center' width='70%' style='text-align:center; border:1px solid #ddd; margin-bottom: 20px; background-color: transparent;border-spacing: 0;border-collapse: collapse'>
<tr style='border: 1px solid #ddd;'><th colspan='2' style='padding: 10px 0'>$form_name</th></tr>
<tr style='border: 1px solid #ddd;'>
<td width='30%' style='padding: 10px 0; border-right: 1px solid #ddd'><strong>Сообщение:</strong></td>
<td style='padding: 10px;'>$mistake_msg</td>
</tr>
<tr style='border: 1px solid #ddd;'>
<td style='padding: 10px 0; border-right: 1px solid #ddd'><strong>Строка с ошибкой:</strong></td>
<td style='padding: 10px;'>$mistake</td>
</tr>
<tr style='border: 1px solid #ddd;'>
<td style='padding: 10px 0; border-right: 1px solid #ddd'><strong>Полный текст с ошибкой:</strong></td>
<td style='padding: 10px;'>$mistake_full</td>
</tr>
<tr style='border: 1px solid #ddd;'><td style='border-right: 1px solid #ddd;padding: 10px 0 '><strong>Время и дата отправки письма</strong></td><td>$time </td></tr>
<tr style='border: 1px solid #ddd;'><td style='border-right: 1px solid #ddd;padding: 10px 0 '><strong>Страница заполнения формы</strong></td><td>$page</td></tr>
</table>";

    $headers= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n"; // кодировка письма
    $headers .= "From: $from\r\n"; // от кого письмо
    if($_POST['mistake_fu_bots'] == '') $result =  $mailSMTP->send($mailto, $subject, $message, $headers);

    if($result){
        echo "<div class='text-center text-success' style='font-size:20px;padding: 30px 0'>Спасибо за вашу помощь!</div>";
    }else{
        echo "<div class='server-answer' style='border: 1px dashed #00adff; padding: 20px 15px;border-radius: 10px;font-size: 18px;'><span style='color: red'>Что-то пошло не так.</span></div>";
    }

}else{
    die();
}


function mistakeStability($string){
    return full_trim(strip_tags(($string)));
}

function full_trim($str){
    return stripslashes(trim(preg_replace('/\s{2,}/', ' ', $str)));

}