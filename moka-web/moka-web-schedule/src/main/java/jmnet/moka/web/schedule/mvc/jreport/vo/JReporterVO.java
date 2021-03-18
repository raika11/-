package jmnet.moka.web.schedule.mvc.jreport.vo;

import lombok.*;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * JReport 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.jreport.vo
 * ClassName : JobStatisticVO
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-18
 */

@Alias("JReportVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class JReporterVO {

    private Integer repSeq;

    private String usedYn;

    private String repName;

    private String repEmail1;

    private String repEmail2;

    private String joinsId;

    private String jnetId;

    private String repViewImg;

    private String jplusCd;

    private String r4CdNm;
}
