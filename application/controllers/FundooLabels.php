<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooLabels.php
 * @Purpose : rest api for fundoo app for labels
 * @description: Create an Rest Api in codeigniter
 * @overview:api for create delete,update
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 26-sept-2019
 *******************************************************************************************************************/

require APPPATH . 'services/FundooLabelsService.php';
class FundooLabels
{
    public function __construct()
    {

        $this->services = new FundooLabelsService();
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
    public function createLabel()
    {
        $data = json_decode(file_get_contents("php://input"));
        $labelsData = array();
        $labelsData['user_id'] = $data->user_id;
        $labelsData['label'] = $data->label;
        $responce = $this->services->createLabel($labelsData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }


    /**
     * @param:null
     * @method:getAllNotes()
     * @return :response 
     */
    public function getAllLabels($userid)
    {
        $responce = $this->services->getAllLabels($userid);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }



    /**
     * @param:null
     * @method:createNote()
     * @return :response 
     */
    public function addNoteLabel()
    {
        $data = json_decode(file_get_contents("php://input"));
        $labelsData = array();
        $labelsData['note_id'] = $data->note_id;
        $labelsData['label_id'] = $data->label_id;
        $responce = $this->services->addNoteLabel($labelsData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }


    /**
     * @param:null
     * @method:getAllNotes()
     * @return :response 
     */
    public function removeNoteLabel()
    {
        $data = json_decode(file_get_contents("php://input"));
        $labelsData = array();
        $labelsData['note_id'] = $data->note_id;
        $labelsData['label_id'] = $data->label_id;
        $responce = $this->services->removeNoteLabel($labelsData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
}