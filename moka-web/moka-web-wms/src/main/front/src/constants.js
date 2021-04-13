// 서버 api 경로
export const API_BASE_URL = process.env.REACT_APP_API_URL;

// DB 날짜 포맷
export const DB_DATEFORMAT = 'YYYY-MM-DD HH:mm:ss';

// BASIC 날짜 포맷
export const BASIC_DATEFORMAT = 'YYYY-MM-DD HH:mm';

export const DATE_FORMAT = 'YYYY-MM-DD';

// image 확장자
export const ACCEPTED_IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];
export const UPLOAD_PATH_URL = '/moka_storage/';

// 테이블의 페이징 사이즈
export const PAGESIZE_OPTIONS = [20, 50, 100];
export const MODAL_PAGESIZE_OPTIONS = [15, 30, 60];
export const S_MODAL_PAGESIZE_OPTIONS = [10, 20, 30];

// 노출 페이지수
export const DISPLAY_PAGE_NUM = 5;

// TEMS 아이템 타입
export const ITEM_PG = 'PG';
export const ITEM_AP = 'AP';
export const ITEM_CT = 'CT';
export const ITEM_CP = 'CP';
export const ITEM_TP = 'TP';
export const ITEM_DS = 'DS';

// 시스템코드 : API
export const CODETYPE_API = 'API';
// 시스템코드 : 페이지타입
export const CODETYPE_PAGE_TYPE = 'PAGE_TYPE';
// 시스템코드 : 기사타입
export const CODETYPE_ARTICLE_TYPE = 'AT';
// 시스템코드 : 템플릿사이즈, 템플릿위치그룹
export const CODETYPE_TP_SIZE = 'TP_SIZE';
export const CODETYPE_TP_ZONE = 'TP_ZONE';
// 시스템코드 : 언어
export const CODETYPE_LANG = 'LANG';
// 시스템코드 : 서비스타입
export const CODETYPE_SERVICE_TYPE = 'SERVICE_TYPE';
// 시스템코드 : 등록기사그룹
export const CODETYPE_ART_GROUP = 'ART_GROUP';
export const CODETYPE_ART_GROUP_NAME = 'ART_GROUP_NUM';
// 시스템코드 : 네이버 벌크 약물
export const CODETYPE_SPECIALCHAR = 'specialChar';
// 시스템코드 : 페이지편집폼 제목글자사이즈(Image type1-기본, Image type1-와이드, Vod type1-기본)
export const CODETYPE_DS_FONT_IMGD = 'DS_FONT_IMGD';
export const CODETYPE_DS_FONT_IMGW = 'DS_FONT_IMGW';
export const CODETYPE_DS_FONT_VODD = 'DS_FONT_VODD';
// 시스템코드 : 페이지편집폼 제목/부제목 위치
export const CODETYPE_DS_TITLE_LOC = 'DS_TITLE_LOC';
// 시스템코드 : 페이지편집폼 말머리
export const CODETYPE_DS_PRE = 'DS_PRE';
// 시스템코드 : 페이지편집폼 말머리 위치
export const CODETYPE_DS_PRE_LOC = 'DS_PRE_LOC';
// 시스템코드 : 페이지편집폼 아이콘
export const CODETYPE_DS_ICON = 'DS_ICON';
// 시스템코드 : 디지털스페셜 페이지코드
export const CODETYPE_PT = 'PT';
// 시스템코드 : 네이버채널 템플릿
export const CODETYPE_CHANNEL_TP = 'CHANNEL_TP';
// 시스템코드 : 등록기사 출판 카테고리
export const CODETYPE_PRESS_CATE1 = 'PRESS_CATE1';
// 시스템코드 : 중앙선데이 조판 출판 카테고리
export const CODETYPE_PRESS_CATE61 = 'PRESS_CATE61';
// 시스템코드 : HTTP 메소드
export const CODETYPE_HTTP_METHOD = 'HTTP_METHOD';
// 시스템코드 : API 타입
export const CODETYPE_API_TYPE = 'API_TYPE';
// 시스템코드 : 투어 연령대
export const CODETYPE_TOUR_AGE = 'TOUR_AGE';
// 시스템코드 : 벌크 전송 포털
export const CODETYPE_BULK_SITE = 'BULK_SITE';
// 시스템코드 : 스케줄 작업 분류
export const CODETYPE_GEN_CATE = 'GEN_CATE';
// 시스템코드 : 스케줄 예약 코드
export const CODETYPE_BO_SCHJOB = 'BO_SCHJOB';
// 시스템코드 : 필진 타입
export const CODETYPE_JPLUS_REP = 'JPLUS_REP';

// 기본 필진 코드타입 텍스트 (JPLUS_REP_DIV === null 일 때 노출하는 텍스트)
export const JPLUS_REP_DIV_DEFAULT = '일보기자';

// 통신 실패 message
export const NETWORK_ERROR_MESSAGE = '네트워크 오류가 발생하였습니다. 관리자에게 문의하세요.';

// API 파라미터 힌트
export const API_PARAM_HINT_DATASET_SEQ = 'datasetSeq';
export const API_PARAM_HINT_BUSE_ID = 'buseId';
export const API_PARAM_HINT_GIJA_ID = 'gijaId';
export const API_PARAM_HINT_SERIES_ID = 'seriesId';
export const API_PARAM_HINT_CODE_ID = 'codeId';

// W3C검사 URL
export const W3C_URL = 'https://validator.w3.org/check';

// tems
export const TEMS_PREFIX = 'tems';

// 편집 데이터셋 api
export const DESKING_API = 'desking?ids=';

