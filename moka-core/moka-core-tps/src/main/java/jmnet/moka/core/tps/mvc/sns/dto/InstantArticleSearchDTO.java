package jmnet.moka.core.tps.mvc.sns.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 인트턴트 아티클 검색 DTO
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.sns.dto
 * ClassName : InstantArticleSearchDTO
 * Created : 2021-04-09
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-09 오전 10:37
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ApiModel("인트턴트 아티클 검색 DTO")
public class InstantArticleSearchDTO extends SearchDTO {
    /**
     * 출처
     */
    @ApiModelProperty("출처 \"1,2,3\"")
    String sourceCode;

    /**
     * 대기상태
     */
    @ApiModelProperty("보낼 리스트 : S, 보낸거 체크 리스트 : C ")
    String listType;

    @ApiModelProperty("조회개수")
    Long count;
}
