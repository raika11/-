/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 컴포넌트의 히스토리 목록
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@Alias("IssueDeskingHistGroupVO")
public class IssueDeskingHistGroupVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 순번
     */
    @Column(name = "ROWNUM")
    private Long rownum;

    /**
     * 패키지순번
     */
    @Column(name = "PKG_SEQ", nullable = false)
    private Long pkgSeq;

    /**
     * 컴포넌트번호(1-7)
     */
    @Column(name = "COMP_NO", nullable = false)
    private Integer compNo;

    /**
     * 작업일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 생성자명
     */
    @Column(name = "REG_NM")
    private String regNm;

    /**
     * 상태 SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS")
    private String status;

    /**
     * 예약일시
     */
    @Column(name = "RESERVE_DT", updatable = false)
    private Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Column(name = "APPROVAL_YN", updatable = false)
    @Builder.Default
    private String approvalYn = MokaConstants.NO;

}
