package jmnet.moka.web.schedule.mvc.mybatis.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * AllContentNews 목록 조회용 VO
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.mybatis.vo
 * ClassName : AllContentNewsVO
 * </pre>
 *
 * @author 김정민
 * @since 2021-03-29
 */

@Alias("AllContentNewsVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AllContentNewsVO {

    private String totalId;

    private String serviceDay;

    private String serviceTime;

    private String artTitle;

    private String artThumb;

    private String sourceCode;

    private String artReporter;

    private String artContent;

    private String noBulkImg;
}
