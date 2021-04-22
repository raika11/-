/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

/**
 * 이슈확장형 컴포넌트정보
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder(toBuilder = true)
@Alias("IssueDeskingHistCompDTO")
public class IssueDeskingHistCompDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<IssueDeskingHistCompDTO>>() {
    }.getType();


    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "패키지 일련번호", required = true)
    @NotNull(message = "{tps.issue.error.notnull.pkgSeq}")
    private Long pkgSeq;

    @ApiModelProperty(value = "컴포넌트번호(1-7)", required = true)
    @NotNull(message = "{tps.issue.error.notnull.compNo}")
    private Integer compNo;

    @ApiModelProperty(value = "컴포넌트노출여부(Y/N)", required = true)
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.issue.error.pattern.compYn}")
    @Builder.Default
    private String viewYn = MokaConstants.NO;

    @ApiModelProperty("임시저장 최종일시")
    @DTODateTimeFormat
    @Column(name = "LAST_SAVE_DT")
    private Date lastSaveDt;

    @ApiModelProperty("임시저장 최종작업자")
    @Column(name = "LAST_SAVE_ID")
    private String lastSaveId;

    @ApiModelProperty("임시저장 최종작업자명")
    @Column(name = "LAST_SAVE_NM")
    private String lastSaveNm;

    @ApiModelProperty("전송 최종일시")
    @DTODateTimeFormat
    @Column(name = "LAST_PUBLISH_DT")
    private Date lastPublishDt;

    @ApiModelProperty("전송 최종작업자")
    @Column(name = "LAST_PUBLISH_ID")
    private String lastPublishId;

    @ApiModelProperty("전송 최종작업자명")
    @Column(name = "LAST_PUBLISH_NM")
    private String lastPublishNm;

    @ApiModelProperty("서버기준 예약일자")
    @DTODateTimeFormat
    @Column(name = "RESERVE_DT")
    private Date reserveDt;

    @ApiModelProperty("편집정보")
    @Builder.Default
    List<IssueDeskingHistDTO> issueDeskings = new ArrayList<>();

    public void appendDesking(IssueDeskingHistDTO desking) {
        if (this.issueDeskings == null) {
            this.issueDeskings = new ArrayList<>();
        }
        this.issueDeskings.add(desking);
    }
}
