/**
 * NSP MAS MPS FcmPriorityType.java 2018-03-14
 */
package jmnet.moka.web.push.support.code;

/**
 * <pre>
 * 우선순위 유형
 * Project : moka
 * Package : jmnet.moka.web.push.support.code
 * ClassName : FcmPriorityType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum FcmPriorityType implements EnumType {
    /**
     * 보통. iOS 5와 같음
     */
    NORMAL("normal"),
    /**
     * 높음 iOS 10과 같음
     */
    HIGH("high");

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
    private FcmPriorityType(final String value) {
        this.value = value;
    }

    /**
     * 우선순위 유형을 가져온다.
     *
     * @param value 값
     * @return 우선순위 유형
     */
    public static FcmPriorityType getType(final String value) {
        FcmPriorityType fcmPriorityType = null;

        for (FcmPriorityType type : FcmPriorityType.values()) {
            if (type.value.equals(value)) {
                fcmPriorityType = type;
                break;
            }
        }

        return fcmPriorityType;
    }
}
