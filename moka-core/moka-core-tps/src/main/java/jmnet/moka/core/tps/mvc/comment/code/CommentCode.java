package jmnet.moka.core.tps.mvc.comment.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.EnumCode;
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
public final class CommentCode {
    public enum CommentBannedType implements EnumCode {
        I("I", "IP", "사용자 IP"),
        U("U", "사용자 ID", "사용자 ID"),
        W("W", "단어", "단어");

        private String code;
        private String name;
        private String fullname;

        CommentBannedType(String code, String name, String fullname) {
            this.code = code;
            this.name = name;
            this.fullname = fullname;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public String getFullname() {
            return fullname;
        }
    }


    public enum CommentStatusType implements EnumCode {
        A("A", "노출"),
        N("N", "관리자삭제"),
        D("D", "사용자삭제");

        private String code;
        private String name;

        CommentStatusType(String code, String name) {
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
                    .stream(CommentStatusType.values())
                    .map(code -> MapBuilder
                            .getInstance()
                            .add("code", code.code)
                            .add("name", code.name)
                            .getMap())
                    .collect(Collectors.toList());
        }
    }


    public enum CommentOrderType implements EnumCode {
        A("A", "최신순"),
        //B("B", "좋아요순"),
        //C("C", "싫어요순"),
        D("D", "신고순");

        private String code;
        private String name;

        CommentOrderType(String code, String name) {
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
                    .stream(CommentOrderType.values())
                    .map(code -> MapBuilder
                            .getInstance()
                            .add("code", code.code)
                            .add("name", code.name)
                            .getMap())
                    .collect(Collectors.toList());
        }
    }


    public enum CommentDeleteType implements EnumCode {
        CMT("DTCO", "이 댓글만 삭제"),
        ALL("UDC", "해당 사용자의 과거 댓글 전체 삭제"),
        BNC("BNC", "해당 사용자 ID 차단 및 해당 댓글 삭제"),
        BNA("BNA", "해당 사용자 ID 차단 및 과거 댓글 전체 삭제");

        private String code;
        private String name;


        CommentDeleteType(String code, String name) {
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
                    .stream(CommentOrderType.values())
                    .map(code -> MapBuilder
                            .getInstance()
                            .add("code", code.code)
                            .add("name", code.name)
                            .getMap())
                    .collect(Collectors.toList());
        }
    }
}

