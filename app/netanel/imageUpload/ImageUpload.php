<?php

namespace Netanel;

use Gregwar\Image\Image;
use Auth;

class ImageUpload {


    public $image;


    function __construct( $image)
    {
        $this->image = $image;

    }


    public function uploadImage($imagepath, $width, $height) {
        $save = Image::open($this->image->getRealPath())
            ->resize($width, $height)
            ->save($imagepath . DIRECTORY_SEPARATOR . time() . $this->image->getClientOriginalName());
        if($save) {
            return true;
        }
        return false;
    }

    public function savePathToDb($path, $columname) {
        $user= Auth::user();
        $user->$columname = $path;
        if($user->save()) {
            return true;
        }
        return false;
    }

}