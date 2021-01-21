/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * Description: 견학 메시지
 *
 * @author ssc
 * @since 2021-01-20
 */
@Alias("TourGuideVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourGuideVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 안내 타입[A,신청 방법 안내],[B,견학 신청 안내],[C,견학 시 유의 사항],[D,관람 및 주차안내],[D,자주 하는 질문]
     */
    @NotNull(message = "{tps.tour-guide.error.notnull.guideType}")
    @Length(min = 1, max = 1, message = "{tps.tour-guide.error.length.guideType}")
    @Column(name = "GUIDE_TYPE")
    private String guideType;

    /**
     * 안내 메시지
     */
    @Column(name = "GUIDE_MSG")
    private String guideMsg;
}
