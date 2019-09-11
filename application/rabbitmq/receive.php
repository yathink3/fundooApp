<?php
require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
// require_once '/var/www/html/codeigniter/RabbitMQ/vendor/autoload.php';
class Receiver
{
    public function receiverMail()
    {
        $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $channel = $connection->channel();
        $channel->queue_declare("queue", false, false, false, false);
        $callback = function ($msg) {
            // echo " * Message received", "\n";
            $data = json_decode($msg->body, true);
            $from = $data['from'];
            $from_email = $data['from_email'];
            $to_email = $data['to_email'];
            $subject = $data['subject'];
            $message = $data['message'];
            /**
             * Create the Transport
             */
            $transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
                ->setUsername('manoj.mk.24.mk@gmail.com')
                ->setPassword('123manoj24$');
            /**
             * Create the Mailer using your created Transport
             */
            $mailer = new Swift_Mailer($transport);
            /**
             * Create a message
             */
            $message = (new Swift_Message())
                ->setSubject($subject)
                ->setFrom([$data['from'] => 'www.fundoo.com'])
                ->setTo([$to_email])
                ->addPart($message, 'text/html');
            /**
             * Send the message
             */
            $result = $mailer->send($message);
            $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
        };
        $channel->basic_consume("queue", '', false, true, false, false, $callback);
        while (count($channel->callbacks)) {
            try {
                $channel->wait();
                return true;
            } catch (Exception $e) {
                return false;
            }
        }
        $channel->close();
        $connection->close();
    }
}