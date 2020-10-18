/**
 * msp-tps TpsConstants.java 2019. 11. 29. 오후 1:33:35 ssc
 */
package jmnet.moka.core.tps.common;

/**
 * <pre>
 * 
 * 2019. 11. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2019. 11. 29. 오후 1:33:35
 * @author ssc
 */
public class TpsConstants {

    public static final String DEFAULT_CHARSET = "UTF-8";
    public static final String CONTENT_TYPE = "Content-Type";

    public static final String DEFAULT_URL = "/";
    public static final String LOGIN_PAGE = "/login"; 					// 로그인 페이지
    public static final String ERROR_PAGE = "/error/**";				// 에러 페이지
    public static final String HEALTH_PAGE = "/command/health";			// healthcheck 페이지
    public static final String LOGIN_PROCESSING_URL = "/loginProcess"; 	// 로그인 처리 url
    public static final String LOGOUT_PAGE = "/logout"; 				// 로그아웃 처리 url
    public static final String VIEW_PREFIX = "/html";

    /** 24시간 */
    public static final int SESSION_MAX_INACTIVE_INTERVAL = 24 * 60 * 60;	// 24 * 60 * 60

    /** 권한 */
    public static final String ROLE_SUPERADMIN = "ROLE_SUPERADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    /** 에러페이지 */
    public static final String MODEL_ATTR_ROOTCAUSE = "rootCause";
    public static final String MODEL_ATTR_EXCEPTION = "exception";
    //    public static final String ERROR_PAGE_403 = "/html/error/403.html";
    //    public static final String ERROR_PAGE_500 = "/html/error/500.html";
    //    public static final String SESSION_EXPIRED_URL = "/html/error/sessionExpired.html"; // 세션 종료 페이지

    /** ResultDTO의 헤더코드 */
    public static final int HEADER_SUCCESS = 200;           // 성공
    public static final int HEADER_SERVER_ERROR = 500;      // 서버오류
    public static final int HEADER_BAD_REQUEST = 400;		// 요청오류
    public static final int HEADER_FILE_ERROR = 502;		// 파일관련 에러
    public static final int HEADER_UNAUTHORIZED = 403;		// 인증오류
    public static final int HEADER_NO_DATA = 201;           // 데이타없음
    public static final int HEADER_INVALID_DATA = 202;		// 데이타 유효성검사 실패
    public static final int HEADER_RELEATED_DATA = 203;		// 관련데이타로 인해 삭제실패

    /** 히스토리 작업구분 */
    public static final String WORKTYPE_INSERT = "I";       // 등록
    public static final String WORKTYPE_UPDATE = "U";       // 수정
    public static final String WORKTYPE_DELETE = "D";       // 삭제

    /** COMMAND API명칭 */
    public static final String COMMAND_PURGE = "command/purge";     // purge
    public static final String COMMAND_API = "command/api";         // api 목록
    public static final String COMMAND_DOMAIN = "command/domain";   // 도메인 로딩

    /** 온라인 매체 타입 */
    public static final String ONLINE_MEDIA_TYPE = "0";     // 온라인 매체 타입

    /** API 공통코드 타입 */
    public static final String DATAAPI = "API";
    
    /** 공통코드 */
    public static final String CODE_MGT_GRP_PAGE_TYPE = "PAGE_TYPE";

    /** 컴포넌트 DATA_TYPE */
    public static final String DATATYPE_NONE = "NONE";      // NONE
    public static final String DATATYPE_DESK = "DESK";     // DESK
    public static final String DATATYPE_AUTO = "AUTO";     // AUTO

    /** API CODE JSON 정보 */
    public static final String API_HOST = "apiHost";
    public static final String API_PATH = "apiPath";

    /** 템플릿 image prefix */
    public static final String TEMPLATE_IMAGE_PREFIEX = "/image/";

    public static final String SUPER_ADMIN_GROUP_CD = "999";

    /** 프로시져 호출결과 성공여부 */
    public static final Integer PROCEDURE_SUCCESS = 1;
    public static final Integer PROCEDURE_FAIL = -1;

    /** 검색타입 '전체' */
    public static final String SEARCH_TYPE_ALL = "all";

}
