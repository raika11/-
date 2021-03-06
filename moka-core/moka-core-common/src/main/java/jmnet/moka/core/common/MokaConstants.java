package jmnet.moka.core.common;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.utils.McpString;
import org.springframework.http.HttpStatus;

/**
 * <pre>
 * MSP 프로젝트의 공통 상수와 함수를 포함한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 4. 오후 4:16:07
 */
public class MokaConstants {

    public static final String ROOT_DATAPROVIDER = "dataProvider";    // 데이타 루트폴더명
    public static final String ROOT_TEMPLATE = "template";            // 템플릿 루트폴더명
    public static final String ROOT_TEMPLATE_HISTORY = "template_history";    // 템플릿히스토리 루트폴더명


    public static final String DOMAINS_JSON = "domains.json";
    public static final String DOMAIN_CODE_JSON = "code.json";
    public static final String DEFAULT_PATH = "0000";                // 공통, 기본 폴더명

    public static final String INTERCEPTOR_DEBUG = "moka.interceptor.debug";
    public static final String INTERCEPTOR_IGNORE = "moka.interceptor.ignore";
    public static final String INTERCEPTOR_REFUSED = "interceptorRefused";

    /* Jpa PersistanceUnit Names */
    public static final String PERSISTANCE_UNIT_TPS = "TPS-PersistenceUnit";

    /* Jpa PersistanceUnit Names */
    public static final String PERSISTANCE_UNIT_COMMENT = "COMMENT-PersistenceUnit";

    /* Jpa PersistanceUnit Names */
    public static final String PERSISTANCE_UNIT_MAIL = "MAIL-PersistenceUnit";

    /* moka-core-template 확장 */
    public static String ATTR_REL_CP = "relCp";
    public static String ATTR_MATCH = "match";
    public static String EL_JSON = Constants.PREFIX + "json";

    static {
        Constants.name2NodeTypeMap.put(EL_JSON, Constants.TYPE_STATEMENT);
    }

    /* Item Kind */
    public static final String ITEM_DOMAIN = "DOMAIN";  // 도메인
    public static final String ITEM_PAGE = "PG";        // 페이지
    public static final String ITEM_COMPONENT = "CP";    // 컴포넌트
    public static final String ITEM_TEMPLATE = "TP";    // 템플릿
    public static final String ITEM_CONTAINER = "CT";    // 컨테이너
    public static final String ITEM_AD = "AD";            // 광고
    public static final String ITEM_ARTICLE_PAGE = "AP"; // 기사페이지
    public static final String ITEM_UNKNOWN = "UNKNOWN";// 알수 없음
    public static final String ITEM_DATASET = "DS";        // 데이타셋
    public static final String ITEM_RESERVED = "RS";    // 예약어

    /* TMS Constants */
    public static final String INDEX_PAGE = "index";
    public static final String MERGE_PATH = "mergePath";
    public static final String MERGE_DOMAIN_ID = "mergeDomainId";
    public static final String MERGE_ITEM_TYPE = "mergeItemType";
    public static final String MERGE_ITEM_ID = "mergeItemId";
    public static final String MERGE_CONTEXT = "mergeContext";
    public static final String MERGE_CONTEXT_ITEM = "item";
    public static final String MERGE_DATA_MAP = "mergeDataMap";
    public static final String MERGE_START_TIME = "mergeStartTime";

    /* TMS Special URL prefix */
    public static final String MERGE_COMMAND_PREFIX = "/command";
    public static final String MERGE_ARTICE_PREFIX = "/article";
    public static final String MERGE_AMP_ARTICE_PREFIX = "/amparticle";
    public static final String MERGE_DIGITAL_SPECIAL_PREFIX = "/digitalspecial";
    public static final String MERGE_SITEMAP_PREFIX = "/sitemap/index";
    public static final String MERGE_ISSUE_PREFIX = "/issue";
    public static final String MERGE_SERIES_PREFIX = "/series";
    public static final String MERGE_TOPIC_PREFIX = "/topic";

    /* TMS Custom Token */
    public static final String MERGE_CONTEXT_DOMAIN = "domain";
    public static final String MERGE_CONTEXT_RESERVED = "reserved";
    public static final String MERGE_CONTEXT_PAGE = "page";
    public static final String MERGE_CONTEXT_PARAM = Constants.PARAM;
    public static final String MERGE_CONTEXT_CACHE_PARAM_LIST = "cacheParamList";
    public static final String MERGE_CONTEXT_MENUS = "menus";
    public static final String MERGE_CONTEXT_SECTION_MENU = "menus.sectionMenu";
    public static final String MERGE_CONTEXT_CODES = "codes";
    public static final String MERGE_CONTEXT_CATEGORY = "category";
    public static final String MERGE_CONTEXT_HEADER = "header";
    public static final String MERGE_CONTEXT_COOKIE = "cookie";
    public static final String MERGE_CONTEXT_CONTAINER = "container";
    public static final String MERGE_CONTEXT_COMPONENT = "component";
    public static final String MERGE_CONTEXT_TEMPLATE = "template";
    public static final String MERGE_CONTEXT_AD = "ad";
    public static final String MERGE_CONTEXT_ARTICLE = "article";
    public static final String MERGE_CONTEXT_ARTICLE_ID = "articleId";
    public static final String MERGE_CONTEXT_DIGITAL_SPECIAL_ID = "digitalSpecialId";
    public static final String MERGE_CONTEXT_PACKAGE_TYPE = "packageType";
    public static final String MERGE_CONTEXT_PACKAGE_ID = "packageId";
    public static final String MERGE_CONTEXT_BODY = "body";
    public static final String MERGE_CONTEXT_REG_ID = "regId";
    public static final String MERGE_CONTEXT_EDITION_SEQ = "editionSeq";
    public static final String MERGE_CONTEXT_ABTEST = "abTest";
    public static final String MERGE_CONTEXT_ABTEST_PREVIEW = "abTestPreview";

