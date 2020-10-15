package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.common.data.support.SearchDTO;
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
public class MenuSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7741459044517702553L;

    private String searchType;

    private String keyword;

    private String memberId;

    // 정렬 기본값을 설정
    public MenuSearchDTO() {
        super(MenuVO.class, "menuId,asc,menuOrder,asc");
    }
}
