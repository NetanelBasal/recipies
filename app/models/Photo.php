<?php

class Photo extends \Eloquent {
	protected $fillable = array('path');
    public $timestamps = false;

    public function recipie() {
        return $this->belongsTo('Recipie');
    }
}