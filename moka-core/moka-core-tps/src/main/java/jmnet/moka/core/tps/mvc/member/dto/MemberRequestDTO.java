package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.code.MemberRequestCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : MemberDTO
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 16:08
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MemberRequestDTO extends MemberDTO {

    public static final Type TYPE = new TypeReference<List<MemberRequestDTO>>() {
    }.getType();

    /**
     * 사용자ID
     */
    @NotEmpty(message = "{tps.member.error.pattern.password}")
    @Pattern(regexp = "^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*$", message = "{tps.member.error.pattern.password}")
    private String password;

    /**
     * 비밀번호
     */
    @NotEmpty(message = "{tps.member.error.pattern.password}")
    @Pattern(regexp = "^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*$", message = "{tps.member.error.pattern.password}")
    private String confirmPassword;

    /**
     * SMS인증문자
     */
    @Size(min = 4, max = 6, message = "{tps.member.error.pattern.smsAuth}")
    private String smsAuth;

    /**
     * 요청사유
     */
    @NotEmpty(message = "{tps.member.error.notempty.requestReason}")
    private String requestReason;

    /**
     * 해제사유
     */
    private MemberRequestCode requestType;
}
