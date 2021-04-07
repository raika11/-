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
        // document.write('<link href="https://getbootstrap.com/docs/5.0/dist/css/bootstrap.min.css" rel="stylesheet">');
        // document.write('<link href="https://static.joins.com/html/guide/guide.css" rel="stylesheet">');
        document.write('<link rel="apple-touch-icon-precomposed" href="https://images.joins.com/ui_mobile/joongang/icon/ios_114.png">');
        document.write('<link href="https://images.joins.com/ui_mobile/joongang/icon/favicon.ico" rel="shortcut icon">');
        
        document.write('<link href="//stg-static.joongang.co.kr/css/common/common.css" rel="stylesheet">');
        document.write('<link href="//stg-static.joongang.co.kr/css/common/section.css" rel="stylesheet">');

        document.write('<script src="//stg-static.joongang.co.kr/js/lib/jquery-3.3.1.min.js"></script>');
        document.write('<script src="//stg-static.joongang.co.kr/js/utils/scroll.js"></script>');

        document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/vs2015.min.css">');
        document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>');
        document.write('<script>hljs.initHighlightingOnLoad();</script>');
        document.write('');

    },

    
    
    


    header: function () {
        


        document.write('');








        document.write('<header class="header">');
        document.write('    <nav class="gnb">');
        document.write('        <h1 class="logo">중앙일보</h1>');
        document.write('        <div class="navi_wrap" id="bdNavbar">');
        document.write('            <ul class="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">');
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

            document.write('<aside class="sidebar_guide col_sm12 col_md2 col_lg2"  style="border:1px solid violet">');

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
            document.write('                <li class="nav_item"><a class="nav_link" href="card.html">카드</a></li>');
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
        document.write('<footer class="footer_guide">');
        document.write('<div class="container">');
        document.write('<p class="mb-0">Copyright by <a href="https://joongang.joins.com/" target="_blank">JoongAng Ilbo</a> Co., Ltd. All Rights Reserved</p>');
        document.write('</div>');
        document.write('</footer>');
    },
}