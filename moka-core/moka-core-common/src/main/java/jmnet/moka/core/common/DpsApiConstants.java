package jmnet.moka.core.common;

/**
 * <pre>
 * 소스상의 DPS API ID에 대한 공통 상수를 정의한다.
 * 2020. 1. 25. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 1. 25. 오후 4:16:07
 */
public class DpsApiConstants {

    /**
     * 커맨드 Prefix
     **/
    public static final String COMMAND_PREFIX = "/command";
    /**
     * 커맨드 API
     **/
    public static final String COMMAND_API = COMMAND_PREFIX + "/api";             // DPS API 목록
    public static final String COMMAND_API_PATH = COMMAND_PREFIX + "/apiPath";    // DPS API 경로 목록
    public static final String COMMAND_LOAD = COMMAND_PREFIX + "/load";           // API 재로딩
    public static final String COMMAND_PURGE = COMMAND_PREFIX + "/purge";         // API purge
    public static final String COMMAND_PURGE_STARTSWITH = COMMAND_PREFIX + "/purgeStartsWith"; // API purgeStartsWith

    /**
     * 기사 관련 API
     **/
    public static final String ARTICLE = "article";
    public static final String ARTICLE_SECTION_LIST = "article.section.list";

    /**
     * 편집(데스킹) API
     **/
    public static final String DESKING = "desking";
    public static final String DESKING_WORK = "desking.work";

    /** 메뉴 관련 API **/
    public static final String MENU_CATEGORY = "menu.category";
    public static final String MENU_CODES = "menu.codes";


    /** 디지털스페셜 관련 API **/
    public static final String DIGITAL_SPECIAL_LIST = "digitalSpecial.list";
}
