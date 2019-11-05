<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooNotesService.php
 * @Purpose : rest api for fundoo app for notesdata
 * @description: Create an Rest Api in codeigniter
 * @overview:api for create,delete,update,set reminder
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 13-sep-2019
 *******************************************************************************************************************/

if (!defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH . 'third_party/aws/aws-autoloader.php';
require APPPATH . 'rabbitmq/sender.php';
require APPPATH . 'constants.php';

use Aws\Sns\SnsClient;

class FundooNotesService extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        //load database library
        $this->load->database();
        $this->load->driver('cache', array('adapter' => 'redis', 'backup' => 'file'));
        $this->constant = new Constants();
    }

    /**
     * @param:$token or payload
     * @method:jwtToken()
     * @return :boolean or data
     */
    public function jwtToken($token, $method)
    {
        if ($method)  return JWT::encode($token, $this->constant->jwt_key);
        else {
            try {
                $data = JWT::decode($token, $this->constant->jwt_key, true);
                return $data;
            } catch (Exception $e) {
                return false;
            }
        }
    }


    /**
     * @param:$notesData
     * @method:createNote($notesData)
     * @return :response
     */
    public function createNote($notesData)
    {
        if (!array_key_exists('created', $notesData))  $notesData['created'] = date("Y-m-d H:i:s");
        $notesData['drag_id'] = null;
        $query = 'INSERT INTO notes (user_id,title,description,reminder,color_id,isArchieve,isPin,created,drag_id) VALUES (:userid,:title,:desc,:rem,:colorid,:isArchieve,:isPin,:created,:drag_id)';
        if ($this->db->conn_id->prepare($query)->execute($notesData)) {
            $id = $this->db->conn_id->lastInsertId();
            $stmt = $this->db->conn_id->prepare('UPDATE notes SET drag_id=:noteid WHERE id=:noteid');
            $stmt->execute(['noteid' => $id]);
            return ['status' => 200, "message" => "Note Created succefully", "id" => $id];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }


    /**
     * @param: $userid
     * @method:getAllNotes($userid)
     * @return :response
     */

    public function getAllNotes($userid)
    {
        $stmt = $this->db->conn_id->prepare("(SELECT * FROM notes WHERE user_id=:userid)
        UNION
        (SELECT n.* FROM notes n
        INNER JOIN colloborators c ON n.id=c.note_id
        WHERE c.others_id=:userid)");
        $stmt->execute(['userid' => $userid]);
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
            $tempresults = $result;
            foreach ($result as $key => $element) {
                $tempresults[$key]['labels'] = $this->fetchlabel($tempresults[$key]['id'], $userid);
                $tempresults[$key]['colloboraters'] = $this->fetchcolloboraters($tempresults[$key]['id']);
            }
            return ['status' => 200, "message" => "notes data", "data" => $tempresults];
        } else return ['status' => 503, "message" => "got error when fetching data"];
    }

    /**
     * @param: $id
     * @method:getOneNote($id)
     * @return :response
     */
    public function getOneNote($noteid)
    {
        $stmt = $this->db->conn_id->prepare('SELECT * FROM notes WHERE id=:id  ');
        $stmt->execute(['id' => $noteid]);
        if ($result = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result['labels'] = $this->fetchlabel($noteid, $result['user_id']);
            $result['colloboraters'] = $this->fetchcolloboraters($noteid);
            return ['status' => 200, "message" => "Note sent successfully", "data" => $result];
        } else return ['status' => 503, "message" => "got error when fetching data"];
    }

    /**
     * @param: $id
     * @method:deleteNotePermanently($id)
     * @return :response
     */
    public function deleteNotePermanently($id)
    {
        $query = 'DELETE FROM notes WHERE id=:id';
        if ($this->db->conn_id->prepare($query)->execute(['id' => $id])) {
            return ['status' => 200, "message" => "note deleted permanent succefully"];
        } else return ['status' => 503, "message" => "Some problems occurred, please try again."];
    }

    /**
     * @param: $noteid
     * @method:fetchlabel($noteid)
     * @return :response
     */
    public function fetchlabel($noteid, $userid)
    {
        $stmt = $this->db->conn_id->prepare('SELECT u.label
        FROM noteslabels n
        INNER JOIN userlabels u ON n.label_id=u.id
        WHERE n.note_id=' . $noteid . ' AND u.user_id=' . $userid . '
        ORDER BY n.created DESC');
        $stmt->execute();
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC))
            return array_map(function ($el) {
                return $el['label'];
            }, $result);
        else return [];
    }
    /**
     * @param: $noteid
     * @method:fetchcolloborate($noteid)
     * @return :response
     */
    public function fetchcolloboraters($noteid)
    {
        $stmt = $this->db->conn_id->prepare('(SELECT u.id,u.id AS owner_id,u.email,CONCAT_WS(\' \', u.firstname, u.lastname) AS name,u.profilepic
        FROM user u
        INNER JOIN notes n ON n.user_id=u.id
        WHERE n.id=' . $noteid . ')
        UNION
        (SELECT u.id,Null as owner_id, u.email,CONCAT_WS(\' \', u.firstname, u.lastname) AS name,u.profilepic
        FROM user u
        INNER JOIN colloborators c ON c.others_id=u.id
        WHERE c.note_id=' . $noteid . '
        ORDER BY c.created DESC)');
        $stmt->execute();
        if ($result = $stmt->fetchAll(PDO::FETCH_ASSOC)) {
            return $result;
        } else return [];
    }
    /**
     * @param: $notesData
     * @method:updateNotes($notesData)
     * @return :response
     */
    public function updateNotes($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET title=:title,description=:description WHERE id=:noteid');
        if ($stmt->execute($notesData))
            return ['status' => 200, "message" => "note content updated"];
        else return ['status' => 503, "message" => "note content not updated", "data" => $notesData];
    }
    /**
     * @param: $notesData
     * @method:updateNotecolor($notesData)
     * @return :response
     */
    public function updateNotecolor($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET color_id=:colorid  WHERE id=:noteid');
        if ($stmt->execute($notesData))
            return ['status' => 200, "message" => "color updated"];
        else return ['status' => 503, "message" => "color not updated"];
    }
    /**
     * @param: $notesData
     * @method:updateNoteReminder($notesData)
     * @return :response
     */
    public function updateNoteReminder($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET reminder=:reminder  WHERE id=:noteid');
        if ($stmt->execute($notesData)) {
            // $stmt = $this->db->conn_id->prepare('SELECT * FROM notes WHERE id=:id  ');
            // $stmt->execute(['id' => $notesData['noteid']]);
            // $result = $stmt->fetch(PDO::FETCH_ASSOC);
            // $this->SendAwsSms('title:' . $result['title'] . '\ndescription:' . $result['description']);
            return ['status' => 200, "message" => "reminder updated"];
        } else return ['status' => 503, "message" => "reminder not updated"];
    }
    /**
     * @param: $notesData
     * @method:pinningNote($notesData)
     * @return :response
     */
    public function pinningNote($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET isPin=:isPin  WHERE id=:noteid');
        if ($stmt->execute($notesData)) {
            return ['status' => 200, "message" => "pinning updated"];
        } else return ['status' => 503, "message" => "pinning not updated"];
    }
    /**
     * @param: $notesData
     * @method:archievenoteSet($notesData)
     * @return :response
     */
    public function archievenoteSet($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET isArchieve=:isArchieve  WHERE id=:noteid');
        if ($stmt->execute($notesData))
            return ['status' => 200, "message" => "note archieved"];
        else return ['status' => 503, "message" => "note not archieved"];
    }

    /**
     * @param: $notesData
     * @method:addTrashnote($notesData)
     * @return :response
     */
    public function addTrashnote($notesData)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET isTrash=:isTrash  WHERE id=:noteid');
        if ($stmt->execute($notesData))
            return ['status' => 200, "message" => "note added to trash"];
        else return ['status' => 503, "message" => "note not added to trash"];
    }
    public function dragAndDrop($drag1, $drag2)
    {
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET drag_id=:dragid  WHERE id=:noteid');
        $dragged1 = $stmt->execute($drag1);
        $stmt = $this->db->conn_id->prepare('UPDATE notes SET drag_id=:dragid  WHERE id=:noteid');
        $dragged2 = $stmt->execute($drag2);
        if ($dragged1 && $dragged2)
            return ['status' => 200, "message" => "dragging success"];
        else return ['status' => 503, "message" => "dragging error"];
    }
    public function SendAwsSms($msg)
    {
        $params = array(
            'credentials' => array(
                'key' => $this->constant->awskey,
                'secret' => $this->constant->awsSecrete,
            ),
            'region' => 'us-east-2',
            'version' => 'latest',
            'scheme' => 'http'
        );
        $sns = new SnsClient($params);
        $args = array(
            "Message" => $msg,
            "TopicArn" => $this->constant->awsARN
        );
        $result = $sns->publish($args);
    }
}