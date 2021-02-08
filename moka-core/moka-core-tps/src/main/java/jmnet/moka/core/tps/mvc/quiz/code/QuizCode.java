package jmnet.moka.core.tps.mvc.quiz.code;

import jmnet.moka.common.utils.EnumCode;

/**
 * <pre>
 * 퀴즈관리용 코드 모음
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.quiz.code
 * ClassName : QuizCode
 * Created : 2021-01-18 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-18 11:51
 */
public final class QuizCode {

    /**
     * 퀴즈 Type
     */
    public enum QuizTypeCode implements EnumCode {
        AA("AA", "전체노출전체정답"),
        AS("AS", "전체노출퀴즈별정답"),
        SA("SA", "1건노출전체정답"),
        SS("SS", "1건노출퀴즈별정답");

        private String code;
        private String name;

        QuizTypeCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }


    /**
     * 퀴즈 상태 코드
     */
    public enum QuizStatusCode implements EnumCode {
        P("P", "일시중지"),
        Y("Y", "서비스"),
        N("N", "종료");

        private String code;
        private String name;

        QuizStatusCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }


    /**
     * 관련 컨텐츠 유형
     */
    public enum QuizRelationTypeCode implements EnumCode {
        A("A", "기사"),
        Q("Q", "퀴즈");

        private String code;
        private String name;

        QuizRelationTypeCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }


    /**
     * 질문 유형
     */
    public enum QuizQuestionTypeCode implements EnumCode {
        O("O", "객관식"),
        S("S", "주관식");

        private String code;
        private String name;

        QuizQuestionTypeCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }
}
