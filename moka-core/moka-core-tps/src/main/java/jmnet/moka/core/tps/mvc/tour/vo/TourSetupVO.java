/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * TOUR 설정
 */
@Alias("TourSetupVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourSetupVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 견학여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.tour-setup.error.pattern.tourYn}")
    @Column(name = "TOUR_YN")
    @Builder.Default
    private String tourYn = MokaConstants.YES;

    /**
     * 견학일자FROM
     */
    @Column(name = "TOUR_DAY_FROM")
    private Integer tourDayFrom;

    /**
     * 견학일자TO
     */
    @Column(name = "TOUR_DAY_TO")
    private Integer tourDayTo;

    /**
     * 견학번호FROM
     */
    @Column(name = "TOUR_NUM_FROM")
    private Integer tourNumFrom;

    /**
     * 견학번호TO
     */
    @Column(name = "TOUR_NUM_TO")
    private Integer tourNumTo;

    /**
     * 견학주여부
     */
    @Length(max = 7, message = "{tps.tour-setup.error.len.tourWeekYn}")
    @Column(name = "TOUR_WEEK_YN")
    private String tourWeekYn;

}
