package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
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
@ApiModel("메뉴 검색 DTO")
public class MenuSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    @ApiModelProperty("사용자ID")
    private String memberId;

    @ApiModelProperty("그룹코드/사용자ID")
    private String grpMemId;

    @ApiModelProperty("그룹사용자 구분")
    private String grpMemDiv;

    @ApiModelProperty("메뉴 ID")
    private String menuId;

    @ApiModelProperty("메뉴 명")
    private String menuNm;

    @ApiModelProperty("상위 메뉴 ID")
    @Builder.Default
    private String parentMenuId = MenuService.ROOT_MENU_ID;

    // 정렬 기본값을 설정
    public MenuSearchDTO() {
        super(MenuVO.class, "menuOrder,asc,menuId,asc");
        useTotal = MokaConstants.NO;
    }
}
