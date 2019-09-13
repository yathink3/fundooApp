<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Service extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user');
        $this->jwt_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHR';
        $this->load->driver('cache', array('adapter' => 'redis', 'backup' => 'file'));
    }
    /**
     * @param:$userData,$id
     * @method:signin()
     * @return :boolean or data
     */
    public function signin($userData, $users)
    {
        if ($users['password'] == md5($userData['password'])) {
            $this->cache->save($this->generateToken($users['id']), $users);
            return true;
        } else  return false;
    }
    /**
     * @param:$userData,$id
     * @method:signin()
     * @return :boolean or data
     */
    public function validate($id)
    {
        $users = $this->getRows($id);
        if ($users['acc_status'] == TRUE)
            return $users;
        else  return false;
    }

    /**
     * @param:$userData
     * @method:signup()
     * @return :boolean 
     */
    public function signup($userData)
    {
        $userData['password'] = md5($userData['password']);
        $insert = $this->insert($userData);
        if ($insert) {
            return $this->isEmailPresent($userData['email']);
        } else return false;
    }

    /**
     * @param:$userData,$id
     * @method:updateUser()
     * @return :boolean
     */
    public function updateUser($userData, $id)
    {
        $userData['password'] = md5($userData['password']);
        $update = $this->update($userData, $id);
        if ($update) return true;
        else return false;
    }

    /**
     * @param:$id
     * @method:getUsers()
     * @return :boolean or data
     */
    public function getUsers($id)
    {
        $users = $this->getRows($id);
        if (!empty($users)) return $users;
        else return false;
    }
    /**
     * @param:$userData,$id
     * @method:updateUser()
     * @return :boolean
     */
    public function validateUser($id)
    {
        if ($update = $this->update(array('acc_status' => TRUE), $id)) return true;
        else return false;
    }
    /**
     * @param:$id
     * @method:deleteUser()
     * @return :boolean
     */
    public function deleteUser($id)
    {
        if ($delete = $this->delete($id)) return true;
        else return false;
    }
    /**
     * @param: $email,$id
     * @method:isemailpresent to check wheather the email is present or not
     * @return :true or false
     */
    public function isEmailPresent($email, $id = 0)
    {
        foreach ($users = $this->getRows() as $user) {
            if ($user['email'] == $email && $user['id'] != $id)   return $user['id'];
        }
        return false;
    }

    /**
     * @param:$payload
     * @method:generateToken()
     * @return :token
     */
    public function generateToken($payload)
    {
        return JWT::encode($payload, $this->jwt_key);
    }

    /**
     * @param:$token
     * @method:checkToke()
     * @return :boolean or data
     */
    public function checkToken($token)
    {
        try {
            $data = JWT::decode($token, $this->jwt_key, true);
            return $data;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param: $message
     * @method:sendmail will send email 
     * @return :true or false
     */
    function sendMail($message)
    {
        $sender = new SendMail();
        return $sender->sendEmail(
            'yathink3@gmail.com',
            'for recovering email',
            '<h1>please click below link to reset your password</h1><p>' . $message . '</p>'
        );
    }
    function validateMail($message)
    {
        $sender = new SendMail();
        return $sender->sendEmail(
            'yathink3@gmail.com',
            'for validating email',
            '<h1>please click below link to validating your account</h1><p>' . $message . '</p>'
        );
    }
}
