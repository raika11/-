/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.articlesource.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
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
 * Description: 매체 DTO
 *
 * @author ssc
 * @since 2020-12-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleSourceTO")
@ApiModel("기사 매체 DTO")
public class ArticleSourceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleSourceDTO>>() {
    }.getType();

    @ApiModelProperty("매체코드(필수)")
    @Length(min = 1, max = 2, message = "{tps.article-source.error.length.sourceCode}")
    @NotNull(message = "{tps.article-source.error.notnull.sourceCode}")
    private String sourceCode;

    @ApiModelProperty("매체명(필수)")
    @Length(max = 50, message = "{tps.article-source.error.length.sourceName}")
    @NotNull(message = "{tps.article-source.error.notnull.sourceName}")
    private String sourceName;

    @ApiModelProperty("BASEURL")
    @Length(max = 50, message = "{tps.article-source.error.length.sourceBaseurl}")
    private String sourceBaseurl;

    @ApiModelProperty("출처이미지URL")
    @Length(max = 50, message = "{tps.article-source.error.length.sourceImageUrl}")
    private String sourceImageUrl;

    @ApiModelProperty("출처기타")
    @Length(max = 50, message = "{tps.article-source.error.length.sourceEtc}")
    private String sourceEtc;

    @ApiModelProperty("출처타입(필수)")
    @Length(max = 5, message = "{tps.article-source.error.length.sourceType}")
    @NotNull(message = "{tps.article-source.error.notnull.sourceType}")
    private String sourceType;

    @ApiModelProperty("서버구분")
    @Length(max = 10, message = "{tps.article-source.error.length.serverGubun}")
    private String serverGubun;

    @ApiModelProperty("중앙사용")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.joongangUse}")
    private String joongangUse;

    @ApiModelProperty("일간사용")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.ilganUse}")
    private String ilganUse;

    @ApiModelProperty("CONSALES사용")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.consalesUse}")
    private String consalesUse;

    @ApiModelProperty("JSTORE사용")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.jstoreUse}")
    private String jstoreUse;

    @ApiModelProperty("소셜전송여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.socialUse}")
    private String socialUse;

    @ApiModelProperty("벌크 사용")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.bulkFlag}")
    @Builder.Default
    private String bulkFlag = MokaConstants.NO;

    @ApiModelProperty("CP수신사용여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.rcvUsedYn}")
    @Builder.Default
    private String rcvUsedYn = MokaConstants.YES;

    @ApiModelProperty("CP담당자")
    @Length(max = 40, message = "{tps.article-source.error.length.cpAdmin}")
    private String cpAdmin;

    @ApiModelProperty("CP담당자 연락처")
    @Length(max = 512, message = "{tps.article-source.error.length.cpPhone}")
    private String cpPhone;

    @ApiModelProperty("CP담당자 이메일")
    @Length(max = 512, message = "{tps.article-source.error.length.cpEmail}")
    private String cpEmail;

    @ApiModelProperty("작업자")
    @Length(max = 40, message = "{tps.article-source.error.length.localAdmin}")
    private String localAdmin;

    @ApiModelProperty("CP FTP XML 로컬경로")
    @Length(max = 100, message = "{tps.article-source.error.length.cpXmlPath}")
    private String cpXmlPath;

    @ApiModelProperty("CP등록IP주소")
    @Length(max = 50, message = "{tps.article-source.error.length.cpRegIp}")
    private String cpRegIp;

    @ApiModelProperty("내용편집 필요여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.artEditYn}")
    @Builder.Default
    private String artEditYn = MokaConstants.NO;

    @ApiModelProperty("조인스XML형식")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.joinsXmlFormat}")
    @Builder.Default
    private String joinsXmlFormat = MokaConstants.YES;

    @ApiModelProperty("이미지수신여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.article-source.error.pattern.receiveImgYn}")
    @Builder.Default
    private String receiveImgYn = MokaConstants.NO;
}
