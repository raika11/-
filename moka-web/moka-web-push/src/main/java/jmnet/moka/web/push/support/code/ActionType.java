/**
 * NSP MAS MPS StatusFlagType.java 2018-05-08
 */
package jmnet.moka.web.push.support.code;

/**
 * <pre>
 * Action 유형
 * Project : moka
 * Package : jmnet.moka.web.push.support.code
 * ClassName : ActionType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum ActionType implements EnumType {
    /**
     * Command
     */
    C("C")
    /**
     * Scheduler
     */
    ,
    R("R");


    /**
     * 액션코드
     */
    private String code;

    /**
     * 생성자
     *
     * @param code 상태코드
     */
    private ActionType(final String code) {
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
     * 액션 유형 코드를 가져온다.
     *
     * @param code 코드
     * @return 메시지 전송상태 코드 enum
     */
    public static ActionType getType(final String code) {
        if (code == null || code.isEmpty()) {
            return null;
        } else {
            ActionType statusFlagType = null;

            for (ActionType type : ActionType.values()) {
                if (type.code.equals(code)) {
                    statusFlagType = type;
                    break;
                }
            }
            return statusFlagType;
        }
    }
}
