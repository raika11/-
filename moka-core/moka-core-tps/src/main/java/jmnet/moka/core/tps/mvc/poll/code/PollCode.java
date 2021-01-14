package jmnet.moka.core.tps.mvc.poll.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.data.mybatis.support.EnumCode;
import jmnet.moka.common.utils.MapBuilder;

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


    public enum PollStatCode implements EnumCode {
        A("A", "전체결과 - PIE차트 형태"),
        D("D", "Daily - Stack 히스토그램"),
        T("T", "Target Device - Stack 히스토그램");

        private String code;
        private String name;

        PollStatCode(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public static List<Map<String, Object>> toList() {

            return Arrays
                    .stream(PollStatCode.values())
                    .map(code -> MapBuilder
                            .getInstance()
                            .add("code", code.code)
                            .add("name", code.name)
                            .getMap())
                    .collect(Collectors.toList());
        }
    }
}

