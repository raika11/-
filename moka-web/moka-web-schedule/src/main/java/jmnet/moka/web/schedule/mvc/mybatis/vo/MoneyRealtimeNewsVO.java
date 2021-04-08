package jmnet.moka.web.schedule.mvc.mybatis.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * MoneyRealtimeNews 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.vo
 * ClassName : MoneyRealtimeNewsVO
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-31
 */

@Alias("MoneyRealtimeNewsVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class MoneyRealtimeNewsVO {

    private String totalId;

    private String serviceCode;

    private String sourceCode;

    private String artTitle;

    private String jiTitle;

    private String artSummary;

    private String artThumb;

    private String serviceDaytime;
}
