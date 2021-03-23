package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
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
@ApiModel("사용자 등록 DTO")
public class MemberSaveDTO extends MemberDTO {

    public static final Type TYPE = new TypeReference<List<MemberSaveDTO>>() {
    }.getType();

    /**
     * 비밀번호
     */
    @ApiModelProperty("비밀번호")
    @NotEmpty(message = "{tps.member.error.pattern.password}")
    @Pattern(regexp = "^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*)$", message = "{tps.member.error.pattern.password}")
    private String password;

}
