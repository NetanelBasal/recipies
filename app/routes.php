<?php



Route::get('/', function()
{
	return View::make('template');
});


Route::resource('users', 'UserController',
    array('only' => array('store', 'update','destroy')));
Route::post('login','UserController@loginUser');
Route::get('logout','UserController@logOut');
Route::post('changepassword', 'UserController@changePassword');
Route::post('checkifemailexists', 'UserController@checkIfEmailExists');
Route::post('upload-profile-pic', 'UserController@uploadProfilePic');

Route::resource('recipies', 'RecipieController', array('except' => array( 'create')));
Route::get('getallrecipies', 'RecipieController@getAllRecipies');
Route::get('searchrecipie', 'RecipieController@searchRecipie');
Route::get('searchrecipiebycategory', 'RecipieController@searceRecipieByCateogory');
Route::get('myrecipies/{userEmail}', 'RecipieController@myRecipies');
Route::resource('comments', 'CommentController' ,array('only' => array('store', 'destroy')));



Route::post('addcategory', 'CategoryController@create');
Route::get('categories', 'CategoryController@index');