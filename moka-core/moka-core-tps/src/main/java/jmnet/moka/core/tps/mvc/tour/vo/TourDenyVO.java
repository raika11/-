/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * 공휴일목록
 */
@Alias("TourDenyVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourDenyVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 공휴일일련번호
     */
    @Min(value = 0, message = "{tps.tour-deny.error.min.denySeq}")
    @Column(name = "DENY_SEQ", nullable = false)
    private Long denySeq;

    /**
     * 삭제여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.tour-deny.error.pattern.delYn}")
    @Column(name = "DEL_YN")
    private String delYn = MokaConstants.NO;

    /**
     * 공휴일반복여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.tour-deny.error.pattern.denyRepeatYn}")
    @Column(name = "DENY_REPEAT_YN")
    private String denyRepeatYn;

    /**
     * 공휴일일자
     */
    @DTODateTimeFormat
    @Column(name = "DENY_DATE")
    private Date denyDate;

    /**
     * 공휴일년도
     */
    @Length(max = 4, message = "{tps.tour-deny.error.len.denyYear}")
    @Column(name = "DENY_YEAR")
    private String denyYear;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 삭제일시
     */
    @DTODateTimeFormat
    @Column(name = "DEL_DT")
    private Date delDt;

    /**
     * 공휴일제목
     */
    @Length(max = 100, message = "{tps.tour-deny.error.len.denyTitle}")
    @Column(name = "DENY_TITLE")
    private String denyTitle;

    /**
     * 오늘기준일자(디비에 없는 필드)
     */
    @Column(name = "HOLIDAY")
    private String holiday;

}
