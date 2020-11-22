/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.EditStatusCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Description: 히스토리의 임시저장,배포,예약에 대한 정보
 *
 * @author ohtah
 * @since 2020. 11. 21.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistPublishDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 히스토리SEQ
     */
    private Long seq;

    /**
     * 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private EditStatusCode status = EditStatusCode.SAVE;

    /**
     * 예약일시
     */
    private Date reserveDt;

    /**
     * 승인여부 예약일시가 설정되어 있을 경우 예약된 작업이 완료되면 Y로 처리
     */
    @Column(name = "APPROVAL_YN")
    @Builder.Default
    private String approvalYn = MokaConstants.NO;

}
