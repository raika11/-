package jmnet.moka.core.tps.mvc.group.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.menu.vo.MenuVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@ApiModel("그룹 검색 DTO")
public class GroupSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    private String searchType;

    private String keyword;

    private String groupCd;

    private String groupNm;

    /**
     * 총갯수 사용여부
     */
    @Builder.Default
    private String useTotal = MokaConstants.YES;

    // 정렬 기본값을 설정
    public GroupSearchDTO() {
        super(MenuVO.class, null);
    }
}
