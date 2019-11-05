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
require APPPATH . 'constants.php';
class FundooColloborateService extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->constant = new Constants();
    }

    /**
     * @param: null
     * @method:getUsers()
     * @return :bool or result
     */
    public function getUsers()
    {
        $stmt = $this->db->conn_id->prepare('SELECT id,email,CONCAT_WS(\' \', firstname, lastname) AS name,profilepic FROM user');
        $stmt->execute();
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC)) return ['status' => 200, "message" => "users data", "data" => $result];
        else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }

    /**
     * @param: $colData
     * @method:addcolloborator()
     * @return :bool or result
     */
    public function addcolloborator($colData)
    {
        if (!array_key_exists('created', $colData))  $colData['created'] = date("Y-m-d H:i:s");
        $query = 'INSERT INTO colloborators (note_id,others_id,created) VALUES (:note_id,:others_id,:created)';
        if ($this->db->conn_id->prepare($query)->execute($colData)) {
            return ['status' => 200, "message" => "colloborate added succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }
    /**
     * @param: $colData
     * @method: deletecolloborate()
     * @return :bool or result
     */
    public function deletecolloborate($colData)
    {
        $query = 'DELETE FROM colloborators
        WHERE id IN (
         SELECT implicitTemp.id from (SELECT id FROM colloborators WHERE note_id=:note_id AND others_id=:others_id) implicitTemp)';
        if ($this->db->conn_id->prepare($query)->execute($colData)) {
            return ['status' => 200, "message" => "colloborate removed succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }
}