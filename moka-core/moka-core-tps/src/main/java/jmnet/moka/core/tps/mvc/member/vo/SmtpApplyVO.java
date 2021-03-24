/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.member.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Smtp 신청정보
 */
@Alias("SmtpApplyVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class SmtpApplyVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 사용자 ID
     */
    @Column(name = "MEMBER_ID")
    private String memberId;

    /**
     * 사용자명
     */
    @Column(name = "MEMBER_NM")
    private String memberNm;

    /**
     * 상태
     */
    @Column(name = "STATUS")
    private String status;

    /**
     * 요청이유(신청,잠금해제)
     */
    @Column(name = "REQUEST_REASON")
    private String requestReason;
}
