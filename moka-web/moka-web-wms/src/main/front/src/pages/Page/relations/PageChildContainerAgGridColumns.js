import React from 'react';
import AppendButton from '../components/ContainerAppendButton';
import ContainerLinkButton from '../components/ContainerLinkButton';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
        preventRowClick: false,
    },
    {
        headerName: '이름',
        field: 'containerName',
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 230,
    },
    {
        headerName: '',
        field: 'append',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => <AppendButton {...params} />,
        preventRowClick: true,
    },
    {
        headerName: '',
        field: 'link',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => <ContainerLinkButton {...params} />,
        preventRowClick: true,
    },
];

export const rowData = [
    {
        containerSeq: 13,
        containerName: '메인하단_박스',
        containerBody:
            '<div class="content9">\r\n    <div class="joongdo-box">\r\n<mte:tp id="131" name="메인_기자상"/>\r\n<mte:cp id="144" name="메인_알립니다"/>\r\n<mte:tp id="130" name="메인_PDF"/>\r\n<mte:tp id="126" name="구독신청_독자투고배너"/>\r\n    </div>\r\n</div>',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 12,
        containerName: '사이트맵',
        containerBody:
            '<style>\r\n/* 사이트맵 */\r\n.content13{width:100%; border-top:2px solid #444; padding-bottom:50px; overflow:hidden;}\r\n.sitemap{width:1100px; margin:0 auto;}\r\n.sitemap > div{width:140px; float:left; height:300px; padding:40px 0;}\r\n.sitemap > div:nth-child(1),.sitemap > div:nth-child(2),.sitemap > div:nth-child(3),.sitemap > div:nth-child(4),.sitemap > div:nth-child(5),.sitemap > div:nth-child(6){border-bottom:1px solid #ddd;}\r\n.sitemap > div:nth-child(6){width:260px;}\r\n.sitemap > div:nth-child(3){width:170px;}\r\n.sitemap > div:nth-child(4){width:260px;}\r\n.sitemap > div:nth-child(7){width:220px;}\r\n.sitemap > div:nth-child(5){width:140px;}\r\n.sitemap > div:nth-child(6){width:260px;}\r\n.sitemap > div:nth-child(10){width:190px;}\r\n.sitemap > div:nth-child(4) ul,.sitemap > div:nth-child(5) ul,.sitemap > div:nth-child(6) ul{width:100px;}\r\n.sitemap > div:nth-child(6) ul:last-of-type{width:126px;}\r\n.sitemap > div:nth-child(10) ul{width:95px;}\r\n.sitemap > div:nth-child(11){width:150px;}\r\n.sitemap > div:nth-child(12),.sitemap > div:nth-child(13){width:130px;}\r\n.sitemap > div:first-of-type,.sitemap > div ul{width:100px;}\r\n.sitemap strong{font-size:14px; font-weight:600; margin-bottom:15px; display:block;}\r\n.sitemap strong a{font-weight:500; color:#000;}\r\n.sitemap ul{width:126px; float:left;}\r\n.sitemap ul li{font-size:12px; line-height:26px;}\r\n.sitemap ul li a{color:#666;}\r\n.sitemap ul li a:hover{text-decoration:underline;}\r\n.pdf-depth02{margin-top:20px;}\r\n</style>\r\n\r\n<div class="content13">\r\n\t<!-- 사이트맵s -->\r\n\t<section class="sitemap">\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/list_news.php">속보</a></strong>\r\n\t\t</div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/jdtv/jdtv.php">중도TV</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/jdtv/jdtv_list.php?ncid=N11">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/jdtv/jdtv_list.php?ncid=N11_03">기획</a></li><li><a href="http://www.joongdo.co.kr/web/jdtv/jdtv_list.php?ncid=N11_04">시·도정소식</a></li><li><a href="http://www.joongdo.co.kr/web/jdtv/jdtv_list.php?ncid=N11_09">현장리포트</a></li><li><a href="http://www.joongdo.co.kr/web/jdtv/jdtv_list.php?ncid=N11_13">신천식의 이슈토론</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N01">정치행정</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_01">대전</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_02">충남/내포</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_03">지방의회</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_04">국회/정당</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_05">국정/외교</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_06">세종</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_08">지방정가</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N01_36">[캠페인] 코로나19<br>극복 응원메시지</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N02">경제과학</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_01">지역경제</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_02">건설/부동산</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_03">금융/증권</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_04">유통/쇼핑</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_05">기업/CEO</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_06">자동차</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_07">취업/창업</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_08">대전정부청사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_09">대덕특구</a></li></ul><ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_14">IT/과학</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_16">아파트Info</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_21">로또</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_22">생활의 지혜</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N02_29">4차 산업</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N03">사회교육</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_01">사건/사고</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_02">법원/검찰</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_03">교육/시험</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_04">노동/노사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_05">환경/교통</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_07">미담</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_08">날씨</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_23">건강/의료</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N03_21">이슈&amp;화제</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N06">문화</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_01">공연/전시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_02">영화/비디오</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_03">문화/출판</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_05">여성/생활</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_08">여행/축제</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_38">문화 일반</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_74">문예공론</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_80">사자성어는 삶의 이음매</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N06_81">장상현의 재미있는 고사성어</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N08">사람들</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_01">인터뷰</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_02">새인물</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_03">인사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_04">동정</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_05">알림</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_06">부고</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_07">뉴스</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_08">社告</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_10">결혼</a></li></ul><ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_11">내방</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_13">바로잡습니다</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_16">다문화 신문</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N08_26">사회복지신문</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N10">기획/연재</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_05">중도초대석</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_47">기획</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_167">신천식의 이슈토론</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_168">리뉴얼 충청</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N10_169">대전기록프로젝트</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N15">운세</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_01">오늘의 운세</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_03">오늘의 별자리</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_05">주간운세</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_06">생년월일 운세</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_07">별별 로또</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_08">구박사 오늘 띠별 운세</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N15_09">별자리 12궁운세</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N05">전국</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_21">수도권</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_22">부산/영남</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_16">충북</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_23">광주/호남</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_26">강원</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_03">천안시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_17">아산시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_01">공주시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_02">보령시</a></li></ul><ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_04">서산시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_05">논산시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_06">계룡시</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_07">금산군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_09">부여군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_10">서천군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_11">청양군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_13">예산군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_14">태안군</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N05_15">당진시</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N09">오피니언</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09_01">사설</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09_56">세상읽기</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09_83">편집국에서</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09_93">우난순의 식탐</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N09_15">중도일보 독자위원회</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/section.php?ncid=N07">스포츠</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_01">한화이글스</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_02">축구</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_09">스포츠종합</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_08">메이저리그</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N07_30">대전시티즌</a></li>\t\t</ul></div>\r\n\t\t<div class="col">\r\n\t\t\t<strong><a href="http://www.joongdo.co.kr/web/visual.php">비주얼</a></strong>\r\n\t\t\t<ul><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N20&amp;all=y">전체기사</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N20_01">카드뉴스</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N20_02">포토</a></li><li><a href="http://www.joongdo.co.kr/web/list_news.php?ncid=N20_03">인포그래픽</a></li>\t\t\t<strong class="pdf-depth02"><a href="http://www.joongdo.co.kr/web/pdf.php">PDF</a></strong>\r\n\t\t\t<ul>\r\n\t\t\t\t<li><a href="http://www.joongdo.co.kr/web/pdf.php">전자신문(아이스크랩)</a></li>\r\n\t\t\t\t<li><a href="http://www.joongdo.co.kr/newspaper">PDF 보기</a></li>\r\n\t\t\t</ul>\r\n\t\t</ul></div>\r\n\t</section>\r\n\t<!-- 사이트맵e -->\r\n</div>',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 11,
        containerName: '공통푸터',
        containerBody:
            '<footer>\r\n    <div class="footer">\r\n        <div class="foot-logo"></div>\r\n        <div class="foot-right">\r\n            <ul class="foot-menu">\r\n                <li><a href="http://www.joongdo.co.kr/web/company/company_index.php">회사소개</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/company/company01_3.php">조직도</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/company/company01_5.php">찾아오시는 길</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=clause">회원약관</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=person">개인정보취급방침</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=email">이메일무단수집거부</a></li>\r\n                <li><a href="javascript://" onclick="common._popup(\'http://www.joongdo.co.kr/web/company/subscription.php\', \'subscript\', 695, 800)">신문구독신청</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/company/company_jebo.php">독자투고</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/rss.php">서울시스템 RSS</a></li>\r\n            </ul>\r\n            <ul class="foot-menu">\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=problem">고충처리인</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=edit_role">편집규약</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=role_01">윤리강령 및 기자준칙</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=role_02">제작 윤리강령</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=role_03">광고 윤리강령</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=role_04">판매 윤리강령</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=role_05">청탁금지법 안내</a></li>\r\n                <li><a href="http://www.joongdo.co.kr/web/member.php?mode=protection">청소년보호정책</a></li>\r\n                <li><a href="https://download.teamviewer.com/download/version_13x/TeamViewerQS.exe" target="_blank">원격지원</a></li>\r\n            </ul>\r\n\r\n            <address>(03175) 서울시 종로구 경희궁길 14 (신영빌딩) 4층  전화 : 02-510-0600</address>\r\n            <p class="copyright">Copyright by 서울시스템 Co.,Ltd. All Rights Reserved </p>\r\n        </div>\r\n    </div>\r\n</footer>\r\n</div>\r\n</body>\r\n</html>',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 10,
        containerName: '공통헤더',
        containerBody:
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\r\n<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">\r\n<meta name="viewport" content="width=1100,  initial-scale=1.0">\r\n<head>\r\n\r\n    <title>서울시스템 - 정치, 경제, 사회, 문화 등 기사제공</title>\r\n\t<meta name="description" content="서울시스템 - 정치, 경제, 사회, 문화 등 기사제공" />\r\n\t<meta name="keywords" content="서울시스템 - 정치, 경제, 사회, 문화 등 기사제공" />\r\n\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n    <meta property="og:type" content="website">\r\n    <meta property="og:site_name" content="서울시스템">\r\n    <meta property="og:title" content="서울시스템 - 정치, 경제, 사회, 문화 등 기사제공">\r\n    <meta property="og:description" content="서울시스템 - 정치, 경제, 사회, 문화 등 기사제공">\r\n    <meta property="og:image" content="http://dn.joongdo.co.kr/web/images/joongdo_logo.png">\r\n    <meta property="og:url" content="http://www.joongdo.co.kr/web/">\r\n    <meta property="og:locale" content="ko_KR">\r\n    <meta property="og:image:width" content="600">\r\n    <meta property="og:image:height" content="325">\r\n\t    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\r\n    <meta name="robots" content="all" />\r\n    <link rel="stylesheet" type="text/css" href="http://www.joongdo.co.kr/web/css/common.css"/>\r\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>\r\n    <script>window.jQuery || document.write("<script src=\'http://www.joongdo.co.kr/js/jquery.min.js\'><\\/script>");</script>\r\n    <script type="text/javascript" src="//www.joongdo.co.kr/web/js/common.js"></script>\r\n    <script type="text/javascript" src="//www.joongdo.co.kr/js/slick.js"></script>\r\n    <script type="text/javascript" src="//www.joongdo.co.kr/js/swiper.min.js"></script>\r\n    <script type="text/javascript" src="//www.joongdo.co.kr/js/jquery.bxslider.min.js"></script>\r\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyloadxt/1.1.0/jquery.lazyloadxt.extra.min.js"></script>\r\n    <script>window.jQuery || document.write("<script src=\'//www.joongdo.co.kr/js/jquery.lazyloadxt.extra.min.js\'><\\/script>");</script>\r\n</head>\r\n\r\n',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 1,
        containerName: '1',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 2,
        containerName: '2',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 3,
        containerName: '3',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 4,
        containerName: '4',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 5,
        containerName: '5',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 6,
        containerName: '6',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 7,
        containerName: '7',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 8,
        containerName: '8',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 9,
        containerName: '9',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 14,
        containerName: '14',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 15,
        containerName: '15',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 16,
        containerName: '16',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 17,
        containerName: '17',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 18,
        containerName: '18',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 19,
        containerName: '19',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 20,
        containerName: '20',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 21,
        containerName: '21',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 22,
        containerName: '22',
        containerBody: '',
        useYn: null,
        domain: null,
    },
    {
        containerSeq: 23,
        containerName: '23',
        containerBody: '',
        useYn: null,
        domain: null,
    },
];
