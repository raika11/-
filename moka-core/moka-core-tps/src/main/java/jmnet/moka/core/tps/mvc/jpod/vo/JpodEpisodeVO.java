package jmnet.moka.core.tps.mvc.jpod.vo;

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
 * Package : jmnet.moka.core.tps.mvc.jpod.vo
 * ClassName : JpodEpisodeVO
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:37
 */
@Alias("JpodEpisodeVO")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class JpodEpisodeVO {

    /**
     * 에피소드일련번호
     */
    private Long epsdSeq;

    /**
     * 채널일련번호
     */
    private Long chnlSeq;

    /**
     * 시즌 번호
     */
    private Integer seasonNo;
}
