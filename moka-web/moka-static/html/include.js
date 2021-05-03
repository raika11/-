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
        document.write('<link rel="apple-touch-icon-precomposed" href="https://images.joins.com/ui_mobile/joongang/icon/ios_114.png">');
        document.write('<link href="https://images.joins.com/ui_mobile/joongang/icon/favicon.ico" rel="shortcut icon">');
        
        document.write('<link href="//stg-static.joongang.co.kr/css/plugin/slick.css" rel="stylesheet">');
        document.write('<link href="//stg-static.joongang.co.kr/css/plugin/swiper.css" rel="stylesheet"></link>');

        document.write('<link href="//stg-static.joongang.co.kr/css/common.css" rel="stylesheet">');
        document.write('<link href="//stg-static.joongang.co.kr/css/section.css" rel="stylesheet">');
        document.write('<link href="//stg-static.joongang.co.kr/css/article.css" rel="stylesheet">');

        document.write('<script src="//stg-static.joongang.co.kr/js/lib/jquery-3.3.1.min.js"></script>');
        document.write('<script src="//stg-static.joongang.co.kr/js/plugin/slick.js"></script>');
        document.write('<script src="//stg-static.joongang.co.kr/js/plugin/swiper.min.js"></script>');

        document.write('<script src="//stg-static.joongang.co.kr/js/resource.js"></script>');
        document.write('<script src="//stg-static.joongang.co.kr/js/common.js"></script>');
        document.write('<script src="//stg-static.joongang.co.kr/js/plugin/tabs.js"></script>');

    },


    header: function () {
        document.write('');
        document.write('<header class="header guide_gnb">');
        document.write('    <nav class="gnb">');
        document.write('        <h1 class="logo">중앙일보</h1>');
        document.write('        <div class="navi_wrap" id="bdNavbar">');
        document.write('            <ul class="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0 ">');
        document.write('                <li class="nav_item"><a class="nav_link p-2 active" href="https://static.joins.com/html/guide/index.html">중앙일보 퍼블가이드</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/html.html">Html</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/css.html">Css</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/font.html">Font</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/image.html">Image</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/accessibility.html">웹접근성</a></li>');
        document.write('                <li class="nav_item"><a class="nav_link p-2" href="https://static.joins.com/html/guide/seo.html">SEO</a></li>');
        document.write('            </ul>');
        document.write('        </div>');
        document.write('        <div class="gnb_util">버튼</div>');
        document.write('    </nav>');
        document.write('</header>');
    },
    aside: {
        init : function(){
            this.menu0();
        },
        menu0: function(){

            document.write('<aside class="sidebar_guide col_sm12 col_md2 col_lg2 sm_hidden">');

            document.write('<!-- side navigation -->');
            document.write('<nav class="accordian side_nav side_nav_guide"  id="">');
            document.write('    <ul class="nav">');
            document.write('        <li class="nav_item ">');
            document.write('            <a class="nav_link " aria-current="page" href="javascript:(0);">레이아웃</a>');
            document.write('            <ul class="nav">');
            document.write('                <li class="nav_item"><a class="nav_link" href="breakpoints.html">Breakpoints</a></li>');
            // document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Container</a></li>');
            // document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Grid</a></li>');
            // document.write('                <li class="nav_item"><a class="nav_link" href="javascript:(0);">Section</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="layout_page_title.html">페이지타이틀</a></li>');
            document.write('                <li class="nav_item"><a class="nav_link" href="layout_title.html">타이틀</a></li>');
            document.write('            </ul>');
            document.write('        </li>');
            document.write('    </ul>');
            document.write('</nav>');
            document.write('</aside>');

        },
        
    },
    footer: function () {
        document.write('<footer class="footer">');
        document.write('<div class="foot flex')
        document.write('<p class="mb-0">Copyright by <a href="https://joongang.joins.com/" target="_blank">JoongAng Ilbo</a> Co., Ltd. All Rights Reserved</p>');
        document.write('</div>');
        document.write('</footer>');
    },
}