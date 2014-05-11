<div class="row">
    <header class="col-sm-12 hidden-xs">
        <h1>התחבר</h1>
    </header>
</div>
<div class="row">
    <div class="col-sm-6 col-sm-push-3 content" ng-controller="loginController">
        <div ng-show="wrongCred" class="alert alert-danger fx-rotate-clock">שם משתמש או סיסמא לא נכונים</div>
        <form role="form" name="loginForm" ng-submit="loginClick()" novalidate>
            <fieldset>
                <legend>הכנס פרטים</legend>
                <label>אימייל</label>
                <div class="input-group form-group">
                    <span class="input-group-btn">
                        <label for="email" class="btn btn-default" type="button"><i class="fa fa-envelope"></i></label>
                      </span>
                    <input type="email" name="email" class="form-control" id="email" ng-model="login.email" required>

                </div>
                <span class="help-block" ng-show="loginForm.email.$error.required && loginForm.email.$dirty">שדה זה הוא חובה</span>

                <label>סיסמא</label>
                <div class="input-group form-group">
                    <span class="input-group-btn">
                        <label for="password" class="btn btn-default icons" type="button"><i class="fa fa-lock"></i></label>
                      </span>
                    <input type="password" name="password" class="form-control" id="password" ng-model="login.password" required>
                </div>
                <span class="help-block" ng-show="loginForm.password.$error.required && loginForm.password.$dirty">שדה זה הוא חובה</span>

                <input type="submit" class="btn btn-lg btn-primary full-width" value="התחבר" ng-disabled="loginForm.$invalid" />
            </fieldset>
        </form>
    </div>
</div>