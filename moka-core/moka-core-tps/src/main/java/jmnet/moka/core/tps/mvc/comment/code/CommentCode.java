package jmnet.moka.core.tps.mvc.comment.code;

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
public final class CommentCode {
    public enum CommentBannedType implements EnumCode {
        I("I", "아이피"),
        U("U", "사용자"),
        W("W", "단어");

        private String code;
        private String name;

        CommentBannedType(String code, String name) {
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
    }


    public enum CommentOrderType implements EnumCode {
        A("A", "최신순"),
        B("B", "좋아요순"),
        C("C", "싫어요순"),
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
    }
}

