package jmnet.moka.core.common;

/**
 * <pre>
 * 소스상의 TMS API ID에 대한 공통 상수를 정의한다.
 * 2020. 1. 25. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 1. 25. 오후 4:16:07
 */
public class TmsApiConstants {

    /**
     * 커맨드 Prefix
     **/
    public static final String COMMAND_PREFIX = "/command";

    /**
     * 커맨드 API
     **/
    public static final String COMMAND_BULK_PURGE = COMMAND_PREFIX + "/bulkPurge";
    public static final String COMMAND_PURGE = COMMAND_PREFIX + "/purge";
    public static final String COMMAND_RESERVED_UPDATE = COMMAND_PREFIX + "/reservedUpdate";
    public static final String COMMAND_CDN_UPDATE = COMMAND_PREFIX + "/cdnUpdate";
    public static final String COMMAND_PAGE_UPDATE = COMMAND_PREFIX + "/pageUpdate";
    public static final String COMMAND_COMMAND_LIST = COMMAND_PREFIX + "/commandList";
    public static final String COMMAND_DOMAIN = COMMAND_PREFIX + "/domain";
    public static final String COMMAND_HEALTH = COMMAND_PREFIX + "/health";
    public static final String COMMAND_LOG_LEVEL = COMMAND_PREFIX + "/logLevel";
    public static final String COMMAND_URI = COMMAND_PREFIX + "/uri";

}
