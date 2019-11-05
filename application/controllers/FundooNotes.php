<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooNotes.php
 * @Purpose : rest api for fundoo app for notesdata
 * @description: Create an Rest Api in codeigniter
 * @overview:api for create,delete,getall,update,reminder etc
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 13-aug-2019
 *******************************************************************************************************************/

require APPPATH . 'services/FundooNotesService.php';
class FundooNotes
{
    public function __construct()
    {
        $this->services = new FundooNotesService();
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            exit(0);
        }
    }


    /**
     * @param:null
     * @method:createNote()
     * @return :response 
     */
    public function createNote()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['userid'] = $data->userid;
        $notesData['title'] = $data->title;
        $notesData['desc'] = $data->desc;
        $notesData['rem'] = $data->rem;
        $notesData['isArchieve'] = $data->isArchieve;
        $notesData['colorid'] = $data->colorid;
        $notesData['isPin'] = $data->isPin;
        $responce = $this->services->createNote($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
        // $this->getAllNotes($data->userid);
    }


    /**
     * @param:null
     * @method:getAllNotes()
     * @return :response 
     */
    public function getAllNotes($userid)
    {
        // $token = isset($_GET['token']) ? $_GET['token'] : die();
        $responce = $this->services->getAllNotes($userid);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:getOneNote($id)
     * @return :response 
     */
    public function getOneNote($id)
    {
        $responce = $this->services->getOneNote($id);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:deleteNotePermanently($id)
     * @return :response 
     */
    public function deleteNotePermanently($id)
    {
        $responce = $this->services->deleteNotePermanently($id);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:updateNotes()
     * @return :response 
     */
    public function updateNotes()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['title'] = $data->title;
        $notesData['description'] = $data->description;
        $responce = $this->services->updateNotes($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:updateNotecolor()
     * @return :response 
     */
    public function updateNotecolor()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['colorid'] = $data->color_id;
        $responce = $this->services->updateNotecolor($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:updateNoteReminder()
     * @return :response 
     */
    public function updateNoteReminder()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['reminder'] = $data->reminder;
        $responce = $this->services->updateNoteReminder($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:pinningNote()
     * @return :response 
     */
    public function pinningNote()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['isPin'] = $data->isPin;
        $responce = $this->services->pinningNote($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }

    /**
     * @param:null
     * @method:archievenoteSet()
     * @return :response 
     */
    public function  archievenoteSet()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['isArchieve'] = $data->isArchieve;
        $responce = $this->services->archievenoteSet($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }

    /**
     * @param:null
     * @method:addTrashnote()
     * @return :response 
     */
    public function addTrashnote()
    {
        $data = json_decode(file_get_contents("php://input"));
        $notesData = array();
        $notesData['noteid'] = $data->note_id;
        $notesData['isTrash'] = $data->isTrash;
        $responce = $this->services->addTrashnote($notesData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:null
     * @method:dragAndDrop()
     * @return :response 
     */
    public function dragAndDrop()
    {
        $data = json_decode(file_get_contents("php://input"));
        $drag1 = array();
        $drag1['noteid'] = $data->note1_id;
        $drag1['dragid'] = $data->note2_dragid;
        $drag2 = array();
        $drag2['noteid'] = $data->note2_id;
        $drag2['dragid'] = $data->note1_dragid;
        $responce = $this->services->dragAndDrop($drag1, $drag2);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
}