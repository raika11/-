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
 * 기사 SNS메타
 */
@Alias("ArticleSnsShareItemVO")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ArticleSnsShareItemVO implements Serializable {

    private Long totalId;

    @DTODateTimeFormat
    private Date insDt;

    private String iud;

    @DTODateTimeFormat
    private Date sendDt;

    private String callMsg;

    private String fbStatusId;

    private String fbArticleId;

    private String sourceCode;

    @DTODateTimeFormat
    private Date serviceDt;

    private String sendSnsType;

    private String fbSendSnsArtId;

    private String fbSendSnsArtSts;

    private String twSendSnsArtId;

    private String twSendSnsArtSts;

}
