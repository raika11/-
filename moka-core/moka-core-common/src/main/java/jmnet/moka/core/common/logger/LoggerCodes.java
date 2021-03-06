package jmnet.moka.core.common.logger;

/**
 * <pre>
 *
 * 액션 로그 관련 Enum
 *
 * 2020. 9. 28. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2020. 9. 28. 오후 1:14:45
 */
public final class LoggerCodes {

    /**
     * 액션 유형
     */
    public enum ActionType {

        STARTUP("STARTUP", "시작"),
        SHUTDOWN("SHUTDOWN", "종료"),
        LOGIN("LOGIN", "로그인"),
        LOGOUT("LOGOUT", "로그아웃"),
        INSERT("INSERT", "입력"),
        UPDATE("UPDATE", "변경"),
        DELETE("DELETE", "삭제"),
        SELECT("SELECT", "조회"),
        DOWNLOAD("DOWNLOAD", "다운로드"),
        UPLOAD("UPLOAD", "업로드"),
        FILE_DELETE("FILE_DELETE", "파일 삭제"),
        FILE_COPY("FILE_COPY", "파일 복사"),
        FILE_MOVE("FILE_MOVE", "파일 이동"),
        FILE_OVERWRITE("FILE_OVERWRITE", "파일 덮어쓰기"),
        API("API","DPS API"),
        PAGE("PAGE","TMS PAGE"),
        ARTICLE("ARTICLE","TMS ARTICLE"),
        AMP_ARTICLE("AMP_ARTICLE","TMS AMP ARTICLE"),
        DIGITAL_SPECIAL("DIGITAL_SPECIAL","TMS DIGITAL SPECIAL"),
        UNKNOWN("UNKNOWN", "알수없음");

        private String code;
        private String description;

        ActionType(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public final String code() {
            return code;
        }

        public final String description() {
            return description;
        }

        public static ActionType get(String code) {
            if (code == null) {
                return null;
            }
            for (ActionType t : ActionType.values()) {
                if (t.code.equals(code)) {
                    return t;
                }
            }
            return null;
        }

    }


    /**
     * 액션 결과
     */
    public enum ActionResult {

        SUCCESS("SUCCESS", "성공"),
        FAIL("FAIL", "실패"),
        ERROR("ERROR", "오류"),
        SKIP("SKIP", "스킵");

        private String code;
        private String description;

        ActionResult(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public final String code() {
            return code;
        }

        public final String description() {
            return description;
        }

        public static ActionResult get(String code) {
            if (code == null) {
                return null;
            }
            for (ActionResult t : ActionResult.values()) {
                if (t.code.equals(code)) {
                    return t;
                }
            }
            return null;
        }

    }

}
