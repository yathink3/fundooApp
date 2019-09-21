<?php
require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

require APPPATH . 'rabbitmq/receive.php';
// include '/var/www/yathin/fundooapp/application/rabbitmq/receive.php';
class SendMail
{
    /**
     * @method sendEmail()
     * @var connection creates the AMPQSTREAMconnection
     * @return bool
     */
    public function sendEmail($toEmail, $subject, $body)
    {
        $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $channel = $connection->channel();
        $channel->queue_declare("queue", false, false, false, false);
        $data = json_encode(array(
            "from" => "manoj.mk.24.mk@gmail.com",
            "from_email" => "manoj.mk.24.mk@gmail.com",
            "to_email" => $toEmail,
            "subject" => $subject,
            "message" => $body
        ));
        $msg = new AMQPMessage($data, array('delivery_mode' => 2));
        $channel->basic_publish($msg, '', "queue");
        $obj = new Receiver();
        $sent = $obj->receiverMail();
        $channel->close();
        $connection->close();
        if ($sent)
            return true;
        else return false;
        // return false;
    }
}