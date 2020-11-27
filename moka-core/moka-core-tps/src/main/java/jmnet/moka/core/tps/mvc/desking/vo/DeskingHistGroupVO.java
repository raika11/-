package jmnet.moka.core.tps.mvc.desking.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 생성일과 생성자로 group by한 데스킹히스토리 목록 제공
 *
 * @author jeon0525
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Alias("DeskingHistGroupVO")
public class DeskingHistGroupVO implements Serializable {

    private static final long serialVersionUID = 4599769615811508579L;

    /**
     * 컴포넌트 히스토리 SEQ
     */
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 생성일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 생성자
     */
    @JsonIgnore
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 데이타셋ID
     */
    @Column(name = "DATASET_SEQ")
    private Long datasetSeq;

    /**
     * 컴포넌트ID
     */
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    /**
     * 컴포넌트명
     */
    @Column(name = "COMPONENT_NAME")
    private String componentName;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS")
    private String status = EditStatusCode.SAVE.getCode();

    /**
     * 예약일시
     */
    @DTODateTimeFormat
    @Column(name = "RESERVE_DT")
    protected Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Builder.Default
    @Column(name = "APPROVAL_YN")
    protected String approvalYn = MokaConstants.NO;

}
