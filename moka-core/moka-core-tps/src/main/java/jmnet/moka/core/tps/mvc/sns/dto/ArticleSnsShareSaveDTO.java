package jmnet.moka.core.tps.mvc.sns.dto;

import java.io.Serializable;
import java.sql.Date;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.SnsTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * 기사 SNS메타
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ArticleSnsShareSaveDTO implements Serializable {

    /**
     * SNS 타입{FB:페이스북, TW:트위터}
     */
    @Builder.Default
    private SnsTypeCode snsType = SnsTypeCode.FB;

    /**
     * 사용여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * SNS 전송일시(업데이트시 수정됨)
     */
    @DateTimeFormat
    private Date snsInsDt;

    /**
     * SNS 등록일시
     */
    @DateTimeFormat
    private Date snsRegDt;

    /**
     * SNS 기사ID
     */
    private String snsArtId;

    /**
     * SNS 전송상태
     */
    @NotEmpty(message = "{tps.sns.error.notempty.snsArtSts}")
    private String snsArtSts;

    /**
     * 예약일시
     */
    @DateTimeFormat
    private Date reserveDt;

    /**
     * 포스트 메시지
     */
    private String snsPostMsg;

    /**
     * 이미지
     */
    private String imgUrl;

    /**
     * 기사제목
     */
    @NotEmpty(message = "{tps.sns.error.notempty.artTitle}")
    private String artTitle;

    /**
     * 메타데이터 추가 키워드
     */
    private String artKeyword;

    /**
     * 설명
     */
    private String artSummary;

}
