package jmnet.moka.core.tps.mvc.member.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
@ApiModel("사용자 그룹 저장 DTO")
public class MemberGroupSaveDTO {

    /**
     * 그룹코드
     */
    @ApiModelProperty("그룹코드")
    @Pattern(regexp = "[G][0-9]{2}$", message = "{tps.group.error.pattern.groupCd}")
    private String groupCd;

    /**
     * 사용여부 Y : 예, N : 아니오
     */
    @ApiModelProperty("사용여부 Y : 예, N : 아니오")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = "Y";
}
