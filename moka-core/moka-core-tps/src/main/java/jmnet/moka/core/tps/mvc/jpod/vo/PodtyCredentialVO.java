package jmnet.moka.core.tps.mvc.jpod.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.vo
 * ClassName : PodtyChannelVO
 * Created : 2021-01-09 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-09 17:37
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PodtyCredentialVO {

    /**
     * 토큰
     */
    private String result;

    /**
     * 코드
     */
    private String code;

    /**
     * 메세지
     */
    private String msg;

    /**
     * 상세 메세지
     */
    private String detail;
}
