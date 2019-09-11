<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . 'rabbitmq/sender.php';
class User extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->jwt_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHR';
    }

    /**
     * @param:$id
     * @method:getRows()
     * @return :query_result
     */
    function getRows($id = "")
    {
        if (!empty($id)) {
            $query = $this->db->get_where('user', array('id' => $id));
            return $query->row_array();
        } else {
            $query = $this->db->get('user');
            return $query->result_array();
        }
    }

    /**
     * @param:$data
     * @method:insert()
     * @return :boolean
     */
    public function insert($data)
    {
        if (!array_key_exists('created', $data)) {
            $data['created'] = date("Y-m-d H:i:s");
        }
        if (!array_key_exists('modified', $data)) {
            $data['modified'] = date("Y-m-d H:i:s");
        }
        $insert = $this->db->insert('user', $data);
        if ($insert) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    }

    /**
     * @param:$data,$id
     * @method:update
     * @return :boolean
     */
    public function update($data, $id)
    {
        if (!empty($data) && !empty($id)) {
            $data['modified'] = date("Y-m-d H:i:s");
            $update = $this->db->update('user', $data, array('id' => $id));
            if ($update)
                return true;
            else return  false;
        } else {
            return false;
        }
    }

    /**
     * @param:$id
     * @method:delete()
     * @return :boolean
     */
    public function delete($id)
    {
        $delete = $this->db->delete('user', array('id' => $id));
        if ($delete)
            return true;
        else return false;
    }





    ///////////////////////////////////////////////USER OPERATIONS//////////////////////////////////////////////////

    /**
     * @param:$userData,$id
     * @method:signin()
     * @return :boolean or data
     */
    public function signin($userData, $users)
    {
        if ($users['password'] == md5($userData['password']))
            return true;
        else  return false;
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
        $update = $this->update(array('acc_status' => TRUE), $id);
        if ($update) return true;
        else return false;
    }
    /**
     * @param:$id
     * @method:deleteUser()
     * @return :boolean
     */
    public function deleteUser($id)
    {
        $delete = $this->delete($id);
        if ($delete)
            return true;
        else return false;
    }
    /**
     * @param: $email,$id
     * @method:isemailpresent to check wheather the email is present or not
     * @return :true or false
     */
    public function isEmailPresent($email, $id = 0)
    {
        $users = $this->getRows();
        foreach ($users as $user) {
            if ($user['email'] == $email && $user['id'] != $id)
                return $user['id'];
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
