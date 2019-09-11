<?php
require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

require APPPATH . 'rabbitmq/receive.php';
class SendMail
{
    /**
     * @method sendEmail()
     * @var connection creates the AMPQSTREAMconnection
     * @return void
     */
    public function sendEmail($toEmail, $subject, $body)
    {
        $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $channel = $connection->channel();
        // $emailConstant = new EmailConstant();
        /*
            name: hello
            passive: false
            durable: true // the queue will survive server restarts
            exclusive: false // the queue can be accessed in other channels
            auto_delete: false //the queue won't be deleted once the channel is closed.
            */
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
        /**
         * calling the receiver
         */
        $obj = new Receiver();
        $sent = $obj->receiverMail();
        $channel->close();
        $connection->close();
        if ($sent)
            return true;
        else return false;
    }
}
