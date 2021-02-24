package jmnet.moka.core.tps.mvc.jpod.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class PodtyResultVO<T> {

    /**
     * 토큰
     */
    private List<T> list;

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

    /**
     * 상세 정보
     */
    private Map<String, Object> info;

    /**
     * 페이징 정보
     */
    private Map<String, Object> pager;

    /**
     * 환경
     */
    private String env;
}
