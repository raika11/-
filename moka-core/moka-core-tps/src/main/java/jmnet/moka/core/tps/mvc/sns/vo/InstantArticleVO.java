package jmnet.moka.core.tps.mvc.sns.vo;

import java.io.Serializable;
import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * Instance Article
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.sns.vo
 * ClassName : InstanceArticleVO
 * Created : 2021-04-09
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-09 오전 11:29
 */
@Alias("InstantArticleVO")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class InstantArticleVO implements Serializable {

    /**
     * 기사ID
     */
    private Long totalId;

    /**
     * 출처
     */
    private String sourceCode;

    /**
     * iud
     */
    private String iud;

    /**
     * 전송일시
     */
    @DTODateTimeFormat
    private Date sendDt;

    /**
     * 호출 메세지
     */
    private String callbackMsg;

    /**
     * 페이스북 상태 ID
     */
    private String fbStatusId;

    /**
     * 페이스북 기사 ID
     */
    private String fbArtId;

    /**
     * 입력일시
     */
    @DTODateTimeFormat
    private Date insDt;
}
