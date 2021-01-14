package jmnet.moka.core.tps.mvc.poll.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.vo
 * ClassName : TrendpollStat
 * Created : 2021-01-14 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-14 09:08
 */
@Alias("TrendpollCntVO")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(Include.NON_NULL)
public class TrendpollCntVO {

    private Integer voteCnt;

    private Integer pcVoteCnt;

    private Integer mobileVoteCnt;
}
