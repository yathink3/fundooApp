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
    }

    /**
     * @param:$id
     * @method:getRows()
     * @return :query_result
     */
    function getRows($id = "")
    {
        if (!empty($id)) {
            $stmt = $this->db->conn_id->prepare('SELECT * FROM user WHERE id=:id');
            $stmt->execute(['id' => $id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->db->conn_id->prepare('SELECT * FROM user');
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    /**
     * @param:$data
     * @method:insert()
     * @return :boolean
     */
    public function insert($data)
    {
        if (!array_key_exists('created', $data))   $data['created'] = date("Y-m-d H:i:s");
        if (!array_key_exists('modified', $data))   $data['modified'] = date("Y-m-d H:i:s");
        $query = 'INSERT INTO user (firstname,lastname,email,password,created,modified) VALUES (:firstname,:lastname,:email,:password,:created,:modified)';
        if ($this->db->conn_id->prepare($query)->execute($data)) return true;
        else  return false;
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
            $query = 'UPDATE user SET  firstname=:firstname,lastname=:lastname,email=:email,password=:password,created=:created,modified=:modified WHERE id=:id"';
            if ($this->db->conn_id->prepare($query)->execute($data))   return true;
            else return  false;
        } else  return false;
    }

    /**
     * @param:$id
     * @method:delete()
     * @return :boolean
     */
    public function delete($id)
    {
        $query = 'DELETE FROM user WHERE id=:id"';
        if ($this->db->conn_id->prepare($query)->execute(['id' => $id]))   return true;
        else return false;
    }
}