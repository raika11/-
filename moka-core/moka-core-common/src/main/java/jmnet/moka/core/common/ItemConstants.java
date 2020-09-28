package jmnet.moka.core.common;

public class ItemConstants {

    // 아이템 수정시간은 공통으로 사용한다.
    public static final String ITEM_MODIFIED = "modified";

    /* Domain Info */
    public static final String DOMAIN_ID = "id";
    public static final String DOMAIN_NAME = "name";
    public static final String DOMAIN_URL = "url";
    public static final String DOMAIN_SERVICE_PLATFORM = "servicePlatform";
    public static final String DOMAIN_USE_YN = "useYn";
    public static final String DOMAIN_LANG = "lang";
    public static final String DOMAIN_API_HOST = "apiHost";
    public static final String DOMAIN_API_PATH = "apiPath";
    public static final String DOMAIN_DESCRIPTION = "desc";
    public static final String DOMAIN_CREATE_YMDT = "create";
    public static final String DOMAIN_CREATOR = "creator";
    public static final String DOMAIN_MODIFIED_YMDT = ITEM_MODIFIED;
    public static final String DOMAIN_MODIFIER = "modifier";

    /* Page Item */
    public static String PAGE_ID = "id";
    public static String PAGE_DOMAIN_ID = "domainId";
    public static String PAGE_NAME = "name";
    public static String PAGE_SERVICE_NAME = "serviceName";
    public static String PAGE_DISPLAY_NAME = "displayName";
    public static String PAGE_PARENT_ID = "parentId";
    public static String PAGE_TYPE = "type";
    public static String PAGE_URL = "url";
    public static String PAGE_ORDER = "order";
    public static String PAGE_BODY = "body";
    public static String PAGE_URL_PARAM = "urlParam";
    public static String PAGE_USE_YN = "useYn";
    public static String PAGE_FILE_YN = "fileYn";
    public static String PAGE_KEYWORD = "keyword";
    public static String PAGE_DESCRIPTION = "desc";
    public static String PAGE_MOVE_YN = "moveYn";
    public static String PAGE_MOVE_URL = "moveUrl";
    public static String PAGE_CREATE_YMDT = "create";
    public static String PAGE_CREATOR = "creator";
    public static String PAGE_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String PAGE_MODIFIER = "modifier";

    /* Container Item */
    public static String CONTAINER_ID = "id";
    public static String CONTAINER_DOMAIN_ID = "domainId";
    public static String CONTAINER_NAME = "name";
    public static String CONTAINER_BODY = "body";
    public static String CONTAINER_CREATE_YMDT = "create";
    public static String CONTAINER_CREATOR = "creator";
    public static String CONTAINER_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String CONTAINER_MODIFIER = "modifier";

    /* Component Item */
    public static String COMPONENT_ID = "id";
    public static String COMPONENT_DOMAIN_ID = "domainId";
    public static String COMPONENT_TEMPLATE_ID = "templateId";
    public static String COMPONENT_DATASET_ID = "datasetId";
    public static String COMPONENT_NAME = "name";
    public static String COMPONENT_PERIOD_YN = "periodYn";
    public static String COMPONENT_PERIOD_START_YMDT = "periodStart";
    public static String COMPONENT_PERIOD_END_YMDT = "periodEnd";
    public static String COMPONENT_DATA_TYPE = "dataType"; // 데이터유형:NONE, EDIT, AUTO
    public static String COMPONENT_DEL_WORDS = "delWords"; // 제목삭제단어-단어구분은 개행
    public static String COMPONENT_PAGING_YN = "pagingYn";
    public static String COMPONENT_PAGING_TYPE = "pagingType"; // 페이징유형:N:이전/다음, M:더보기
    public static String COMPONENT_PER_PAGE_COUNT = "perPageCount"; // 페이지당 건수
    public static String COMPONENT_MAX_PAGE_COUNT = "maxPageCount"; // 최대 페이지수
    public static String COMPONENT_DISP_PAGE_COUNT = "dispPageCount"; // 표출 페이지수
    public static String COMPONENT_MORE_COUNT = "moreCount"; // 더보기 건수
    public static String COMPONENT_SEARCH_SERVICE_TYPE = "searchServiceType"; // 검색서비스유형(기타코드)
    public static String COMPONENT_SEARCH_LANG = "searchLang"; // 검색언어(기타코드)
    public static String COMPONENT_SEARCH_CODE_ID = "searchCodeId"; // 검색코드ID
    public static String COMPONENT_SNAPSHOT_YN = "snapshotYn";
    public static String COMPONENT_SNAPSHOT_BODY = "snapshotBody";
    public static String COMPONENT_SKIN_ID = "skinId";
    public static String COMPONENT_PREVIEW_RESOURCE = "previewResource";
    public static String COMPONENT_CREATE_YMDT = "create";
    public static String COMPONENT_CREATOR = "ceator";
    public static String COMPONENT_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String COMPONENT_MODIFIER = "modifier";

