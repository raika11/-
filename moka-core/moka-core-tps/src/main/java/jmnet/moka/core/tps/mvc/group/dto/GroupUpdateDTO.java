package jmnet.moka.core.tps.mvc.group.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 그룹 수정 DTO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : GroupDTO
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 16:07
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("그룹 수정 DTO")
public class GroupUpdateDTO {
    /**
     * 그룹명
     */
    @ApiModelProperty("그룹명")
    @NotEmpty(message = "{tps.group.error.notempty.groupNm}")
    @Size(min = 1, max = 20, message = "{tps.group.error.length.groupNm}")
    private String groupNm;

    /**
     * 그룹 한글명
     */
    @ApiModelProperty("그룹 한글명")
    @NotEmpty(message = "{tps.group.error.notempty.groupKorNm}")
    @Size(min = 1, max = 20, message = "{tps.group.error.length.groupKorNm}")
    private String groupKorNm;

}
