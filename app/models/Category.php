<?php

class Category extends \Eloquent {
	protected $fillable = array('name');
    public $timestamps = false;

    public function recipies() {
        return $this->hasMany('Recipie');
    }
}