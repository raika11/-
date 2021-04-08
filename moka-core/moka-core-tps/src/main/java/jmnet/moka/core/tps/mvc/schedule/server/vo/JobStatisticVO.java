package jmnet.moka.core.tps.mvc.schedule.server.vo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * 배포서버 별 작업 통계 조회용 VO
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.schedult.server.vo
 * ClassName : JobStatisticVO
 * </pre>
 *
 * @author ince
 * @since 2021-02-03
 */

@Alias("JobStatisticVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class JobStatisticVO {

    private Integer serverSeq;

    private String serverNm;

    private Integer a0;

    private Integer b0;

    private Integer a30;

    private Integer b30;

    private Integer a60;

    private Integer b60;

    private Integer a120;

    private Integer b120;

    private Integer a300;

    private Integer b300;

    private Integer a600;

    private Integer b600;

    private Integer a1200;

    private Integer b1200;

    private Integer a1800;

    private Integer b1800;

    private Integer a3600;

    private Integer b3600;

    private Integer a43200;

    private Integer b43200;

    private Integer a86400;

    private Integer b86400;

}
