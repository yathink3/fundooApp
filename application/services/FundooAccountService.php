<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooAccountService.php
 * @Purpose : rest api for fundoo app
 * @description: Create an Rest Api in codeigniter
 * @overview:api for login,signup,delete,passwordreset, etc
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 13-sep-2019
 *******************************************************************************************************************/

if (!defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . 'rabbitmq/sender.php';
class FundooAccountService extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->load->driver('cache', array('adapter' => 'redis', 'backup' => 'file'));
    }

    /**
     * @param: $email
     * @method:isEmailPresent() 
     * @return :bool or result
     */
    public function isEmailPresent($email)
    {
        $stmt = $this->db->conn_id->prepare('SELECT * FROM user WHERE email=:email');
        $stmt->execute(['email' => $email]);
        if ($result = $stmt->fetch(PDO::FETCH_ASSOC)) return $result;
        else return false;
    }


    /**
     * @param: $message
     * @method:sendmail will send email 
     * @return :true or false
     */
    function sendMail($subject, $hint, $message)
    {
        $body = '<h1>' . $hint . '</h1><p>' . $message . '</p>';
        $sender = new SendMail();
        return $sender->sendEmail('yathink3@gmail.com', $subject, $body);
    }


    /**
     * @param:$token or payload
     * @method:jwtToken()
     * @return :boolean or data
     */
    public function jwtToken($token, $method)
    {
        $jwt_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHR';
        if ($method)  return JWT::encode($token, $jwt_key);
        else {
            try {
                $data = JWT::decode($token, $jwt_key, true);
                return $data;
            } catch (Exception $e) {
                return false;
            }
        }
    }


    /**
     * @param:$tuserData
     * @method:signin()
     * @return :array of data
     */
    public function signin($userData)
    {
        if ($result = $this->isEmailPresent($userData['email'])) {
            if ($result['acc_status'] == TRUE) {
                if ($result['password'] === md5($userData['password'])) {
                    $this->cache->save($this->jwtToken($result['id'], true), $result);
                    return ['status' => 200, "message" => "login successful", "data" => $result];
                } else return ['status' => 503, "message" => "password mismatch"];
            } else return ['status' => 503, "message" => "validation not at done"];
        } else return ['status' => 404, "message" => "email does not exist."];
    }


    /**
     * @param:$tuserData
     * @method:signup()
     * @return :array of data
     */
    public function signup($userData)
    {
        if (!$this->isEmailPresent($userData['email'])) {
            if (!array_key_exists('created', $userData))  $userData['created'] = date("Y-m-d H:i:s");
            if (!array_key_exists('modified', $userData))  $userData['modified'] = date("Y-m-d H:i:s");
            $query = 'INSERT INTO user (firstname,lastname,email,password,created,modified) VALUES (:firstname,:lastname,:email,:password,:created,:modified)';
            if ($this->db->conn_id->prepare($query)->execute($userData)) {
                $result = $this->isEmailPresent($userData['email']);
                if ($this->sendMail('for validating email', 'please click below link to validating your account', 'http://localhost:4200/validate/?token=' . $this->jwtToken($result['id'], true)))
                    return ['status' => 200, "message" => "User account has been created token generated && email sent successfully."];
                else return ['status' => 503, "message" => "User account has been created token generated && email not sent"];
            } else return ['status' => 404, "message" => "Some problems occurred, please try again."];
        } else return ['status' => 404, "message" => "email already exist."];
    }


    /**
     * @param:$tuserData
     * @method:validateAccount()
     * @return :array of data
     */
    public function validateAccount($token)
    {
        if ($id = $this->jwtToken($token, false)) {
            $data = array();
            $data['id'] = $id;
            $data['acc_status'] = TRUE;
            $data['modified'] = date("Y-m-d H:i:s");
            $query = "UPDATE user SET  modified=:modified,acc_status=:acc_status WHERE id=:id";
            $stmt = $this->db->conn_id->prepare($query);
            if ($stmt->execute($data))  return ['status' => 200, "message" => "User validation successful"];
            else return ['status' => 503, "message" => "User validation not successful"];
        } else return ['status' => 404, "message" => "unknown person"];
    }


    /**
     * @param:$tuserData
     * @method:forgotPassword()
     * @return :array of data
     */
    public function forgotPassword($userData)
    {
        if ($result = $this->isEmailPresent($userData['email'])) {
            if ($this->sendMail('for recovering email', 'please click below link to reset your password', 'http://localhost:4200/resetPassword/?token= ' . $this->jwtToken($result['id'], true)))
                return ['status' => 200, "message" => "token generated && email sent successfully"];
            else return ['status' => 503, "message" => "token generated && email not sent"];
        } else return ['status' => 404, "message" => "wrong email address"];
    }


    /**
     * @param:$tuserData,$token
     * @method:resetPassword()
     * @return :array of data
     */
    public function resetPassword($token, $userData)
    {
        if ($id = $this->jwtToken($token, false)) {
            $userData['id'] = $id;
            $userData['password'] = md5($userData['password']);
            $userData['modified'] = date("Y-m-d H:i:s");
            $query = "UPDATE user SET  password=:password,modified=:modified WHERE id=:id";
            $stmt = $this->db->conn_id->prepare($query);
            if ($stmt->execute($userData))  return ['status' => 200, "message" => "password has been updated successfully."];
            else return ['status' => 503, "message" => "Some problems occurred, please try again."];
        } else return ['status' => 404, "message" => "unknown person"];
    }
}