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
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * TOUR 신청정보
 */
@Alias("TourApplyVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourApplyVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.tour-apply.error.min.tourSeq}")
    @Column(name = "TOUR_SEQ", nullable = false)
    private Long tourSeq;

    /**
     * 진행상태(S:신청, A:승인, R:반려, C:취소)
     */
    @Pattern(regexp = "[S|A|R|C]{1}$", message = "{tps.tour-apply.error.pattern.tourStatus}")
    @Column(name = "TOUR_STATUS")
    private String tourStatus;

    /**
     * 삭제여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.tour-apply.error.pattern.delYn}")
    @Column(name = "DEL_YN")
    private String delYn;

    /**
     * 견학일시
     */
    @DTODateTimeFormat
    @Column(name = "TOUR_DATE")
    private Date tourDate;

    /**
     * 견학시간
     */
    @Length(max = 2, message = "{tps.tour-apply.error.len.tourTime}")
    @Column(name = "TOUR_TIME")
    private String tourTime;

    /**
     * UNIQUE ID
     */
    @Length(max = 12, message = "{tps.tour-apply.error.len.tourId}")
    @Column(name = "TOUR_ID")
    private String tourId;

    /**
     * 단체명
     */
    @Length(max = 100, message = "{tps.tour-apply.error.len.tourGroupNm}")
    @Column(name = "TOUR_GROUP_NM")
    private String tourGroupNm;

    /**
     * 견학인원
     */
    @Column(name = "TOUR_PERSONS")
    private Integer tourPersons;

    /**
     * 단체 연령대
     */
    @Column(name = "TOUR_AGE")
    private Integer tourAge;

    /**
     * 견학목적
     */
    @Column(name = "TOUR_PURPOSE")
    private String tourPurpose;

    /**
     * 신청자 이름
     */
    @Length(max = 100, message = "{tps.tour-apply.error.len.writerNm}")
    @Column(name = "WRITER_NM")
    private String writerNm;

    /**
     * 신청자 핸드폰 번호
     */
    @Length(max = 512, message = "{tps.tour-apply.error.len.writerPhone}")
    @Column(name = "WRITER_PHONE")
    private String writerPhone;

    /**
     * 신청자 EMAIL
     */
    @Length(max = 512, message = "{tps.tour-apply.error.len.writerEmail}")
    @Column(name = "WRITER_EMAIL")
    private String writerEmail;

    /**
     * 비밀번호
     */
    @Length(max = 512, message = "{tps.tour-apply.error.len.writerPwd}")
    @Column(name = "WRITER_PWD")
    private String writerPwd;

    /**
     * 신청자 IP
     */
    @Length(max = 40, message = "{tps.tour-apply.error.len.writerIp}")
    @Column(name = "WRITER_IP")
    private String writerIp;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 삭제일
     */
    @DTODateTimeFormat
    @Column(name = "DEL_DT")
    private Date delDt;

    /**
     * 반려사유
     */
    @Column(name = "RETURN_REASON")
    private String returnReason;

    /**
     * 담당자 부서
     */
    @Length(max = 100, message = "{tps.tour-apply.error.len.chargeDept}")
    @Column(name = "CHARGE_DEPT")
    private String chargeDept;

    /**
     * 담당자 이름
     */
    @Length(max = 100, message = "{tps.tour-apply.error.len.chargeStaffNm}")
    @Column(name = "CHARGE_STAFF_NM")
    private String chargeStaffNm;

    /**
     * 담당자 연락처
     */
    @Length(max = 512, message = "{tps.tour-apply.error.len.chargePhone}")
    @Column(name = "CHARGE_PHONE")
    private String chargePhone;

    /**
     * 메일여부
     */
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.tour-apply.error.pattern.mailYn}")
    @Column(name = "MAIL_YN")
    private String mailYn;

    /**
     * 승인일시
     */
    @DTODateTimeFormat
    @Column(name = "CONFIRM_DT")
    private Date confirmDt;

    // 상명 명칭
    private String tourStatusName;

}
