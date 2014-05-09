<?php

class CategoryController extends \BaseController {


    function __construct()
    {
        $this->beforeFilter('admin', array('only' => array('create')));
    }

    
    public function index() {
        return Category::all();
    }
    
    
    public function create(){
        if(Category::create(Input::all())) {
            return Response::json(array('save' => true));
        }
        return Response::json(array('save' => false));

    }
}