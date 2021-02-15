/**
 * NSP MAS MPS FcmPriorityType.java 2018-03-14
 */
package jmnet.moka.web.push.support.code;

/**
 * <pre>
 * 푸시 전송 유형
 * Project : moka
 * Package : jmnet.moka.web.push.support.code
 * ClassName : PushSendType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum PushSendType implements EnumType {
    /**
     * 한건씩 전송
     */
    SINGLE("SINGLE"),
    /**
     * 여러건을 한번에 전송
     */
    MULTI("MULTI");

    /**
     * 값
     */
    private final String value;

    /* (non-Javadoc)
     * @see com.yna.nsp.mps.type.EnumType#getValue()
     */
    @Override
    public String getValue() {
        return value;
    }

    /**
     * 생성자
     *
     * @param value 값
     */
    private PushSendType(final String value) {
        this.value = value;
    }

    /**
     * 우선순위 유형을 가져온다.
     *
     * @param value 값
     * @return 우선순위 유형
     */
    public static PushSendType getType(final String value) {
        PushSendType fcmPriorityType = null;

        for (PushSendType type : PushSendType.values()) {
            if (type.value.equals(value)) {
                fcmPriorityType = type;
                break;
            }
        }

        return fcmPriorityType;
    }
}
