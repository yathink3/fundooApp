<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooLabelsService.php
 * @Purpose : rest api for fundoo app for labelsdata
 * @description: Create an Rest Api in codeigniter
 * @overview:api for create,delete,update
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 26-sep-2019
 *******************************************************************************************************************/

if (!defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . 'rabbitmq/sender.php';
class FundooLabelsService extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->load->driver('cache', array('adapter' => 'redis', 'backup' => 'file'));
    }

    /**
     * @param:$tuserData
     * @method:signup()
     * @return :array of data
     */
    public function createLabel($labelsData)
    {
        if (!array_key_exists('created', $labelsData))  $labelsData['created'] = date("Y-m-d H:i:s");
        $query = 'INSERT INTO userlabels (user_id,label,created) VALUES (:user_id,:label,:created)';
        if ($this->db->conn_id->prepare($query)->execute($labelsData)) {
            $id = $this->db->conn_id->lastInsertId();
            $stmt = $this->db->conn_id->prepare('SELECT * FROM userlabels WHERE id=:id');
            $stmt->execute(['id' => $id]);
            if ($result = $stmt->fetch(PDO::FETCH_ASSOC))
                return ['status' => 200, "message" => "label Created succefully", "data" => $result];
        } else return ['status' => 404, "message" => "Some problems occurred, please try again."];
    }


    /**
     * @param: $email
     * @method:isEmailPresent() 
     * @return :bool or result
     */
    public function getAllLabels($userid)
    {
        $stmt = $this->db->conn_id->prepare('SELECT * FROM userlabels WHERE user_id=:userid ORDER BY created DESC');
        $stmt->execute(['userid' => $userid]);
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC))
            return ['status' => 200, "message" => "labels data", "data" => $result];
        else return ['status' => 503, "message" => "empty labels"];
    }

    public function addNoteLabel($labelsData)
    {
        if (!array_key_exists('created', $labelsData))  $labelsData['created'] = date("Y-m-d H:i:s");
        $query = 'INSERT INTO noteslabels (note_id,label_id,created) VALUES (:note_id,:label_id,:created)';
        if ($this->db->conn_id->prepare($query)->execute($labelsData)) {
            return ['status' => 200, "message" => "note label added succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }

    public function removeNoteLabel($labelsData)
    {
        $query = 'DELETE FROM noteslabels
        WHERE id IN (
         SELECT implicitTemp.id from (SELECT id FROM noteslabels WHERE label_id=:label_id AND note_id=:note_id) implicitTemp)';
        if ($this->db->conn_id->prepare($query)->execute($labelsData)) {
            return ['status' => 200, "message" => "notelabel removed succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }
    public function updatelabel($labelsData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE userlabels SET label=:label WHERE id=:id');
        if ($stmt->execute($labelsData))
            return ['status' => 200, "message" => "label content updated"];
        else return ['status' => 503, "message" => "label content not updated"];
    }
    public function deletelabel($labelid)
    {
        $query = 'DELETE FROM userlabels WHERE id=:id';
        if ($this->db->conn_id->prepare($query)->execute(['id' => $labelid])) {
            return ['status' => 200, "message" => "label deleted succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }
}