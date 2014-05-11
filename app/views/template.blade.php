<!doctype html>
<html lang="he" ng-app="recipies">
<head>
    <meta charset="UTF-8">
    <title>אתר המתכונים של ישראל</title>
    <link rel="stylesheet" href={{asset('css/normalize.min.css')}} />
    <link rel="stylesheet" href={{asset('css/responsiveslides.min.css')}} />
    <link rel="stylesheet" href={{asset('css/bootstrap3.min.css')}} />
    <link rel="stylesheet" href={{asset('css/bootstrap-rtl.min.css')}} />
    <link rel="stylesheet" href={{asset('vendor/fancybox/jquery.fancybox.css')}} />
    <link rel="stylesheet" href={{asset('css/style.css')}} />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/animate.css/3.1.0/animate.min.css"/>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body ng-cloak>


@include('navbar')

<!-- Slider -->

<div class="row">
    <ul class="rslides clearfix">
        <li><img src={{asset('img/1.jpg')}} alt="" class="mainimg"></li>
        <li><img src={{asset('img/2.jpg')}} alt="" class="mainimg"></li>
        <li><img src={{asset('img/3.jpg')}} alt="" class="mainimg"></li>
    </ul>
</div>

<!-- end Slider -->

<!-- main View -->
    <input type="text" ng-hide="true" value="{{$token}}" ng-model="security.csrf_token" copy-to-model />
<div ng-show="message" class="alert alert-warning col-sm-12 text-center fx-rotate-clock fx-speed-1500">[[[message]]]</div>
    <div ui-view  autoscroll="true"></div>
<!-- end main View --title-- footer -->


<div class="row">
    <footer class="col-sm-12">
        <h1>פה הפוטר</h1>
    </footer>
</div>
<!-- end footer -->


@include('scripts')



</body>
</html>