/**
 * NSP MAS MPS StatusFlagType.java 2018-05-08
 */
package jmnet.moka.web.push.support.code;

/**
 * <pre>
 * 메시지 전송상태 코드
 * Project : moka
 * Package : jmnet.moka.web.push.support.code
 * ClassName : PushSendType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum StatusFlagType implements EnumType {
    /**
     * 준비
     */
    READY("0")
    /**
     * 전송완료
     */
    ,
    DONE("1")
    /**
     * 서버오류
     */
    ,
    ERROR_SERVER("2")
    /**
     * 토큰관련 오류
     */
    ,
    ERROR_TOKEN("3")
    /**
     * 전송 오류
     */
    ,
    ERROR_SENDING("4")
    /**
     * Time Over
     */
    ,
    TIME_OVER("5")
    /**
     * 진행 중
     */
    ,
    SENDING("9");

    /**
     * 상태코드
     */
    private String code;

    /**
     * 생성자
     *
     * @param code 상태코드
     */
    private StatusFlagType(final String code) {
        this.code = code;
    }

    /* (non-Javadoc)
     * @see com.yna.nsp.mas.mps.type.EnumType#getValue()
     */
    @Override
    public String getValue() {
        return code;
    }

    /**
     * 메시지 전송상태 코드를 가져온다.
     *
     * @param code 코드
     * @return 메시지 전송상태 코드 enum
     */
    public static StatusFlagType getType(final String code) {
        if (code == null || code.isEmpty()) {
            return null;
        } else {
            StatusFlagType statusFlagType = null;

            for (StatusFlagType type : StatusFlagType.values()) {
                if (type.code.equals(code)) {
                    statusFlagType = type;
                    break;
                }
            }
            return statusFlagType;
        }
    }
}
