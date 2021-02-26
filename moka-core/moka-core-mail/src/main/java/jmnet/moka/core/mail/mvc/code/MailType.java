package jmnet.moka.core.mail.mvc.code;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.mail.mvc.mail.code
 * ClassName : CommentBannedType
 * Created : 2020-12-29 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-29 16:01
 */
public enum MailType {
    SMTP("SMTP", "SMTP"),
    EMS("EMS", "EMS");

    private String code;
    private String name;

    MailType(String code, String name) {
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
