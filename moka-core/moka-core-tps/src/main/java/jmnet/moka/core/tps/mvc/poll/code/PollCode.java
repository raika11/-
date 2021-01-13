package jmnet.moka.core.tps.mvc.poll.code;

import jmnet.moka.common.data.mybatis.support.EnumCode;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.comment.mvc.comment.code
 * ClassName : CommentBannedType
 * Created : 2020-12-29 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-29 16:01
 */
public final class PollCode {
    public enum PollDivCode implements EnumCode {
        W("W", "일반형"),
        V("V", "비교형");

        private String code;
        private String name;

        PollDivCode(String code, String name) {
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


    public enum PollTypeCode implements EnumCode {
        T("T", "TEXT"),
        M("M", "IMAGE + TEXT"),
        P("P", "IMAGE");

        private String code;
        private String name;

        PollTypeCode(String code, String name) {
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


    public enum PollStatusCode implements EnumCode {
        S("S", "서비스"),
        D("D", "삭제"),
        T("T", "일시중지");

        private String code;
        private String name;

        PollStatusCode(String code, String name) {
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


    public enum PollRelateTypeCode implements EnumCode {
        A("A", "기사"),
        P("P", "투표");

        private String code;
        private String name;

        PollRelateTypeCode(String code, String name) {
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

