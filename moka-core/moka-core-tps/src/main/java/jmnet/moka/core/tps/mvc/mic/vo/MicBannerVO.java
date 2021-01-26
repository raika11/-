/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

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
 * 시민마이크 다른주제공통배너
 */
@Alias("MicBannerVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicBannerVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 베너일련번호
     */
    @Column(name = "BNNR_SEQ", nullable = false)
    private Long bnnrSeq;

    /**
     * 링크 URL
     */
    @Column(name = "LINK_URL", nullable = false)
    private String linkUrl;

    /**
     * 이미지 경로
     */
    @Column(name = "IMG_LINK", nullable = false)
    private String imgLink;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = MokaConstants.NO;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

}
