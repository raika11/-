/**
 * msp-tps TpsConstants.java 2019. 11. 29. 오후 1:33:35 ssc
 */
package jmnet.moka.core.tps.common;

import jmnet.moka.core.common.MokaConstants;

/**
 * <pre>
 *
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2019. 11. 29. 오후 1:33:35
 */
public class TpsConstants extends MokaConstants {

    public static final String DEFAULT_CHARSET = "UTF-8";
    public static final String CONTENT_TYPE = "Content-Type";

    public static final String DEFAULT_URL = "/";
    public static final String LOGIN_PAGE = "/login";                    // 로그인 페이지
    public static final String ERROR_PAGE = "/error/**";                // 에러 페이지
    public static final String HEALTH_PAGE = "/command/health";            // healthcheck 페이지
    public static final String LOGIN_PROCESSING_URL = "/loginProcess";    // 로그인 처리 url
    public static final String LOGOUT_PAGE = "/logout";                // 로그아웃 처리 url
    public static final String VIEW_PREFIX = "/html";

    /**
     * 24시간
     */
    public static final int SESSION_MAX_INACTIVE_INTERVAL = 24 * 60 * 60;    // 24 * 60 * 60

    /**
     * 권한
     */
    public static final String ROLE_SUPERADMIN = "ROLE_SUPERADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    /**
     * 히스토리 작업구분
     */
    public static final String WORKTYPE_INSERT = "I";       // 등록
    public static final String WORKTYPE_UPDATE = "U";       // 수정
    public static final String WORKTYPE_DELETE = "D";       // 삭제

    /**
     * COMMAND API명칭
     */
    public static final String COMMAND_PURGE = "command/purge";     // purge
    public static final String COMMAND_API = "command/api";         // api 목록
    public static final String COMMAND_DOMAIN = "command/domain";   // 도메인 로딩

    /**
     * 온라인 매체 타입
     */
    public static final String ONLINE_MEDIA_TYPE = "0";     // 온라인 매체 타입

    /**
     * API 공통코드 타입
     */
    public static final String DATAAPI = "API";

    /**
     * 공통코드
     */
    public static final String CODE_MGT_GRP_PAGE_TYPE = "PAGE_TYPE";

    /**
     * 페이지 기본타입
     */
    public static final String PAGE_TYPE_HTML = "text/html";

    /**
     * 컴포넌트 DATA_TYPE
     */
    public static final String DATATYPE_NONE = "NONE";      // NONE
    public static final String DATATYPE_DESK = "DESK";      // DESK
    public static final String DATATYPE_AUTO = "AUTO";      // AUTO
    public static final String DATATYPE_FORM = "FORM";      // FORM

    /**
     * 컴포넌트 페이징 유형
     */
    public static final String PAGING_TYPE_NEXT = "N";     // 이전/다음
    public static final String PAGING_TYPE_MORE = "M";     // 더보기

    /**
     * 컴포넌트 페이징 기본값
     */
    public static final Integer PER_PAGE_COUNT = 20;        // 페이지당 건수
    public static final Integer MAX_PAGE_COUNT = 100;       // 최대 페이지수
    public static final Integer DISP_PAGE_COUNT = 10;       // 표출 페이지수
    public static final Integer MORE_COUNT = 10;            // 더보기 건수

    /**
     * 언어 기본값
     */
    public static final String DEFAULT_LANG = "KR";

    /**
     * 관련아이템 없음
     */
    public static final String REL_TYPE_UNKNOWN = "NN";

    /**
     * API CODE JSON 정보
     */
    public static final String API_HOST = "apiHost";
    public static final String API_PATH = "apiPath";

    public static final String SUPER_ADMIN_GROUP_CD = "999";
    public static final String TEST_ADMIN_GROUP_CD = "333"; // 사용자 그룹 권한 테스트용, 테스트 완료 후 삭제 요망

    /**
     * 프로시져 호출결과 성공여부
     */
    public static final Integer PROCEDURE_SUCCESS = 1;
    public static final Integer PROCEDURE_FAIL = -1;

    /**
     * 검색타입 '전체'
     */
    public static final String SEARCH_TYPE_ALL = "all";

    /**
     * 파일관리 업무별 구분
     */
    public static final String TEMPLATE_BUSINESS = "template";
    public static final String CONTAINER_BUSINESS = "container";

    /**
     * 파일관리 업무별 구분
     */
    public static final String DIRECT_LINK_BUSINESS = "directlink";

    /**
     * 파일관리 업무별 구분(워터마크)
     */
    public static final String WATERMARK_BUSINESS = "watermark";



    /**
     * response header의 다운로드 파일명
     */
    public static final String HEADER_DOWNLOAD_FILENAME = "X-Suggested-Filename";

    // 최상위 메뉴 ID
    public static final String ROOT_MENU_ID = "00";


    /**
     * 편집영역 정렬
     */
    public static final String AREA_ALIGN_H = "H";
    public static final String AREA_ALIGN_V = "V";

    /**
     * 편집영역 컴포넌트 정렬
     */
    public static final String AREA_COMP_ALIGN_LEFT = "LEFT";
    public static final String AREA_COMP_ALIGN_RIGHT = "RIGHT";
    public static final String AREA_COMP_ALIGN_NONE = "NONE";

    /**
     * 기사타입
     */
    public static final String DEFAULT_ART_TYPE = "B";

    /**
     * 미리보기용 날짜포맷
     */
    public static final String PREVIEW_DT_FORMAT = "yyyyMMddHHmmss";

    // 관리자 게시판 등록/수정
    public static final String BOARD_REG_DIV_ADMIN = "A";
    // 일반 사용자 게시판 등록/수정
    public static final String BOARD_REG_DIV_MEMBER = "M";

    // 공지사항 게시물
    public static final int BOARD_NOTICE_CONTENT = 9;
    // 일반 게시물
    public static final int BOARD_GENERAL_CONTENT = 1;

    // 댓글 태그 구분 그룹 코드
    public static final String CMT_TAG_DIV = "CMT_TAG_DIV";

    // HTTP METHOD 기타코드 그룹 코드
    public static final String API_METHOD = "API_METHOD";

    // API 그룹 코드
    public static final String API_TYPE_CODE = "API_TYPE";

    // 댓글 매체 그룹 코드
    public static final String COMMENT_MEDIA_CODE = "CMT_MEDIA";

    // 댓글 계정 사이트 그룹 코드
    public static final String COMMENT_SITE_CODE = "COMMENT_SITE";

    // 댓글 차단 유형 그룹 코드
    public static final String COMMENT_TAG_DIV_CODE = "CMT_TAG_DIV";

    // 사이트 코드 포토아카이브 연동시 사용
    public static final String SITE_CD = "JAI";

    // SNS 예약 게시 JOB_CODE
    public static final String SNS_RESERVED_PUBLISH_JOB_CD = "SNS_PUBLISH";
    // SNS 게시 삭제 예약 JOB_CODE
    public static final String SNS_RESERVED_DELETE_JOB_CD = "SNS_DELETE";

    public static final String SERVER_REFUSED = "refused";

    // 편집예약 JOB_CD
    public static final String DESKING_JOB_CD = "DESKING_PUBLISH";

    // 이슈예약 JOB_CD
    public static final String ISSUE_JOB_CD = "ISSUE_PUBLISH";

    // 게시판 서비스 유형
    public static final String BOARD_DIVS_CD = "BOARD_DIVS";

    // 게시판 관리자 유형
    public static final String BOARD_DIVA_CD = "BOARD_DIVA";

    // J팟용 게시판
    public static final String BOARD_JPOD = "BOARD_DIVC1";
}
