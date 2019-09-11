<?php

/********************************************************************************************************************
 * @Execution : default node : cmd> api.php
 * @Purpose : rest api for fundoo app
 * @description: Create an Rest Api in codeigniter
 * @overview:api for login,signup,delete,passwordreset, etc
 * @author : yathin k <yathink3@gmail.com>
 * @version : 1.0
 * @since : 31-aug-2019
 *******************************************************************************************************************/
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'services/Service.php';
/**
 * class api which extends from REST_Controller
 */
class Api extends  REST_Controller
{
    public function __construct()
    {

        parent::__construct();

        //load user models
        $this->load->model('user');
        // $this->service = new Service();
    }

    /**
     * @param:null
     * @method:index_options()
     * @return :null
     */
    public function index_options()
    {
        die();
    }


    /**
     * @param:null
     * @method:login_post()
     * @return :response 
     */
    public function login_post()
    {
        $userData = array();
        $userData['email'] = $this->post('email');
        $userData['password'] = $this->post('password');
        if (!empty($userData['email']) && !empty($userData['password'])) {
            if ($id = $this->user->isEmailPresent($userData['email'])) {
                if ($user = $this->user->validate($id)) {
                    if ($this->user->signin($userData, $user)) {
                        $this->response([
                            'status' => TRUE,
                            'message' => 'User login successful.',
                            'data' => $user
                        ], REST_Controller::HTTP_OK);
                    } else {
                        $this->response([
                            'status' => FALSE,
                            'message' => "password is mismatch"
                        ], REST_Controller::HTTP_BAD_REQUEST);
                    }
                } else {
                    $this->response([
                        'status' => FALSE,
                        'message' => "validation not at done"
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                $this->response([
                    'status' => FALSE,
                    'message' => "wrong email address"
                ], REST_Controller::HTTP_BAD_REQUEST);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => "invalid data"
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }


    /**
     * @param :null
     * @method:registration_post()
     * @return :response 
     */
    public function registration_post()
    {
        $userData = array();
        $userData['firstname'] = $this->post('firstname');
        $userData['lastname'] = $this->post('lastname');
        $userData['email'] = $this->post('email');
        $userData['password'] = $this->post('password');
        if (!empty($userData['firstname']) && !empty($userData['lastname']) && !empty($userData['email']) && !empty($userData['password'])) {
            if (!$this->user->isEmailPresent($userData['email'])) {
                //check if the user data inserted
                if ($id = $this->user->signup($userData)) {
                    if ($this->user->validateMail('http://localhost:4200/validate/?token=' . $this->user->generateToken($id))) {
                        //set the response and exit
                        $this->response([
                            'status' => TRUE,
                            'message' => 'User account has been created token generated && email sent successfully.'
                        ], REST_Controller::HTTP_OK);
                    } else {
                        $this->response([
                            'status' => FALSE,
                            'message' => "User account has been created token generated && email not sent"
                        ], REST_Controller::HTTP_BAD_REQUEST);
                    }
                } else {
                    //set the response and exit
                    $this->response([
                        'status' => FALSE,
                        'message' => "Some problems occurred, please try again."
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                $this->response([
                    'status' => FALSE,
                    'message' => "user already exists"
                ], REST_Controller::HTTP_BAD_REQUEST);
            }
        } else {
            //set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => "Provide complete user information to create."
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }


    /**
     * @param:null
     * @method:forgot_post()
     * @return :response 
     */
    public function forgot_post()
    {
        $userData = array();
        $userData['email'] = $this->post('email');
        if (!empty($userData['email'])) {
            if ($id = $this->user->isEmailPresent($userData['email'])) {
                if ($this->user->sendMail('http://localhost:4200/resetPassword/?token=' . $this->user->generateToken($id))) {
                    $this->response([
                        'status' => TRUE,
                        'message' => "token generated && email sent successfully"
                    ], REST_Controller::HTTP_OK);
                } else {
                    $this->response([
                        'status' => FALSE,
                        'message' => "token generated && email not sent"
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                $this->response([
                    'status' => FALSE,
                    'message' => "wrong email address"
                ], REST_Controller::HTTP_BAD_REQUEST);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => "invalid data"
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }



    /**
     * @param :$token
     * @method:reset_post()
     * @return :response 
     */
    public function reset_post($token)
    {
        if ($id = $this->user->checkToken($token)) {
            //check if the user data exists
            if ($this->user->getUsers($id)) {
                $userData = array();
                $userData['password'] = $this->post('password');
                //check if the user data updated
                if ($this->user->updateUser($userData, $id)) {
                    //set the response and exit
                    $this->response([
                        'status' => TRUE,
                        'message' => 'password has been updated successfully.'
                    ], REST_Controller::HTTP_OK);
                } else {
                    //set the response and exit
                    $this->response([
                        'status' => FALSE,
                        'message' => "Some problems occurred, please try again."
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                //set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'unknown person'
                ], REST_Controller::HTTP_NOT_FOUND);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => 'unknown person'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }


    /**
     * @param :$token
     * @method:reset_post()
     * @return :response 
     */
    public function validation_get($token)
    {
        if ($id = $this->user->checkToken($token)) {
            //check if the user data exists
            if ($this->user->getUsers($id)) {
                //check if the user data updated
                if ($this->user->validateUser($id)) {
                    //set the response and exit
                    $this->response([
                        'status' => TRUE,
                        'message' => 'User validation successful'
                    ], REST_Controller::HTTP_OK);
                } else {
                    //set the response and exit
                    $this->response([
                        'status' => FALSE,
                        'message' => "User validation not success"
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                //set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'unknown person'
                ], REST_Controller::HTTP_NOT_FOUND);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => 'unknown person'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }


    /**
     * @param:$id
     * @method:user_get()
     * @return :response 
     */
    public function user_get($id = 0)
    {
        //check if the user data exists
        if ($users = $this->user->getUsers($id)) {
            //set the response and exit
            $this->response([
                'status' => TRUE,
                'data' => $users
            ], REST_Controller::HTTP_OK);
        } else {
            //set the response and exit
            $this->response([
                'status' => FALSE,
                'message' => 'No user were found.'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }


    /**
     * @param :$id
     * @method :user_put
     * @return :response 
     */
    public function user_put($id = 0)
    {

        if ($id) {
            //check if the user data exists
            if ($this->user->getUsers($id)) {
                $userData = array();
                $userData['firstname'] = $this->put('firstname');
                $userData['lastname'] = $this->put('lastname');
                $userData['email'] = $this->put('email');
                $userData['password'] = $this->put('password');
                if ($this->user->isEmailPresent($userData['email'], $id)) {
                    $this->response([
                        'status' => FALSE,
                        'message' => "user already exists"
                    ], REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    if (!empty($id) && !empty($userData['firstname']) && !empty($userData['lastname']) && !empty($userData['email']) && !empty($userData['password'])) {
                        //check if the user data updated
                        if ($this->user->updateUser($userData, $id)) {
                            //set the response and exit
                            $this->response([
                                'status' => TRUE,
                                'message' => 'User has been updated successfully.'
                            ], REST_Controller::HTTP_OK);
                        } else {
                            //set the response and exit
                            $this->response([
                                'status' => FALSE,
                                'message' => "Some problems occurred, please try again."
                            ], REST_Controller::HTTP_BAD_REQUEST);
                        }
                    } else {
                        //set the response and exit
                        $this->response([
                            'status' => FALSE,
                            'message' => "Provide complete user information to update."
                        ], REST_Controller::HTTP_BAD_REQUEST);
                    }
                }
            } else {
                //set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'No user were found.'
                ], REST_Controller::HTTP_NOT_FOUND);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => "please specify the user id."
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }


    /**
     * @param :$id
     * @method :user_to delete()
     * @return :response 
     */
    public function user_delete($id = 0)
    {
        if ($id) {
            //check if the user data exists
            if ($this->user->getUsers($id)) {
                if ($this->user->deleteUser()($id)) {
                    //set the response and exit
                    $this->response([
                        'status' => TRUE,
                        'message' => 'User has been removed successfully.'
                    ], REST_Controller::HTTP_OK);
                } else {
                    //set the response and exit
                    $this->response([
                        'status' => FALSE,
                        'message' => "Some problems occurred, please try again."
                    ], REST_Controller::HTTP_BAD_REQUEST);
                }
            } else {
                //set the response and exit
                $this->response([
                    'status' => FALSE,
                    'message' => 'No user were found.'
                ], REST_Controller::HTTP_NOT_FOUND);
            }
        } else {
            $this->response([
                'status' => FALSE,
                'message' => "please specify the user id."
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
}