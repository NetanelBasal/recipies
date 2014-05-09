<?php

class Recipie extends \Eloquent {
	protected $guarded = array('id');

    public function category() {
        return $this->belongsTo('Category');
    }

    public function comments() {
        return $this->hasMany('Comment');
    }

    public function photos() {
        return $this->hasMany('Photo');
    }
}