    /* Parameter & Component Paging */
    public static final String PARAM_PAGE = Constants.PARAM_PAGE;
    public static final String PARAM_COUNT = Constants.PARAM_COUNT;
    public static final String PARAM_SORT = Constants.PARAM_SORT;
    public static final String PARAM_CATEGORY = "category";
    public static final String PARAM_START = "start";
    public static final String PARAM_REG_ID = "regId";
    public static final String PARAM_FILTER = "filter";
    public static final String PARAM_DATE = "date";
    public static final String PARAM_EDITION_SEQ = "editionSeq";
    public static final String COMPONENT_PAGING_TYPE_NUMBER = "N";
    public static final String COMPONENT_PAGING_TYPE_MORE = "M";

    /* TMS ERROR PAGE */
    public static final String TMS_ERROR_PAGE = "/error";

    /* DPS Constants */
    public static final String SAMPLE_PATH = "samples";


    /* TMS Http parameter & Item Wrapping and highlight */
    public static final String PARAM_MERGE_DEBUG = "debug";
    public static final String PARAM_WRAP_ITEM = "wrapItem";
    public static final String PARAM_SHOW_ITEM = "showItem"; // itemType+itemId, ex) CP3
    public static final String PARAM_PAGE_ITEM_ID = "pageItemId"; // for Item merge, related page
    public static final String PARAM_REL_CP = "relCp"; // for Item merge, related component

    public static final String WRAP_ITEM_START =
            "<mte-start data-mte-type=\"${" + Constants.WRAP_ITEM_TYPE + "}\" data-mte-id=\"${" + Constants.WRAP_ITEM_ID + "}\"></mte-start>";
    public static final String WRAP_ITEM_END =
            "<mte-end data-mte-type=\"${" + Constants.WRAP_ITEM_TYPE + "}\" data-mte-id=\"${" + Constants.WRAP_ITEM_ID + "}\"></mte-end>";

    public static final String HIGHLIGHT_JS_PATH = "highlightJsPath";
    public static final String HIGHLIGHT_CSS_PATH = "highlightCssPath";
    public static final String SHOW_ITEM_TYPE = "itemType";
    public static final String SHOW_ITEM_ID = "itemId";
    public static final String ONLY_HIGHLIGHT = "onlyHighlight";
    public static final String HTML_WRAP_MERGE_ITEM_TYPE = "mergeItemType";
    public static final String HTML_WRAP_MERGE_ITEM_ID = "mergeItemId";
    public static final String HTML_WRAP_MERGE_CONTENT = "mergeContent";

    /* JSON dateformat */
    public static final String JSON_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String JSON_DATE_TIME_ZONE = "Asia/Seoul";
    public static final ZoneId JSON_ZONE_ID = ZoneId.of(MokaConstants.JSON_DATE_TIME_ZONE);
    public static final String JSON_SERVICE_DT_FORMAT = "yyyyMMddHHmmss";

    // DateFormat은 thread-safe하지 않음, jackson에서는 문제없다고는 함
    public static final SimpleDateFormat jsonDateFormat() {
        return new SimpleDateFormat(JSON_DATE_FORMAT);
    }

    // thread-safe한 date formatter
    public static final DateTimeFormatter dtf = DateTimeFormatter
            .ofPattern(JSON_DATE_FORMAT)
            .withZone(ZoneId.of(JSON_DATE_TIME_ZONE));

    public static final String now() {
        LocalDateTime now = LocalDateTime.now();
        return now.format(dtf);
    }

    /* page service name regx */
    public static final String PAGE_SERVICE_NAME_PATTERN = "^[a-zA-Z0-9_\\-]*$";
    public static final String PAGE_SERVICE_URL_PATTERN = "^[a-zA-Z0-9_\\-\\/\\*]*$";

    public static final String UNKNOWN = "UNKNOWN";
    public static final String SYSTEM_UNKNOWN = UNKNOWN;
    public static final String IP_UNKNOWN = UNKNOWN;
    public static final String USER_UNKNOWN = UNKNOWN;

    public static final String YES = McpString.YES;
    public static final String NO = McpString.NO;
    public static final String DELETE = McpString.DELETE;

