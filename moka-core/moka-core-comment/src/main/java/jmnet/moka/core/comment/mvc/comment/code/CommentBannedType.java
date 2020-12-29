package jmnet.moka.core.comment.mvc.comment.code;

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
public enum CommentBannedType {
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