    /* Component Item DATA_TYPE */
    public static String CP_DATA_TYPE_NONE = "NONE";
    public static String CP_DATA_TYPE_AUTO = "AUTO";
    public static String CP_DATA_TYPE_DESK = "DESK";
    public static String CP_DATA_TYPE_DESK_API = "desking";
    public static String CP_DATA_TYPE_DESK_WORK_API = "desking.work";
    public static String CP_DATA_TYPE_DESK_PARAM = "ids";

    /* Component Item DEL_WORDS default */
    public static String CP_DEL_WORDS_COLUMN = "newstitle";

    /** Component Ad In List */
    public static String COMPONENTAD_LIST = "componentAdList";

    /* Template Item */
    public static String TEMPLATE_ID = "id";
    public static String TEMPLATE_DOMAIN_ID = "domainId";
    public static String TEMPLATE_NAME = "name";
    public static String TEMPLATE_BODY = "body";
    public static String TEMPLATE_CROP_WIDTH = "cropWidth";
    public static String TEMPLATE_CROP_HEIGHT = "cropHeight";
    public static String TEMPLATE_GROUP = "group";
    public static String TEMPLATE_WIDTH = "width";
    public static String TEMPLATE_DESCRIPTION = "desc";
    public static String TEMPLATE_CREATE_YMDT = "create";
    public static String TEMPLATE_CREATOR = "creator";
    public static String TEMPLATE_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String TEMPLATE_MODIFIER = "modifier";

    /* DataSet Item */
    public static String DATASET_ID = "datasetId";
    public static String DATASET_NAME = "datasetName";
    public static String DATASET_API_PATH = "datasetApiPath";
    public static String DATASET_API_HOST = "datasetApiHost";
    public static String DATASET_API = "datasetApi";
    public static String DATASET_API_PARAM = "datasetApiParam";
    public static String DATASET_AUTO_CREATE_YN = "datasetAutoCreateYn";
    public static String DATASET_CREATE_YMDT = "datasetCreate";
    public static String DATASET_CREATOR = "datasetCreator";
    public static String DATASET_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String DATASET_MODIFIER = "datasetModifier";

    /* Ad Item */
    public static String AD_ID = "id";
    public static String AD_DOMAIN_ID = "domainId";
    public static String AD_NAME = "name";
    public static String AD_DEPT_NO = "deptNo";
    public static String AD_USE_TYPE = "useType";
    public static String AD_LOCATION = "location";
    public static String AD_PERIOD_YN = "periodYn";
    public static String AD_PERIOD_START_YMDT = "periodStart";
    public static String AD_PERIOD_END_YMDT = "periodEnd";
    public static String AD_USE_YN = "useYn";
    public static String AD_WIDTH = "width";
    public static String AD_HEIGHT = "height";
    public static String AD_DESCRIPTION = "desc";
    public static String AD_TYPE = "type";
    public static String AD_SLIDE_TYPE = "slideType";
    public static String AD_BODY = "body";
    public static String AD_FILENAME = "filename";
    public static String AD_CREATE_YMDT = "create";
    public static String AD_CREATOR = "creator";
    public static String AD_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String AD_MODIFIER = "modifier";

