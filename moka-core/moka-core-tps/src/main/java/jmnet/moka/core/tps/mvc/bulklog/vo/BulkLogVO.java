package jmnet.moka.core.tps.mvc.bulklog.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * 벌크 현황 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bulklog.vo
 * ClassName : BulkLogVO
 * Created : 2021-01-22 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-22 13:19
 */

@Alias("BulkLogVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class BulkLogVO {

    /**
     * 콘텐트구분
     */
    private String contentDiv;

    /**
     * 상태
     */
    private String status;

    /**
     * 전체 검색 건수
     */
    @Builder.Default
    private Long totalCnt = 0l;

    /**
     * Loader 건수
     */
    @Builder.Default
    private Long loaderCnt = 0l;

    /**
     * Dump 건수
     */
    @Builder.Default
    private Long dumpCnt = 0l;

    /**
     * Sender 건수
     */
    @Builder.Default
    private Long senderCnt = 0l;

    /**
     * naver Sender 건수
     */
    @Builder.Default
    private Long naverSenderCnt = 0l;

    /**
     * empas Sender 건수
     */
    @Builder.Default
    private Long empasSenderCnt = 0l;

    /**
     * estsoft Sender 건수
     */
    @Builder.Default
    private Long estsoftSenderCnt = 0l;

    /**
     * remark Sender 건수
     */
    @Builder.Default
    private Long remarkSenderCnt = 0l;
}
