<?php

class CommentController extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

	public function store()
	{
        $com = new Comment;
        $com->name = Auth::user()->name;
        $com->body = Input::get('body');
        $com->recipie_id = Input::get('recipie_id');
        $com->user_id = Auth::user()->id;
        if($com->save()) {
            return Response::json(array('saved' => true));
        }        
	}


	public function destroy($id)
	{
		if(Auth::user()->id == Input::get('user_id')) {
            $comment = Comment::find($id);
            $comment->delete();
            return Response::json(array('delete' => true));
        }else{
            return Response::json(array('delete' => false));
        }
        
	}

}