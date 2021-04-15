/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
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
@Alias("IssueDeskingComponentDTO")
public class IssueDeskingComponentDTO implements Serializable {

    public static final Type TYPE = new TypeReference<List<IssueDeskingComponentDTO>>() {
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
