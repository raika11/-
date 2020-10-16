import React from 'react';
import LoadButton from '../components/PageLoadButton';
import PreviewButton from '../components/PagePreviewButton';
import LinkButton from '../components/PageLinkButton';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'pageSeq',
        width: 50,
    },
    {
        headerName: '페이지명',
        field: 'pageName',
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 190,
    },
    {
        headerName: '',
        field: 'load',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => <LoadButton {...params} />,
    },
    {
        headerName: '',
        field: 'preview',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => <PreviewButton {...params} />,
    },
    {
        headerName: '',
        field: 'link',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => <LinkButton {...params} />,
    },
];

export const rowData = [
    {
        pageSeq: 66,
        pageName: '메인',
        pageServiceName: null,
        pageDisplayName: 'HOME',
        parent: null,
        domain: {
            domainId: '1003',
            mediaId: 'RS',
            domainName: '서울시스템',
            domainUrl: 'ssc.msp.com',
            volumeId: 'AA',
            servicePlatform: 'P',
        },
        pageType: 'text/html',
        pageUrl: '/page/66',
        pageOrder: 1,
        pageBody:
            '<mte:ct id="10" name="공통헤더"/>\r\n<mte:tp id="123" name="메인_ 헤더및 네비"/>\r\n    <!--2depth menu e-->\r\n<div class="container">\r\n        <!-- 실시간 주요뉴스 Start -->\r\n    <mte:cp id="162" name="메인 실시간 뉴스" />\r\n    <!-- 실시간 주요뉴스 End -->\r\n    <div class="dim-bk-news"></div>\r\n    <div class="content1">\r\n        <!-- 메인 헤드라인 Start -->\r\n        <mte:cp id="143" name="메인_헤드라인뉴스_컴포넌트"/>\r\n     <!-- 메인 헤드라인 End -->\r\n    </div>\r\n\r\n    <!-- 코로나 배너 Start -->\r\n    <mte:tp id="134" name="메인_코로나배너"/>\r\n    <!-- 코로나 배너 End -->\r\n\r\n    <!-- 대전 프로젝트 Start -->\r\n     <div class="deajeon-banner" style="text-align:center; width:1100px; margin:0 auto 55px auto;">\r\n        <a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_169" style="margin-right:30px;">\r\n            <img src="http://www.joongdo.co.kr/web/images/deajeon1.jpg"/>\r\n        </a>\r\n\r\n        <a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_30">\r\n            <img src="http://www.joongdo.co.kr/web/images/deajeon2.jpg"/>\r\n        </a>\r\n    </div>\r\n    <!-- 대전 프로젝트 End -->\r\n\r\n\t<!-- 이슈별뉴스 s -->\r\n    <mte:cp id="166" name="메인_이슈별뉴스_컴포넌트" />\r\n\t<!-- 이슈별뉴스 e -->\r\n\r\n    <script>\r\n        var issue_news = $(".issue-news");\r\n        var issue_news_article = issue_news.find(".issue-news-list");\r\n\r\n        for(var i = 0; i < issue_news_article.length; i++) {\r\n            var rel_news_len = issue_news_article.eq(i).find(".rel-news li").length;\r\n            var read = issue_news_article.eq(i).find(".read");\r\n\r\n            switch(rel_news_len) {\r\n                case 1 :\r\n                    read.css({\r\n                        "-webkit-line-clamp" : "2",\r\n                        "height" : "3.4em"\r\n                    });\r\n                    break;\r\n                case 2 :\r\n                    read.remove();\r\n                    break;\r\n            }\r\n        }\r\n    </script>\r\n  \r\n    <link href="//www.joongdo.co.kr/main/webdata/template/2020main_major_news.css" rel="stylesheet">\r\n    <div class="content3">\r\n        <!-- 주요뉴스01 리스트 Start -->\r\n        <mte:cp id="148" name="메인_주요뉴스 01_컴포넌트"/>\r\n\r\n        <!-- 사설/칼럼 Start -->\r\n        <div class="section02">\r\n            <div class="opinion">\r\n            <mte:cp id="150" name="메인_오피니언_사설" />\r\n            <mte:cp id="151" name="메인_오피니언_칼럼" />                        \r\n            </div>\r\n        </div>\r\n        <!-- 사설/칼럼 End -->\r\n    </div>\r\n\r\n    <div class="content4">\r\n        <!-- 연재 Start -->\r\n        <mte:cp id="154" name="메인_연재"/>\r\n    </div>\r\n\r\n    <div class="content5">\r\n        <!-- 주요뉴스02 Start -->\r\n        <div class="section01">\r\n            <mte:cp id="160" name="메인_주요뉴스02" />\r\n        </div>\r\n        <!-- 주요뉴스02 End -->\r\n        <div class="section02">\r\n            <div class="sec-public">\r\n                <!-- 스포츠 Start -->\r\n                <mte:cp id="155" name="메인_스포츠" />\r\n                <!-- 스포츠 End -->\r\n                <!-- 주간이슈 키워드 Start -->\r\n                <mte:tp id="152" name="메인_이슈키워드" />\r\n                <!-- 주간이슈 키워드 End -->\r\n            </div>\r\n\r\n            <!-- 부동산 Start -->\r\n            <mte:cp id="157" name="메인_부동산" />\r\n            <!-- 부동산 End -->\r\n\r\n            <!-- 문화 Start -->\r\n            <mte:cp id="158" name="메인_문화" />\r\n            <!-- 문화 End -->\r\n\r\n            <!-- 전국 실시간뉴스 Start -->\r\n            <mte:cp id="159" name="메인_전국실시간 뉴스" />\r\n            <!-- 전국 실시간뉴스 End -->\r\n        </div>\r\n    </div>\r\n\r\n    <div class="content6">\r\n\t    <mte:cp id="152" name="메인_중도TV_비주얼"/>\r\n    </div>\r\n\r\n    <div class="content7">\r\n        <mte:cp id="149" name="메인_날씨"/>\r\n        <mte:tp id="140" name="메인_운세"/>\r\n    </div>\r\n\r\n    <div class="content8">\r\n        <mte:cp id="147" name="메인_랭킹뉴스"/>\r\n        <mte:cp id="146" name="메인_그래픽"/>\r\n    </div>\r\n\r\n    <mte:ct id="16" name="메인하단_박스"/>\r\n    <mte:tp id="129" name="메인_협력사"/>\r\n    <mte:tp id="128" name="메인_파트너사"/>\r\n    <mte:tp id="127" name="메인_대한민국지방신문협회"/>\r\n    <mte:ct id="15" name="사이트맵"/>\r\n\r\n</div>\r\n<mte:ct id="11" name="공통푸터"/>\r\n',
        useYn: 'Y',
        keyword: null,
        description: null,
        moveYn: 'N',
        moveUrl: null,
    },
];