    /* Skin Item */
    public static String SKIN_ID = "id";
    public static String SKIN_DOMAIN_ID = "domainId";
    public static String SKIN_NAME = "name";
    public static String SKIN_SERVICE_NAME = "serviceName";
    public static String SKIN_SERVICE_TYPE = "serviceType";
    public static String SKIN_DEFAULT_YN = "defaultYn";
    public static String SKIN_BODY = "body";
    public static String SKIN_CREATE_YMDT = "create";
    public static String SKIN_CREATOR = "creator";
    public static String SKIN_MODIFIED_YMDT = ITEM_MODIFIED;
    public static String SKIN_MODIFIER = "modifier";


    public static class DpsItemConstants {
        /* Domain Info */
        public static String DOMAIN_ID = "DOMAIN_ID";
        public static String DOMAIN_NAME = "DOMAIN_NAME";
        public static String DOMAIN_URL = "DOMAIN_URL";
        public static String DOMAIN_SERVICE_PLATFORM = "SERVICE_PLATFORM";
        public static String DOMAIN_USE_YN = "USE_YN";
        public static String DOMAIN_LANG = "LANG";
        public static String DOMAIN_API_HOST = "API_HOST";
        public static String DOMAIN_API_PATH = "API_PATH";
        public static String DOMAIN_DESCRIPTION = "DESCRIPTION";
        public static String DOMAIN_CREATE_YMDT = "REG_DT";
        public static String DOMAIN_CREATOR = "REG_ID";
        public static String DOMAIN_MODIFIED_YMDT = "MOD_DT";
        public static String DOMAIN_MODIFIER = "MOD_ID";

        /* Domain Reserved(예약어) = TMS의 domain의 codeMap */
        public static final String RESERVED_SEQ = "RESERVED_SEQ";
        public static final String RESERVED_ID = "RESERVED_ID";
        public static final String RESERVED_VALUE = "RESERVED_VALUE";
        public static final String RESERVED_DESCRIPTION = "DESCRIPTION";
        public static final String RESERVED_USE_YN = "USE_YN";
        public static final String RESERVED_MODIFED_YMDT = "MOD_DT";

        /* Page Item */
        public static String PAGE_ID = "PAGE_SEQ";
        public static String PAGE_DOMAIN_ID = "DOMAIN_ID";
        public static String PAGE_NAME = "PAGE_NAME";
        public static String PAGE_SERVICE_NAME = "PAGE_SERVICE_NAME";
        public static String PAGE_DISPLAY_NAME = "PAGE_DISPLAY_NAME";
        public static String PAGE_PARENT_ID = "PARENT_PAGE_SEQ";
        public static String PAGE_TYPE = "PAGE_TYPE"; // 페이지유형 text/html, application/json,
                                                      // text/javascript, text/plain, text/xml
        public static String PAGE_URL = "PAGE_URL";
        public static String PAGE_ORDER = "PAGE_ORD";
        public static String PAGE_BODY = "PAGE_BODY";
        public static String PAGE_URL_PARAM = "URL_PARAM";
        public static String PAGE_USE_YN = "USE_YN";
        public static String PAGE_FILE_YN = "FILE_YN";
        public static String PAGE_KEYWORD = "KWD";
        public static String PAGE_DESCRIPTION = "DESCRIPTION";
        public static String PAGE_MOVE_YN = "MOVE_YN";
        public static String PAGE_MOVE_URL = "MOVE_URL";
        public static String PAGE_CREATE_YMDT = "REG_DT";
        public static String PAGE_CREATOR = "REG_ID";
        public static String PAGE_MODIFIED_YMDT = "MOD_DT";
        public static String PAGE_MODIFIER = "MOD_ID";

