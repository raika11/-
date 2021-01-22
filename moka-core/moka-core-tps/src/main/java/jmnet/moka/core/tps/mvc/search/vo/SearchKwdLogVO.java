package jmnet.moka.core.tps.mvc.search.vo;

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

@Alias("SearchKwdLogVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class SearchKwdLogVO {

    /**
     * 등수
     */
    private Integer rank;

    /**
     * 영역 구분(날짜별, 영역별)
     */
    private String statDiv;

    /**
     * 키워드
     */
    private String schKwd;

    /**
     * 전체 검색 건수
     */
    private Long totalCnt;

    /**
     * 모바일 건수
     */
    private Long mobileCnt;

    /**
     * PC 건수
     */
    private Long pcCnt;
}
