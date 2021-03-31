var include = {
    meta: function () {
        document.write('<meta name="robots" content="noindex, nofollow">');
        document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
        document.write('<meta name="description" content="">');
        document.write('<meta name="author" content="">');
        document.write('<title>퍼블 가이드 - 중앙일보</title>');
        document.write('<meta property="og:image" content="https://static.joins.com/joongang_15re/profile_joongang_200.png">');
    },
    head: function () {
        document.write('<link rel="canonical" href="">');
        document.write('<link href="https://getbootstrap.com/docs/5.0/dist/css/bootstrap.min.css" rel="stylesheet">');
        document.write('<link href="https://static.joins.com/html/guide/guide.css" rel="stylesheet">');
        document.write('<link rel="apple-touch-icon-precomposed" href="https://images.joins.com/ui_mobile/joongang/icon/ios_114.png">');
        document.write('<link href="https://images.joins.com/ui_mobile/joongang/icon/favicon.ico" rel="shortcut icon">');
    },
    header: function () {
        document.write('<div class="skippy overflow-hidden">');
        document.write('<div class="container-xl">');
        document.write('<a class="visually-hidden-focusable d-inline-flex p-2 m-1" href="#content">Skip to main content</a>');
        document.write('<a class="visually-hidden-focusable d-none d-md-inline-flex p-2 m-1" href="#bd-docs-nav">Skip to docs navigation</a>');
        document.write('</div>');
        document.write('</div>');
        document.write('<header class="navbar navbar-expand-md navbar-dark bd-navbar">');
        document.write('<nav class="container-xxl flex-wrap flex-md-nowrap">');
        document.write('<div class="collapse navbar-collapse" id="bdNavbar">');
        document.write('<ul class="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2 active" href="https://static.joins.com/html/guide/">중앙일보 퍼블가이드</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/html.html">Html</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/css.html">Css</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/sass.html">Sass</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/font.html">Font</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/image.html">Image</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/accessibility.html">웹접근성</a></li>');
        document.write('<li class="nav-item col-6 col-md-auto"><a class="nav-link p-2" href="https://static.joins.com/html/guide/seo.html">SEO</a></li>');
        document.write('</ul>');
        document.write('</div>');
        document.write('<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">');
        document.write('<svg class="bi" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">');
        document.write('<path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>');
        document.write('</svg>');
        document.write('</button>');
        document.write('<button class="btn bd-sidebar-toggle d-md-none py-0 px-1 ms-3 order-3 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bd-docs-nav" aria-controls="bd-docs-nav" aria-expanded="false" aria-label="Toggle docs navigation">');
        document.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi bi-expand" viewBox="0 0 16 16">');
        document.write('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/>');
        document.write('</svg>');
        document.write('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="bi bi-collapse" viewBox="0 0 16 16">');
        document.write('<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>');
        document.write('</svg>');

        document.write('</button>');
        document.write('</nav>');
        document.write('</header>');
    },
    aside: {
        init : function(){
            this.menu0();
        },
        menu0: function(){

            document.write('<aside class="sidebar_guide col_lg2">');

            document.write('<!-- side navigation -->');
            document.write('<nav class="accordian side_nav side_nav_guide"  id="">');
            document.write('    <ul class="nav">');
            document.write('        <li class="nav_item ">');
            document.write('            <a class="nav_link " aria-current="page" href="javascript:(0);">레이아웃</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Breakpoints</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Container</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Grid</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Section</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('        <li class="nav_item">');
            document.write('            <a class="nav_link" href="javascript:(0);">콘텐츠</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">이미지</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">테이블</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">피규어</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('        <li class="nav_item">');
            document.write('            <a class="nav_link" href="javascript:(0);">폼</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">폼컨트롤</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="rank.html">셀렉트</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">체크&라디오</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('        <li class="nav_item">');
            document.write('            <a class="nav_link" href="javascript:(0);">컴포넌트</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Menu3</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">버튼</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="rank.html">많이본기사(rank)</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('        <li class="nav_item">');
            document.write('            <a class="nav_link" href="javascript:(0);">헬퍼</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Clearfix</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="rank.html">Position</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Visually hidden</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('        <li class="nav_item">');
            document.write('            <a class="nav_link" href="javascript:(0);">유틸리티</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Menu3</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="rank.html">많이본기사(rank)</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Menu3</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Menu3</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Menu3</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('    </ul>');
            document.write('</nav>');
            document.write('</aside>');

        },
        
    },
    footer: function () {
        document.write('<footer class="bd-footer p-3 p-md-5 mt-5 bg-light text-center text-sm-start">');
        document.write('<div class="container">');
        document.write('<p class="mb-0">Copyright by <a href="https://joongang.joins.com/" target="_blank">JoongAng Ilbo</a> Co., Ltd. All Rights Reserved</p>');
        document.write('</div>');
        document.write('</footer>');
    },
}