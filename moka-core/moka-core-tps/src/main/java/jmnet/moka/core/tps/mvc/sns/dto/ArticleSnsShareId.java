package jmnet.moka.core.tps.mvc.sns.dto;

import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.sns.dto
 * ClassName : ArticleSnsShareId
 * Created : 2020-12-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-04 15:09
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ArticleSnsShareId {

    /**
     * 서비스기사아이디
     */
    @ApiModelProperty("기사 ID")
    private Long totalId;

    /**
     * SNS 타입{FB:페이스북, TW:트위터}
     */
    @ApiModelProperty("SNS 타입{FB:페이스북, TW:트위터}")
    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;
}
