package jmnet.moka.core.tps.mvc.menu.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * 2020. 10. 15. ince 최초생성
 * </pre>
 *
 * @author ince
 * @since 2020. 10. 15. 오후 4:26:55
 */
@Alias("MenuVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MenuVO implements Serializable {


    public static final Type TYPE = new TypeReference<List<MenuVO>>() {
    }.getType();

    /**
     * 대메뉴코드
     */
    @Column(name = "PARENT_MENU_ID", nullable = false)
    private String parentMenuId;

    /**
     * 메뉴코드 (GRP_CD+MID_CD+DTL_CD)
     */
    @Column(name = "MENU_ID", nullable = false)
    private String menuId;

    @Column(name = "DEPTH", nullable = false)
    private Integer depth;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 정렬순서
     */
    @Column(name = "ORD_NO")
    @Builder.Default
    private Integer menuOrder = 0;

    /**
     * 메뉴명
     */
    @Column(name = "MENU_NM", nullable = false)
    private String menuNm;

    /**
     * 메뉴 표시 명
     */
    @Column(name = "MENU_DISP_NM", nullable = false)
    private String menuDisplayNm;

    /**
     * 메뉴 페이지 URL
     */
    @Column(name = "MENU_URL")
    @Builder.Default
    private String menuUrl = "";

    /**
     * 아이콘 명
     */
    @Column(name = "ICON_NM", nullable = false)
    private String iconNm;
}
