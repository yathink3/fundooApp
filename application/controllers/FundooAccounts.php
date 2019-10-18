<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> FundooAccounts.php
 * @Purpose : rest api for fundoo app
 * @description: Create an Rest Api in codeigniter
 * @overview:api for login,signup,delete,passwordreset, etc
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 13-aug-2019
 *******************************************************************************************************************/

require APPPATH . 'services/FundooAccountService.php';
class FundooAccounts
{
    public function __construct()
    {
        $this->services = new FundooAccountService();
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            exit(0);
        }
    }
    /**
     * @param:null
     * @method:login()
     * @return :response 
     */
    public function login()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userData = array();
        $userData['email'] = $data->email;
        $userData['password'] = $data->password;
        $responce = $this->services->signin($userData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }

    /**
     * @param:null
     * @method:registration()
     * @return :response 
     */
    public function registration()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userData = array();
        $userData['firstname'] = $data->firstname;
        $userData['lastname'] = $data->lastname;
        $userData['email'] = $data->email;
        $userData['password'] = $data->password;
        $responce = $this->services->signup($userData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    public function sociallogin()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userData = array();
        $userData['firstname'] = $data->firstname;
        $userData['lastname'] = $data->lastname;
        $userData['email'] = $data->email;
        $userData['password'] = $data->password;
        $userData['profilepic'] = $data->profilepic;
        $responce = $this->services->sociallogin($userData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    public function uploadProfilePic()
    {
        $data = json_decode(file_get_contents("php://input"));
        $profiledata = array();
        $profiledata['id'] = $data->id;
        $profiledata['profilepic'] = $data->profilepic;
        $responce = $this->services->uploadProfilePic($profiledata);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
    /**
     * @param:$token
     * @method:validationAccount()
     * @return :response 
     */
    public function validationAccount($token)
    {
        // $token = isset($_GET['token']) ? $_GET['token'] : die();
        $responce = $this->services->validateAccount($token);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }


    /**
     * @param:null
     * @method:forgot()
     * @return :response 
     */
    public function forgot()
    {
        $data = json_decode(file_get_contents("php://input"));
        $userData = array();
        $userData['email'] = $data->email;
        $responce = $this->services->forgotPassword($userData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }


    /**
     * @param :$token
     * @method:reset()
     * @return :response 
     */
    public function reset($token)
    {
        // $token = isset($_GET['token']) ? $_GET['token'] : die();
        $data = json_decode(file_get_contents("php://input"));
        $userData = array();
        $userData['password'] = $data->password;
        $responce = $this->services->resetPassword($token, $userData);
        http_response_code($responce['status']);
        echo json_encode($responce);
    }
}