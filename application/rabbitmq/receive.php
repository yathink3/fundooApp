<?php
require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;

class Receiver
{
    /**
     * @method receiverMail()
     * @var connection creates the AMPQSTREAMconnection
     * @return bool
     */
    public function receiverMail()
    {
        $connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $channel = $connection->channel();
        $channel->queue_declare("queue", false, false, false, false);
        $callback = function ($msg) {
            $data = json_decode($msg->body, true);
            $transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
                ->setUsername('manoj.mk.24.mk@gmail.com')
                ->setPassword('123manoj24$');
            $mailer = new Swift_Mailer($transport);
            $message = (new Swift_Message($data['subject']))
                ->setFrom([$data['from'] => 'www.fundoo.com'])
                ->setTo([$data['to_email']])
                ->addPart($data['message'], 'text/html');
            $mailer->send($message);
            $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
        };
        $channel->basic_consume("queue", '', false, true, false, false, $callback);
        while (count($channel->callbacks)) {
            try {
                $channel->wait();
                return true;
            } catch (Exception $e) {
                return true;
            }
        }
    }
}