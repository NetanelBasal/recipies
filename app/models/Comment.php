<?php

class Comment extends \Eloquent {
	protected $fillable = array('body');

    public function recipie() {
        return $this->belongsTo('Recipie');
    }

    public function user() {
        return $this->belongsTo('User');
    }
}