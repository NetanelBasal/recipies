<?php
use Gregwar\Image\Image;
class RecipieController extends \BaseController {



    public function __construct() {
        $this->beforeFilter('auth', array('only' => array('store','update', 'destroy','myRecipies')));
    }

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Recipie::limit(5)->orderBy('created_at', 'DESC')->get();
	}


	public function store()
	{
        $id = DB::table('recipies')->insertGetId(
            array('name' => Input::get('name'),
                  'body' => Input::get('body'),
                  'category_id' => Input::get('category_id'),
                  'user_id' => Auth::user()->id,
                  'created_at' => \Carbon\Carbon::now(),
                  'updated_at' => \Carbon\Carbon::now()
            )
        );
        if($id) {
            if(count($_FILES)) {
                $path_to_image = public_path('client-images' . DIRECTORY_SEPARATOR . Auth::user()->email . DIRECTORY_SEPARATOR . 'recipies' . DIRECTORY_SEPARATOR . $id );
                $path_to_show = 'client-images' . DIRECTORY_SEPARATOR . Auth::user()->email . DIRECTORY_SEPARATOR . 'recipies' . DIRECTORY_SEPARATOR . $id;
                for($i = 0; $i < count($_FILES); $i++ ) {
                    $file = $_FILES['file'. $i];
                    $name = time() . $file['name'];
                    $save = Image::open($file['tmp_name'])
                        ->resize('150', '150')
                        ->save($path_to_image . DIRECTORY_SEPARATOR . $name);
                    if($save)
                    {
                        $photo = New Photo;
                        $photo->path = $path_to_show . DIRECTORY_SEPARATOR . $name;
                        $photo->recipie_id = $id;
                        $photo->save();
                        if($save) {
                            $saved[] = 'true';
                        }else {
                            $saved[] = 'false';
                        }
                    }
                }
                if(in_array('false' , $saved)) {
                    return Response::json(array('saved' => false));
                } else {
                    return Response::json(array('saved' => true));
                }
            }else {
                return Response::json(array('saved' => true));
            }

        }

	}

    public function edit($id) {
        if(Auth::user()->id == Input::get('user_id')) {
            return Recipie::find($id);
        }
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{

        return Recipie::with(array('photos','comments' => function($query) {
                $query->orderBy('created_at', 'DESC');
            }))->where('id', '=', $id)->get();


    }


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id) {

        $recipie = Recipie::find($id);
        if($recipie->user_id == Auth::user()->id) {
            $recipie->name = Input::get('name');
            $recipie->body = Input::get('body');
            if($recipie->save()) {
                return Response::json(array('updated' => true));
            }
        }else
        {
            return Response::json(array('updated' => false), 401);
        }
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        if(Auth::user()->id == Input::get('user_id')) {
            $recipie = Recipie::find($id);
            $recipie->delete();
            return Response::json(array('delete' => true));
        }else{
            return Response::json(array('delete' => false));
        }
	}

    public function getAllRecipies() {
        return Recipie::paginate(1);
    }

    public function searchRecipie() {
        $key = Input::get("key");
        return Recipie::where('name', 'LIKE', '%'.$key.'%')->paginate(1);
    }

    public function searceRecipieByCateogory() {
        return Recipie::where('category_id', '=', Input::get('category'))->paginate(1);
    }

    public function myRecipies($userEmail) {

        if(Auth::user()->email == $userEmail) {
          return Recipie::with('photos')->where('user_id', '=', Auth::user()->id)->get();
        }else {
            return Response::json(array('hacker' => true), 401);
        }
    }


}