        /* Container Item */
        public static String CONTAINER_ID = "CONTAINER_SEQ";
        public static String CONTAINER_DOMAIN_ID = "DOMAIN_ID";
        public static String CONTAINER_NAME = "CONTAINER_NAME";
        public static String CONTAINER_BODY = "CONTAINER_BODY";
        public static String CONTAINER_CREATE_YMDT = "REG_DT";
        public static String CONTAINER_CREATOR = "REG_ID";
        public static String CONTAINER_MODIFIED_YMDT = "MOD_DT";
        public static String CONTAINER_MODIFIER = "MOD_ID";

        /* Component Item */
        public static String COMPONENT_ID = "COMPONENT_SEQ";
        public static String COMPONENT_DOMAIN_ID = "DOMAIN_ID";
        public static String COMPONENT_TEMPLATE_ID = "TEMPLATE_SEQ";
        public static String COMPONENT_DATASET_ID = "DATASET_SEQ";
        public static String COMPONENT_NAME = "COMPONENT_NAME";
        public static String COMPONENT_PERIOD_YN = "PERIOD_YN";
        public static String COMPONENT_PERIOD_START_YMDT = "PERIOD_START_DT";
        public static String COMPONENT_PERIOD_END_YMDT = "PERIOD_END_DT";
        public static String COMPONENT_DATA_TYPE = "DATA_TYPE"; // 데이터유형:NONE, EDIT, AUTO
        public static String COMPONENT_DEL_WORDS = "DEL_WORDS"; // 제목삭제단어-단어구분은 개행
        public static String COMPONENT_PAGING_YN = "PAGING_YN";
        public static String COMPONENT_PAGING_TYPE = "PAGING_TYPE"; // 페이징유형:N:이전/다음, M:더보기
        public static String COMPONENT_PER_PAGE_COUNT = "PER_PAGE_COUNT"; // 페이지당 건수
        public static String COMPONENT_MAX_PAGE_COUNT = "MAX_PAGE_COUNT"; // 최대 페이지수
        public static String COMPONENT_DISP_PAGE_COUNT = "DISP_PAGE_COUNT"; // 표출 페이지수
        public static String COMPONENT_MORE_COUNT = "MORE_COUNT"; // 더보기 건수
        public static String COMPONENT_SEARCH_SERVICE_TYPE = "SCH_SERVICE_TYPE"; // 검색서비스유형(기타코드)
        public static String COMPONENT_SEARCH_LANG = "SCH_LANGUAGE"; // 검색언어(기타코드)
        public static String COMPONENT_SEARCH_CODE_ID = "SCH_CODE_ID"; // 검색코드ID
        public static String COMPONENT_SNAPSHOT_YN = "SNAPSHOT_YN";
        public static String COMPONENT_SNAPSHOT_BODY = "SNAPSHOT_BODY";
        public static String COMPONENT_SKIN_ID = "SKIN_SEQ";
        public static String COMPONENT_PREVIEW_RESOURCE = "PREVIEW_RSRC";
        public static String COMPONENT_CREATE_YMDT = "REG_DT";
        public static String COMPONENT_CREATOR = "REG_ID";
        public static String COMPONENT_MODIFIED_YMDT = "MOD_DT";
        public static String COMPONENT_MODIFIER = "MOD_ID";

        public static String COMPONENTAD_COMPONENT_ID = "COMPONENT_SEQ";
        public static String COMPONENTAD_AD_ID = "AD_SEQ";
//        public static String COMPONENTAD_AD_NAME = "AD_NAME";
        public static String COMPONENTAD_LIST_PARAGRAPH = "LIST_PARAGRAPH";