// 편집영역 컴포넌트 정렬 value
export const AREA_ALIGN_H = 'H';
export const AREA_ALIGN_V = 'V';
export const AREA_COMP_ALIGN_LEFT = 'LEFT';
export const AREA_COMP_ALIGN_RIGHT = 'RIGHT';
export const AREA_COMP_ALIGN_NONE = 'NONE';

// 인증 토큰 KEY
export const AUTHORIZATION = 'AUTHORIZATION';
// 로그인 사용자 ID
export const SIGNIN_MEMBER_ID = 'SIGNIN_MEMBER_ID';
//ID 저장 체크
export const SIGNIN_MEMBER_ID_SAVE = 'SIGNIN_MEMBER_ID_SAVE';

// 페이지편집 기사 편집 그룹의 최대 개수
export const MAX_GROUP_NUMBER = 8;

// 편집기사 기본언어
export const DEFAULT_LANG = 'KR';

// 페이지편집의 편집상태
export const DESK_HIST_SAVE = 'SAVE'; // 임시저장
export const DESK_HIST_PUBLISH = 'PUBLISH'; // 전송

// 컴포넌트 데이터타입
export const DATA_TYPE_DESK = 'DESK';
export const DATA_TYPE_AUTO = 'AUTO';
export const DATA_TYPE_FORM = 'FORM';
export const DATA_TYPE_NONE = 'NONE';

// PDS URL
export const PDS_URL = process.env.REACT_APP_PDS_URL;

// IR URL
export const IR_URL = process.env.REACT_APP_IR_URL;

// SNS NAME
export const snsNames = { fb: 'Facebook', tw: 'Twitter' };

// 디지털스페셜 링크
export const DIGITAL_SPECIAL_URL = 'https://stg-news.joongang.co.kr/DigitalSpecial/';

// 본문 링크
export const ARTICLE_URL = 'https://stg-news.joongang.co.kr/article/';
export const MOBILE_ARTICLE_URL = 'https://mnews.joins.com/article/';

// 페이스북 디버그 툴 링크 (모바일URL)
export const FB_DEBUGGER_LINK = 'https://developers.facebook.com/tools/debug/echo/?q=https://mnews.joins.com/article/';

// 이미지 CROSS ORAGIN 우회 API
export const IMAGE_PROXY_API = `${API_BASE_URL}/api/app/image-proxy?url=`;

// 등록기사, 수신기사 매체 스토리지 키
export const ARTICLE_SOURCE_LIST_KEY = 'ARTICLE_SOURCE_LIST';
export const RCV_ARTICLE_SOURCE_LIST_KEY = 'ARTICLE_SOURCE_LIST';

// 미리보기 도메인ID
export const PREVIEW_DOMAIN_ID = '1000';

/**
 * 벌크 관련 구분 코드
 *
 * 중앙일보 : bulk_source = '3'
 * 중앙썬데이 : bulk_source = '60'
 * 네이버 벌크 : bulk_div = 'N'
 * 핫클릭 : bulk_div = 'H'
 */
export const BULKS_CODE = {
    'bulkn-ja': {
        bulk_source: '3', // 출처
        bulk_div: 'N', // 벌크 구분
    },
    'bulkn-su': {
        bulk_source: '61', // 출처
        bulk_div: 'N',
    },
    'bulkh-ja': {
        bulk_source: '3', // 출처
        bulk_div: 'H',
    },
    'bulkh-su': {
        bulk_source: '61', // 출처
        bulk_div: 'H',
    },
};

// 편집영역 메뉴에 따른 리스트 조회 별도 처리
export const AREA_HOME = [
    { name: '홈 섹션편집', value: '3' },
    { name: '선데이 홈 섹션편집', value: '61' },
];

// iconTab의 핫키
export const ICON_TAB_HOT_KEYS = ['shift+Q', 'shift+W', 'shift+E', 'shift+R', 'shift+T', 'shift+Y', 'shift+U', 'shift+I', 'shift+O', 'shift+P'];

// 서비스사이트의 breakpoint
export const BREAKPOINT_SERVICE = { mobile: [375, 767], tablet: [768, 1199], pc: [1200, 1400], wide: [1401, Infinity] };

// 스케줄 서버 주기
export const SCHEDULE_PERIOD = [
    { period: 30, periodNm: '30초' },
    { period: 60, periodNm: '1분' },
    { period: 120, periodNm: '2분' },
    { period: 300, periodNm: '5분' },
    { period: 600, periodNm: '10분' },
    { period: 1200, periodNm: '20분' },
    { period: 1800, periodNm: '30분' },
    { period: 3600, periodNm: '1시간' },
    { period: 43200, periodNm: '12시간' },
    { period: 86400, periodNm: '24시간' },
    { period: 0, periodNm: '상시' },
];

// 스케줄 서버 예약작업 실행 상태
export const SCHEDULE_STATUS = [
    { status: '0', statusNm: '준비' },
    { status: '1', statusNm: '전송 완료' },
    { status: '2', statusNm: '서버 오류' },
    { status: '3', statusNm: '삭제된 테스크' },
    { status: '4', statusNm: '실행 결과 실패' },
    { status: '9', statusNm: '진행 중' },
];

// 데스킹 기사의 채널 타입
export const CHANNEL_TYPE = {
    A: { code: 'A', name: '기사' },
    D: { code: 'D', name: '더미기사' },
    M: { code: 'M', name: '영상' },
    I: { code: 'I', name: '패키지' },
    R: { code: 'R', name: '기자' },
    C: { code: 'C', name: '칼럼니스트' },
};
