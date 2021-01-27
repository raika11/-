package jmnet.moka.core.tps.mvc.search.vo;

import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * 키워드 통계 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.search.vo
 * ClassName : SearchKwdLogVO
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 13:19
 */

@Alias("SearchKwdTotalLogVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class SearchKwdTotalLogVO {

    /**
     * 전체 검색 건수
     */
    @Builder.Default
    private Long totalCnt = 0l;

    /**
     * 모바일 건수
     */
    @Builder.Default
    private Long mobileCnt = 0l;

    /**
     * PC 건수
     */
    @Builder.Default
    private Long pcCnt = 0l;

    /**
     * 테블릿 건수
     */
    @Builder.Default
    private Long tabletCnt = 0l;

    /**
     * 최근 조회일
     */
    @DTODateTimeFormat
    private Date lastRegDt;
}