    /* codes for service & parameter */
    public static final String CATEGORY_MASTER_CODE_LIST = "masterCode";
    public static final String CATEGORY_SERVICE_CODE_LIST = "serviceCode";
    public static final String CATEGORY_SOURCE_CODE_LIST = "sourceCode";
    public static final String CATEGORY_EXCEPT_SOURCE_CODE_LIST = "exSourceCode";
    public static final String CATEGORY_TERM = "term";
    public static final String CATEGORY_START_DATE = "startDate";
    public static final String CATEGORY_RELATED_CATEGORY_ENTRY = "relatedCategory";
    public static final String CATEGORY_FILTER_ONLY_JOONGANG = "FilterOnlyJoongang";
    public static final String CATEGORY_FILTER_ONLY_JOONGANG_PARAM_NAME = "filter";
    public static final String CATEGORY_FILTER_ONLY_JOONGANG_PARAM_VALUE_ALL = "All";
    public static final String CATEGORY_FILTER_DATE = "FilterDate";
    public static final String CATEGORY_SEARCH_PARAMETER = "SearchParameters";

    /* page service name regx */
    public static final String DIRECT_LINK_SERVICE_NAME_PATTERN = "/(http(s)?:\\/\\/)([a-z0-9\\w]+\\.*)+[a-z0-9]{2,4}/gi";

    /* naverbulk service */
    public static final String STATUS_SAVE = "save";
    public static final String STATUS_PUBLISH = "publish";
    // 중앙선데이
    public static final String SOURCE_CODE_61 = "61";
    // 중앙일보 집배신
    public static final String SOURCE_CODE_3 = "3";
    public static final String CLICKART_DIV_H = "H";
    public static final String CLICKART_DIV_N = "N";

    /**
     * Http Request Content-Type
     */
    public static final String CONTENT_TYPE = "Content-Type";
    public static final String AUTHORIZATION = "Authorization";
    public static final String ACCEPT = "Accept";
    /**
     * response header의 다운로드 파일명
     */
    public static final String HEADER_DOWNLOAD_FILENAME = "X-Suggested-Filename";

    /**
     * request header의 메뉴 ID key
     */
    public static final String HEADER_MENU_ID = "x-menuid";

    public static final String DEFAULT_CHARSET = "UTF-8";
    public static final int EXCEL_CELL_VALUE_MAX_LENGTH = 255;

    /**
     * ResultDTO의 헤더코드
     */
    public static final int HEADER_SUCCESS = HttpStatus.OK.value();           // 성공
    public static final int HEADER_SERVER_ERROR = HttpStatus.INTERNAL_SERVER_ERROR.value();      // 서버오류
    public static final int HEADER_BAD_REQUEST = HttpStatus.BAD_REQUEST.value();        // 요청오류
    public static final int HEADER_BAD_GATEWAY = HttpStatus.BAD_GATEWAY.value();        // 요청오류
    public static final int HEADER_UNAUTHORIZED = HttpStatus.UNAUTHORIZED.value();        // 인증오류
    public static final int HEADER_UNAUTHORIZED_GROUPWARE_NOTFOUND = 490;        // 그룹웨어 ID 없음 오류
    public static final int HEADER_UNAUTHORIZED_USERNAME_NOTFOUND = 491;        //
    public static final int HEADER_FORBIDDEN = HttpStatus.FORBIDDEN.value();        // 인증오류
    public static final int HEADER_NO_DATA = HttpStatus.NO_CONTENT.value();           // 데이타없음
    public static final int HEADER_INVALID_DATA = HttpStatus.BAD_REQUEST.value();        // 데이타 유효성검사 실패

    public static final int HEADER_FILE_ERROR = 470;        // 파일관련 에러
    public static final int HEADER_RELEATED_DATA = 471;        // 관련데이타로 인해 삭제실패

    public static final String MODEL_ATTR_EXCEPTION = "exception";
    public static final String MODEL_ATTR_ROOTCAUSE = "rootCause";

    /**
     * 미리보기
     */
    public static final String SYSTEM_AREA = "SYSTEM_AREA"; //미리보기 리소스의 컨텐트 토큰

    // APP OS 구분 코드
    public static final String PUSH_APP_OS_DIV = "APP_OS_DIV";

    // APP 디바이스 구분 코드
    public static final String PUSH_APP_DEV_DIV = "APP_DEV_DIV";

    // 푸시 APP 구분 코드
    public static final String PUSH_APP_DIV = "APP_DIV";

    // 푸시 중앙일보 앱 코드
    public static final String PUSH_APP_DIV_J = "J";

    // 푸시 유형 - 게시판 답변
    public static final String PUSH_TYPE_BOARD_REPLY = "B";


    /**
     * 상태(임시T/진행Y/대기P/종료Q) - AB테스트 정의
     */
    public static final String ABTEST_STATUS_T = "T"; //임시
    public static final String ABTEST_STATUS_Y = "Y"; //진행
    public static final String ABTEST_STATUS_P = "P"; //대기
    public static final String ABTEST_STATUS_Q = "Q"; //종료
}
