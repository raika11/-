package jmnet.moka.core.common;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.utils.McpString;

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

    public final static String ROOT_DATAPROVIDER = "dataProvider";    // 데이타 루트폴더명
    public final static String ROOT_TEMPLATE = "template";            // 템플릿 루트폴더명
    public final static String ROOT_TEMPLATE_HISTORY = "template_history";    // 템플릿히스토리 루트폴더명


    public final static String DOMAINS_JSON = "domains.json";
    public final static String DOMAIN_CODE_JSON = "code.json";
    public final static String DEFAULT_PATH = "0000";                // 공통, 기본 폴더명

    public static final String INTERCEPTOR_DEBUG = "moka.interceptor.debug";
    public static final String INTERCEPTOR_IGNORE = "moka.interceptor.ignore";
    public final static String INTERCEPTOR_REFUSED = "interceptorRefused";

    /* Jpa PersistanceUnit Names */
    public final static String PERSISTANCE_UNIT_TPS = "TPS-PersistenceUnit";

    /* moka-core-template 확장 */
    public static String ATTR_REL_CP = "relCp";
    public static String ATTR_MATCH = "match";
    public static String EL_JSON = Constants.PREFIX + "json";

    static {
        Constants.name2NodeTypeMap.put(EL_JSON, Constants.TYPE_STATEMENT);
    }

    /* Item Kind */
    public final static String ITEM_DOMAIN = "DOMAIN";  // 도메인
    public final static String ITEM_PAGE = "PG";        // 페이지
    public final static String ITEM_COMPONENT = "CP";    // 컴포넌트
    public final static String ITEM_TEMPLATE = "TP";    // 템플릿
    public final static String ITEM_CONTAINER = "CT";    // 컨테이너
    public final static String ITEM_AD = "AD";            // 광고
    public final static String ITEM_CONTENT_SKIN = "CS";// 콘텐트(기사본문)스킨
    public final static String ITEM_UNKNOWN = "UNKNOWN";// 알수 없음
    public final static String ITEM_DATASET = "DS";        // 데이타셋
    public final static String ITEM_RESERVED = "RS";    // 예약어

    /* TMS Constants */
    public static String INDEX_PAGE = "index";
    public static String MERGE_PATH = "mergePath";
    public static String MERGE_DOMAIN_ID = "mergeDomainId";
    public static String MERGE_ITEM_TYPE = "mergeItemType";
    public static String MERGE_ITEM_ID = "mergeItemId";
    public static String MERGE_CONTEXT = "mergeContext";
    public static String MERGE_CONTEXT_ITEM = "item";
    public static String MERGE_DATA_MAP = "mergeDataMap";
    public static String MERGE_ARTICE_PREFIX = "/article";
    public static String MERGE_DIGITAL_SPECIAL_PREFIX = "/digitalspecial";

    /* TMS Custom Token */
    public static String MERGE_CONTEXT_DOMAIN = "domain";
    public static String MERGE_CONTEXT_RESERVED = "reserved";
    public static String MERGE_CONTEXT_PAGE = "page";
    public static String MERGE_CONTEXT_PARAM = Constants.PARAM;
    public static String MERGE_CONTEXT_HEADER = "header";
    public static String MERGE_CONTEXT_COOKIE = "cookie";
    public static String MERGE_CONTEXT_CONTAINER = "container";
    public static String MERGE_CONTEXT_COMPONENT = "component";
    public static String MERGE_CONTEXT_TEMPLATE = "template";
    public static String MERGE_CONTEXT_AD = "ad";
    public static String MERGE_CONTEXT_ARTICLE_ID = "articleId";
    public static String MERGE_CONTEXT_DIGIAL_SPECIAL_ID = "ditalSpecialId";
    public static String MERGE_CONTEXT_BODY = "body";
    public static String MERGE_CONTEXT_WORKER_ID = "workerId";
    public static String MERGE_CONTEXT_EDITION_SEQ = "editionSeq";

    /* Parameter & Component Paging */
    public static String PARAM_PAGE = Constants.PARAM_PAGE;
    public static String PARAM_COUNT = Constants.PARAM_COUNT;
    public static String PARAM_SORT = Constants.PARAM_SORT;
    public static String PARAM_START = "start";
    public static String PARAM_WORKER_ID = "creator";
    public static String PARAM_EDITION_SEQ = "editionSeq";
    public static String COMPONENT_PAGING_TYPE_NUMBER = "N";
    public static String COMPONENT_PAGING_TYPE_MORE = "M";

    /* TMS ERROR PAGE */
    public static String TMS_ERROR_PAGE = "/error";

    /* DPS Constants */
    public static String SAMPLE_PATH = "samples";


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
    public static SimpleDateFormat jsonDateFormat() {
        return new SimpleDateFormat(JSON_DATE_FORMAT);
    }

    // thread-safe한 date formatter
    public static DateTimeFormatter dtf = DateTimeFormatter.ofPattern(JSON_DATE_FORMAT)
                                                           .withZone(ZoneId.of(JSON_DATE_TIME_ZONE));

    public static String now() {
        LocalDateTime now = LocalDateTime.now();
        return now.format(dtf);
    }

    /* page service name regx */
    public static final String PAGE_SERVICE_NAME_PATTERN = "^[a-zA-Z0-9_\\-]*$";
    public static final String PAGE_SERVICE_URL_PATTERN = "^[a-zA-Z0-9_\\-\\/]*$";

    public static final String UNKNOWN = "UNKNOWN";
    public static final String SYSTEM_UNKNOWN = UNKNOWN;
    public static final String IP_UNKNOWN = UNKNOWN;
    public static final String USER_UNKNOWN = UNKNOWN;

    public static final String YES = McpString.YES;
    public static final String NO = McpString.NO;
}
