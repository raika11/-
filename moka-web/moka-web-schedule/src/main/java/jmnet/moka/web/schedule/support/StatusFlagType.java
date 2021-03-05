package jmnet.moka.web.schedule.support;

/**
 * <pre>
 * 예약 작업 상태 코드
 * Project : moka
 * Package : jmnet.moka.web.schedule.support.code
 * ClassName : StatusFlagType
 * Created : 2021-02-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-09 17:32
 */
public enum StatusFlagType {
    READY("0", "준비"),
    DONE("1", "전송완료"),
    ERROR_SERVER("2", "서버오류"),
    DELETE_TASK("3", "삭제 된 테스크"),
    FAILED_TASK("4", "실행결과 실패"),
    PROCESSING("9", "진행 중");

    // 상태코드
    private final String code;
    // 상태코드 명
    private final String codeName;

    /**
     * 생성자
     *
     * @param code 상태코드
     */
    StatusFlagType(final String code, final String codeName) {
        this.code = code;
        this.codeName = codeName;
    }

    public String getCode() {
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
