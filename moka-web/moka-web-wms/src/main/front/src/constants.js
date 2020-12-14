// 서버 api 경로
export const API_BASE_URL = process.env.REACT_APP_API_URL;

// DB 날짜 포맷
export const DB_DATEFORMAT = 'YYYY-MM-DD HH:mm:ss';

// image 확장자
export const ACCEPTED_IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];
export const UPLOAD_PATH_URL = '/mokastore/';

// 카드 컴포넌트 기본 높이
export const CARD_DEFAULT_HEIGHT = 817;
// 카드 접혔을 때 넓이
export const CARD_FOLDING_WIDTH = 32;

// 한 페이지당 가능한 데이타 건수
export const PAGESIZE_OPTIONS = [20, 50, 100];
export const MODAL_PAGESIZE_OPTIONS = [15, 30, 60];

// 그룹당 페이지수
export const DISPLAY_PAGE_NUM = 5;

// TEMS 아이템 타입
export const ITEM_PG = 'PG';
export const ITEM_AP = 'AP';
export const ITEM_CT = 'CT';
export const ITEM_CP = 'CP';
export const ITEM_TP = 'TP';
export const ITEM_DS = 'DS';

// 공통코드 : API 공통코드
export const CODETYPE_API = 'API';
// 공통코드 : 페이지타입
export const CODETYPE_PAGE_TYPE = 'PAGE_TYPE';
// 공통코드 : 기사타입
export const CODETYPE_ARTICLE_TYPE = 'AT';
// 공통코드 : 템플릿사이즈, 템플릿위치그룹
export const CODETYPE_TP_SIZE = 'TP_SIZE';
export const CODETYPE_TP_ZONE = 'TP_ZONE';
// 공통코드 : 언어
export const CODETYPE_LANG = 'LANG';
// 공통코드 : 서비스타입
export const CODETYPE_SERVICE_TYPE = 'SERVICE_TYPE';
// 공통코드 : 등록기사그룹
export const CODETYPE_ART_GROUP = 'ART_GROUP';
export const CODETYPE_ART_GROUP_NAME = 'ART_GROUP_NUM';
// 공통코드 : 네이버 벌크 약물
export const CODETYPE_SPECIALCHAR = 'specialChar';
// 공통코드 : 페이지편집폼 제목글자사이즈(Image type1-기본, Image type1-와이드, Vod type1-기본)
export const CODETYPE_DS_FONT_IMGD = 'DS_FONT_IMGD';
export const CODETYPE_DS_FONT_IMGW = 'DS_FONT_IMGW';
export const CODETYPE_DS_FONT_VODD = 'DS_FONT_VODD';
// 공통코드 : 페이지편집폼 제목/부제목 위치
export const CODETYPE_DS_TITLE_LOC = 'DS_TITLE_LOC';
// 공통코드 : 페이지편집폼 말머리
export const CODETYPE_DS_PRE = 'DS_PRE';
// 공통코드 : 페이지편집폼 말머리 위치
export const CODETYPE_DS_PRE_LOC = 'DS_PRE_LOC';
// 공통코드 : 페이지편집폼 아이콘
export const CODETYPE_DS_ICON = 'DS_ICON';

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

// 수동 데이터셋 api
export const DESKING_API = 'desking?ids=';

// 편집영역 컴포넌트 정렬 value
export const AREA_ALIGN_H = 'H';
export const AREA_ALIGN_V = 'V';
export const AREA_COMP_ALIGN_LEFT = 'LEFT';
export const AREA_COMP_ALIGN_RIGHT = 'RIGHT';
export const AREA_COMP_ALIGN_NONE = 'NONE';

// 인증 토큰 KEY
export const AUTHORIZATION = 'Authorization';
// 로그인 사용자 ID
export const SIGNIN_MEMBER_ID = 'SIGNIN_MEMBER_ID';

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

export const IMAGE_DEFAULT_URL = 'http://pds.joins.com';
export const snsNames = {
    fb: 'Facebook',
    tw: 'Twitter',
};
