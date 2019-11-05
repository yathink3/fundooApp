<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooColloborate.php
 * @Purpose : rest api for fundoo app
 * @description: Create an Rest Api in codeigniter
 * @overview:api for colloborates, etc
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 13-aug-2019
 *******************************************************************************************************************/

require APPPATH . 'services/FundooColloborateService.php';
class FundooColloborate
{
    public function __construct()
    {
        $this->services = new FundooColloborateService();
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            exit(0);
        }
    }
    /**
     * @param :null
     * @method:getUsers()
     * @return :response 
     */
    public function getUsers()
    {
        $responce = $this->services->getUsers();
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param :null
     * @method:addcolloborator()
     * @return :response 
     */
    public function addcolloborator()
    {
        $data = json_decode(file_get_contents("php://input"));
        $colData = array();
        $colData['note_id'] = $data->noteid;
        $colData['others_id'] = $data->userid;
        $responce = $this->services->addcolloborator($colData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }

    /**
     * @param :null
     * @method:deletecolloborate()
     * @return :response 
     */
    public function deletecolloborate()
    {
        $data = json_decode(file_get_contents("php://input"));
        $colData = array();
        $colData['note_id'] = $data->noteid;
        $colData['others_id'] = $data->userid;
        $responce = $this->services->deletecolloborate($colData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
}