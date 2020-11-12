package jmnet.moka.core.tps.mvc.menu.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.core.common.MokaConstants;
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

    private Long seqNo;

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
     * 조회권한여부
     */
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    /**
     * 편집권한여부
     */
    @Builder.Default
    private String editYn = MokaConstants.NO;
}
