package jmnet.moka.core.tps.mvc.menu.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS - 메뉴
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MenuDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<MenuDTO>>() {
    }.getType();

    private Long seq;

    /**
     * 대메뉴코드
     */
    private String parentMenuId;

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    private String menuId;

    private Integer depth;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 정렬순서
     */
    @Builder.Default
    private Integer menuOrder = 0;

    /**
     * 메뉴명
     */
    private String menuNm;

    /**
     * 메뉴 표시 명
     */
    private String menuDisplayNm;

    /**
     * 메뉴 페이지 URL
     */
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    private String iconNm;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId = "";


    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId = "";
}
