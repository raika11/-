package jmnet.moka.web.schedule.support;


/**
 * <pre>
 * 작업실행 상태 코드
 * Project : moka
 * Package : jmnet.moka.web.schedule.support
 * ClassName : StatusResultType
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-23
 */
public enum StatusResultType {
    SUCCESS(200L, "실행 성공"),
    FAILED(500L, "작업 실행 실패"),
    BEFORE_EXECUTE(500L, "작업이 실행되지 않았습니다."),
    FAILED_JOB(500L, "작업 실행 중 실패");

    // 상태코드
    private final Long code;
    // 상태코드 명
    private final String codeName;

    /**
     * 생성자
     *
     * @param code 상태코드
     */
    StatusResultType(final Long code, final String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public Long getCode() {
        return code;
    }

    public String getName() {
        return codeName;
    }

    /**
     * 메시지 전송상태 코드를 가져온다.
     *
     * @param code 코드
     * @return 메시지 전송상태 코드 enum
     */
    public static StatusResultType getType(final Long code) {
        if (code == null) {
            return null;
        } else {
            StatusResultType statusResultType = null;

            for (StatusResultType type : StatusResultType.values()) {
                if (type.code.equals(code)) {
                    statusResultType = type;
                    break;
                }
            }
            return statusResultType;
        }
    }
}
