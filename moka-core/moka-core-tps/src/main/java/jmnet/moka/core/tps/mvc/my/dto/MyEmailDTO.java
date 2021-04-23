/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.my.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Description: 회원메일 DTO
 *
 * @author ssc
 * @since 2021-04-22
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("회원메일 DTO")
public class MyEmailDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    @ApiModelProperty("회원관리번호")
    @NotNull(message = "{tps.my.error.notnull.memSeq}")
    private Long memSeq;

    @ApiModelProperty("로그인타입")
    @NotNull(message = "{tps.my.error.notnull.loginType}")
    private String loginType;

    @ApiModelProperty("기존이메일")
    @NotNull(message = "{tps.my.error.notnull.fromEmail}")
    private String fromEmail;

    @ApiModelProperty("변경이메일")
    @NotNull(message = "{tps.my.error.notnull.toEmail}")
    private String toEmail;

    @ApiModelProperty(value = "실행결과", hidden = true)
    private Integer returnValue;
}