        /* Template Item */
        public static String TEMPLATE_ID = "TEMPLATE_SEQ";
        public static String TEMPLATE_DOMAIN_ID = "DOMAIN_ID";
        public static String TEMPLATE_NAME = "TEMPLATE_NAME";
        public static String TEMPLATE_BODY = "TEMPLATE_BODY";
        public static String TEMPLATE_CROP_WIDTH = "CROP_WIDTH";
        public static String TEMPLATE_CROP_HEIGHT = "CROP_HEIGHT";
        public static String TEMPLATE_GROUP = "TEMPLATE_GROUP";
        public static String TEMPLATE_WIDTH = "TEMPLATE_WIDTH";
        public static String TEMPLATE_DESCRIPTION = "DESCRIPTION";
        public static String TEMPLATE_CREATE_YMDT = "REG_DT";
        public static String TEMPLATE_CREATOR = "REG_ID";
        public static String TEMPLATE_MODIFIED_YMDT = "MOD_DT";
        public static String TEMPLATE_MODIFIER = "MOD_ID";

        /* DataSet Item */
        public static String DATASET_ID = "DATASET_SEQ";
        public static String DATASET_NAME = "DATASET_NAME";
        public static String DATASET_API_PATH = "DATA_API_PATH";
        public static String DATASET_API_HOST = "DATA_API_HOST";
        public static String DATASET_API = "DATA_API";
        public static String DATASET_API_PARAM = "DATA_API_PARAM";
        public static String DATASET_AUTO_CREATE_YN = "AUTO_CREATE_YN";
        public static String DATASET_CREATE_YMDT = "REG_DT";
        public static String DATASET_CREATOR = "REG_ID";
        public static String DATASET_MODIFIED_YMDT = "MOD_DT";
        public static String DATASET_MODIFIER = "MOD_ID";

        /* Ad Item */
        public static String AD_ID = "AD_SEQ";
        public static String AD_DOMAIN_ID = "DOMAIN_ID";
        public static String AD_NAME = "AD_NAME";
        public static String AD_DEPT_NO = "AD_DEPT_NO";
        public static String AD_USE_TYPE = "AD_USE_TYPE";
        public static String AD_LOCATION = "AD_LOCATION";
        public static String AD_PERIOD_YN = "PERIOD_YN";
        public static String AD_PERIOD_START_YMDT = "PERIOD_START_DT";
        public static String AD_PERIOD_END_YMDT = "PERIOD_END_DT";
        public static String AD_USE_YN = "USE_YN";
        public static String AD_WIDTH = "AD_WIDTH";
        public static String AD_HEIGHT = "AD_HEIGHT";
        public static String AD_DESCRIPTION = "DESCRIPTION";
        public static String AD_TYPE = "AD_TYPE";
        public static String AD_SLIDE_TYPE = "SLIDE_TYPE";
        public static String AD_BODY = "AD_BODY";
        public static String AD_FILENAME = "AD_FILE_NAME";
        public static String AD_CREATE_YMDT = "REG_DT";
        public static String AD_CREATOR = "REG_ID";
        public static String AD_MODIFIED_YMDT = "MOD_DT";
        public static String AD_MODIFIER = "MOD_ID";

        /* Skin Item */
        public static String SKIN_ID = "SKIN_SEQ";
        public static String SKIN_DOMAIN_ID = "DOMAIN_ID";
        public static String SKIN_NAME = "SKIN_NAME";
        public static String SKIN_SERVICE_NAME = "SKIN_SERVICE_NAME";
        public static String SKIN_SERVICE_TYPE = "SERVICE_TYPE";
        public static String SKIN_DEFAULT_YN = "DEFAULT_YN";
        public static String SKIN_BODY = "SKIN_BODY";
        public static String SKIN_CREATE_YMDT = "REG_DT";
        public static String SKIN_CREATOR = "REG_ID";
        public static String SKIN_MODIFIED_YMDT = "MOD_DT";
        public static String SKIN_MODIFIER = "MOD_ID";

    }

}
