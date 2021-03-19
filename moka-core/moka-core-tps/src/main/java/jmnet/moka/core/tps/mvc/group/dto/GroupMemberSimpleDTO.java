package jmnet.moka.core.tps.mvc.group.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.dto
 * ClassName : GroupSimpleDTO
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
@ApiModel("그룹 DTO")
public class GroupMemberSimpleDTO {

    /**
     * 그룹코드 (G01, G02형식)
     */
    @ApiModelProperty(value = "그룹코드 (G01, G02형식)", hidden = true)
    private String groupCd;

    /**
     * 그룹명
     */
    @ApiModelProperty(value = "그룹명", hidden = true)
    private GroupSimpleDTO group;
}
