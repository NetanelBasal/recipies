<?php


class UserController extends \BaseController {


    public function __construct() {
//        $this->beforeFilter('csrf', array('only' => array('loginUser')));
//        $this->beforeFilter('auth', array('only' => array('update')));
    }


    public function loginUser() {
        if (Auth::attempt(array('email' => Input::get('email'), 'password' => Input::get('password'))))
        {
            return Response::json(Auth::user());
        }
        else
        {
            return Response::json(array('user' => false),401);
        }
    }


	public function store()
	{
		if(User::Create(Input::all()))
        {
            return Response::json(array('saved' => true));
        }
	}


    public function checkIfEmailExists() {
            $email = User::whereEmail(Input::json('email'))->get();
            if(count($email))
            {
                return Response::json(['email' => false]);
            }
            else
            {
                return Response::json(['email' =>true]);
            }
    }




	public function update($id)
	{
		if(Auth::user()->id == $id) {
            $user = User::find($id);
            $user->email = Input::get('email', Auth::user()->email);
            $user->name = Input::get('name', Auth::user()->name);
            if($user->save()) {
                return Response::json(array('saved' => true));
            }
        }else
        {
            return Response::json(array('saved' => false), 401);
        }
	}


	public function destroy($id)
	{
		if(Auth::user()->id == $id) {
           User::destroy($id);
        }else {
            return Response::json(array('delete' => false));
        }
	}

    public function logOut() {
        Auth::logout();
    }

    public function changePassword() {
        $user = Auth::user();
        if(Hash::check(Input::get('oldpassword'), $user->password)) {
            $user->password = Input::get('password');
            $user->save();
            return Response::json(array('change' => true));
        }else {
            return Response::json(array('change' => false),401);
        }
    }

    public function uploadProfilePic() {

        $image = Input::file('file');
        $valid = Validator::make(array('file' => $image), array('file' => 'image'));
        if($valid->fails()) {
            return Response::json(array('failed' => true));
        }

        $path_to_save = public_path('client-images' . DIRECTORY_SEPARATOR . Auth::user()->email . DIRECTORY_SEPARATOR .  'profile');
        $path_to_show = 'client-images'. DIRECTORY_SEPARATOR .  Auth::user()->email . DIRECTORY_SEPARATOR .  'profile' . DIRECTORY_SEPARATOR . time() . $image->getClientOriginalName();
        File::cleanDirectory($path_to_save);
           $im = new Netanel\ImageUpload($image);
            if($im->uploadImage($path_to_save, '150', '150'))
            {
                if($im->savePathToDb($path_to_show, 'profilepic')) {
                    return Response::json(array($path_to_show));
                }
            }

    }

}


