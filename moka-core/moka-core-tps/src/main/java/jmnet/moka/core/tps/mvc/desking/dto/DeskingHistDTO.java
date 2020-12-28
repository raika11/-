package jmnet.moka.core.tps.mvc.desking.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 데스킹 히스토리 DTO
 *
 * @author jeon0525
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeskingHistDTO implements Serializable {

    private static final long serialVersionUID = -5657517107362421109L;

    public static final Type TYPE = new TypeReference<List<DeskingHistDTO>>() {
    }.getType();

    /**
     * 히스토리일련번호
     */
    private Long histSeq;

    /**
     * 화면편집SEQ
     */
    private Long deskingSeq;

    /**
     * 데이터셋SEQ
     */
    private Long datasetSeq;

    /**
     * 컴포넌트 히스토리 SEQ
     */
    private Long componentHistSeq;

    /**
     * 서비스기사아이디
     */
    private String contentId;

    /**
     * 부모 서비스기사아이디
     */
    private String parentContentId;

    /**
     * 콘텐트순서
     */
    @Column(name = "CONTENT_ORD")
    @Builder.Default
    private Integer contentOrd = 1;

    /**
     * 관련순서
     */
    @Builder.Default
    private Integer relOrd = 1;

    /**
     * 배부일시
     */
    @DTODateTimeFormat
    private Date distDt;

    /**
     * 제목
     */
    private String title;

    /**
     * 화면편집생성일시 : wms_desking.deskingDt == wms_desking_hist.deskingDt(편집시간)
     */
    @DTODateTimeFormat
    private Date deskingDt;

    /**
     * 생성자
     */
    private String regId;

    /**
     * 생성일시: 편집히스토리에 등록된 시간(전송시간) wms_desking.regDt == wms_desking_hist.regDt
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    private String status = EditStatusCode.SAVE.getCode();

    /**
     * 예약일시
     */
    @DTODateTimeFormat
    private Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Builder.Default
    private String approvalYn = MokaConstants.NO;
}
