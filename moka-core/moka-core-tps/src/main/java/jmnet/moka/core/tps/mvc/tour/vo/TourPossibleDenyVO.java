/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.tour.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 공휴일목록
 */
@Alias("TourPossibleDenyVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourPossibleDenyVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 신청가능한 일자
     */
    @DTODateTimeFormat
    @Column(name = "POSS_DATE")
    private Date possDate;

    /**
     * 신청일련번호
     */
    @Column(name = "TOUR_SEQ")
    private Long tourSeq;

    /**
     * 진행상태(S:신청, A:승인, R:반려, C:취소)
     */
    @Column(name = "TOUR_STATUS")
    private String tourStatus;

    /**
     * 공휴일일련번호
     */
    @Column(name = "DENY_SEQ")
    private Long denySeq;

    /**
     * 공휴일제목
     */
    @Column(name = "DENY_TITLE")
    private String denyTitle;

    /**
     * 주말번호(6:금)
     */
    @Column(name = "WEEKNUM")
    private Integer weeknum;

    /**
     * 가능여부
     */
    @Column(name = "POSSIBLE_YN")
    private String possibleYn;
}
