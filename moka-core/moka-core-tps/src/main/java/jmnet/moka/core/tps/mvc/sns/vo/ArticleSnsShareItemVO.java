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

    /**
     * 기사ID
     */
    private Long totalId;

    /**
     * 입력일시
     */
    @DTODateTimeFormat
    private Date insDt;

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
    private String callMsg;

    /**
     * 페이스북 상태 ID
     */
    private String fbStatusId;

    /**
     * 페이스북 기사 ID
     */
    private String fbArticleId;

    /**
     * 소스 코드
     */
    private String sourceCode;

    /**
     * 소스 명
     */
    private String sourceName;

    /**
     * 서비스 일시
     */
    @DTODateTimeFormat
    private Date serviceDt;

    /**
     * 기사 제목
     */
    private String artTitle;

    /**
     * 기사 썸네일
     */
    private String artThumb;

    /**
     * 전송 SNS 유형
     */
    private String sendSnsType;

    /**
     * 페이스북 전송 SNS Article ID
     */
    private String fbSendSnsArtId;

    /**
     * 페이스북 전송 SNS 상태
     */
    private String fbSendSnsArtSts;

    /**
     * 트위터 전송 SNS Article ID
     */
    private String twSendSnsArtId;

    /**
     * 트위터 전송 SNS 상태
     */
    private String twSendSnsArtSts;

    /**
     * 페이스북 제목
     */
    private String fbMetaTitle;

    /**
     * 페이스북 이미지
     */
    private String fbMetaImage;

    /**
     * 페이스북 예약 전송 일시
     */
    @DTODateTimeFormat
    private Date fbReserveDt;

}
