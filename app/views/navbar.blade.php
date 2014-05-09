<nav class="navbar navbar-default navbar-fixed-top navbar-inverse" role="navigation" ng-controller="navbarController">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" ui-sref="home"><i class="fa fa-cutlery"></i>  אתר המתכונים של ישראל</a>
    </div>

    <!-- navbar right-->
    <div class="collapse navbar-collapse navbar-ex1-collapse">
        <ul class="nav navbar-nav">
            <li ng-class="{active: $state.includes('home')}"><a ui-sref="home"><i class="fa fa-home"></i>  דף הבית</a></li>
            <li ng-class="{active: $state.includes('profile')}" ng-show="$storage.isLogin()"><a ui-sref="profile"><i class="fa fa-user"></i>  החשבון של [[[$storage.userName()]]]</a></li>
            <li ng-class="{active: $state.includes('recipies')}"><a ui-sref="recipies">כל המתכונים</a></li>

        </ul>

        <ul class="nav navbar-nav navbar-right" ng-show="$storage.isLogin()">
            <li class="dropdown">
                <a  class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-list"></i>   המתכונים שלי<b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a ui-sref="newrecipie">מתכון חדש</a></li>
                    <li><a ui-sref="myrecipies">המתכונים שלי</a></li>
                </ul>
            </li>
        </ul>

        <!-- navbar left-->
        <ul class="nav navbar-nav navbar-left">
            <li ng-hide="$storage.isLogin()" ng-class="{active: $state.includes('register')}"><a ui-sref="register"><i class="fa fa-pencil"></i>  הרשם</a></li>
            <li ng-hide="$storage.isLogin()" ng-class="{active: $state.includes('login')}"><a ui-sref="login"><i class="fa fa-sign-in"></i>  התחבר</a></li>
            <li ng-show="$storage.isLogin()"><a href="" ng-click="logOut()"><i class="fa fa-lock"></i>  התנתק</a></li>
            <li ng-show="$storage.isAdmin()" ng-class="{active: $state.includes('addcategory')}"><a ui-sref="addcategory">הוסף קטגוריה</a></li>

        </ul>
    </div>
</nav>