// 서버 api 경로
export const API_BASE_URL = process.env.REACT_APP_API_URL;

// 인증오류 코드
export const UNAUTHORIZED = 403;

// 로그인 url
export const LOGIN_URL = `${process.env.REACT_APP_API_URL}/login`;

// 한 페이지당 가능한 데이타 건수
export const PAGESIZE_OPTIONS = [20, 50, 100];

// 그룹당 페이지수
export const DISPLAY_PAGE_NUM = 10;

// 팝업 : 한 페이지당 가능한 데이타 건수
export const POP_PAGESIZE_OPTIONS = [10, 15, 50];

// 팝업 : 그룹당 페이지수
export const POP_DISPLAY_PAGE_NUM = 10;

// 공통코드 : API 공통코드
export const CODETYPE_API = 'API';

// 공통코드 : 페이지타입
export const CODETYPE_PAGE_TYPE = 'PAGE_TYPE';

// 공통코드 : 템플릿사이즈, 템플릿위치그룹
export const CODETYPE_TP_SIZE = 'TP_SIZE';
export const CODETYPE_TP_ZONE = 'TP_ZONE';

// 공통코드 : 언어
export const CODETYPE_LANG = 'LANG';

// 공통코드 : 서비스타입
export const CODETYPE_SERVICE_TYPE = 'SERVICE_TYPE';

// 편집데이타셋 조회 API명
export const EDIT_API = 'desking?ids=';

// API 파라미터 힌트
export const API_PARAM_HINT_DATASET_SEQ = 'datasetSeq';
export const API_PARAM_HINT_BUSE_ID = 'buseId';
export const API_PARAM_HINT_GIJA_ID = 'gijaId';
export const API_PARAM_HINT_SERIES_ID = 'seriesId';
export const API_PARAM_HINT_CODE_ID = 'codeId';

// 본문미리보기용 임시 기사키
export const SKIN_CONTENTS_ID = '20200320010003807';

// 템플릿 이미지 prefix
export const TEMPLATE_IMAGE_PREFIX = '/image/';

// W3C검사 URL
export const W3C_URL = 'https://validator.w3.org/check';

// 날짜 포맷
export const DB_DATE_FORMAT = 'YYYYMMDDHHmmss';

// 화면편집 탭
export const DESKING_TAB = 'DESKING';
export const EDITION_TAB = 'EDITION';
export const MY_TAB = 'MY';

// 화면편집 컴포넌트 저장 시간 간격(분)
export const DESKING_SAVE_INTERVAL = 5;

// 편집기사 기본값
export const DEFAULT_MORE_TARGET = '_blank';
export const DEFAULT_LINK_TARGET = '_blank';

// 볼륨경로
export const VOLUME_BASE_PATH = '/msp/resources/';

// 이미지 확장자 제한
export const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
