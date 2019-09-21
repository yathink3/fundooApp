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
class FundooNotesService extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->load->driver('cache', array('adapter' => 'redis', 'backup' => 'file'));
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
     * @method:signup()
     * @return :array of data
     */
    public function createNote($notesData)
    {
        if ($notesData['rem']) {
            $notesData['rem'] = date("Y-m-d H:i:s", strtotime($notesData['rem']));
        } else {
            $notesData['rem'] = null;
        }
        if (!array_key_exists('created', $notesData))  $notesData['created'] = date("Y-m-d H:i:s");
        $query = 'INSERT INTO notes (user_id,title,description,reminder,color_id,label_id,created) VALUES (:userid,:title,:desc,:rem,:colorid,:labelid,:created)';
        if ($this->db->conn_id->prepare($query)->execute($notesData))
            return ['status' => 200, "message" => "Note Created succefully"];
        else return ['status' => 404, "message" => "Some problems occurred, please try again."];
    }


    /**
     * @param: $email
     * @method:isEmailPresent() 
     * @return :bool or result
     */
    public function getAllNotes($userid)
    {
        $stmt = $this->db->conn_id->prepare('SELECT * FROM notes WHERE user_id=:userid ORDER BY created DESC');
        $stmt->execute(['userid' => $userid]);
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC))
            return ['status' => 200, "message" => "notes data", "data" => $result];
        else return ['status' => 503, "message" => "got error when fetching data"];
    }
}