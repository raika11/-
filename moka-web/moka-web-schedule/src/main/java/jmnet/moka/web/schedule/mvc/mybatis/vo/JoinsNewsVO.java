package jmnet.moka.web.schedule.mvc.mybatis.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * JoinsNews 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.vo
 * ClassName : JoinsNewsVO
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-19
 */

@Alias("JoinsNewsVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class JoinsNewsVO {

    private String totalId;

    private String articleTitle;

    private String articleSummary;

    private String articleReporter;

    private String serviceDay;

    private String serviceTime;

}
