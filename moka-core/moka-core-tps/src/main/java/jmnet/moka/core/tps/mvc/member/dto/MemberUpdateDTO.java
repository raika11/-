package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
public class MemberUpdateDTO {

    /**
     * 상태(유효/정지)
     */
    @Builder.Default
    @Pattern(regexp = "[N|Y|P|R|D]{1}$", message = "{tps.member.error.pattern.status}")
    private MemberStatusCode status = MemberStatusCode.D;

    /**
     * 계정만료일
     */
    @DTODateTimeFormat
    private Date expireDt;

    /**
     * 비고
     */
    @Builder.Default
    private String remark = "";

}
