package jmnet.moka.core.tps.common.code;

/**
 * 사용자 계정 요청 유형 코드
 */
public enum MemberRequestCode {
    UNLOCK_REQUEST("UNLOCK_REQUEST", "잠금해제 요청", MemberStatusCode.R, "wms.login.success.unlock-request"),
    UNLOCK_SMS("UNLOCK_SMS", "잠금해제 인증문자", MemberStatusCode.Y, "wms.login.success.unlock"),
    NEW_REQUEST("NEW_REQUEST", "신규요청", MemberStatusCode.I, "wms.login.info.use-request-sms-sand"),
    NEW_SMS("NEW_SMS", "신규 인증문자", MemberStatusCode.N, "wms.login.success.use-request");

    private String code;
    private String name;
    private MemberStatusCode nextStatus;
    private String messageKey;

    MemberRequestCode(String code, String name, MemberStatusCode status, String messageKey) {
        this.code = code;
        this.name = name;
        this.nextStatus = status;
        this.messageKey = messageKey;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public MemberStatusCode getNextStatus() {
        return nextStatus;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public static String getRegexp() {
        return "[Y|N]{1}$";
    }
}
