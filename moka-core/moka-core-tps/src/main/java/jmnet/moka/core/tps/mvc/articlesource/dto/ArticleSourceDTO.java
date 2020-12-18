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
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
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

    @ApiModelProperty("출처코드드")
    //    @Length(max = 2, message = "{tps.rticle-source.error.length.sourceCode}")
    //    @NotNull(message = "{tps.article-source.error.notnull.sourceCode}")
    private String sourceCode;

    @ApiModelProperty("출처명")
    private String sourceName;

    @ApiModelProperty("BASEURL")
    private String sourceBaseurl;

    @ApiModelProperty("출처이미지URL")
    private String sourceImageUrl;

    @ApiModelProperty("출처기타")
    private String sourceEtc;

    @ApiModelProperty("출처타입")
    private String sourceType;

    @ApiModelProperty("서버구분")
    private String serverGubun;

    @ApiModelProperty("중앙사용")
    private String joongangUse;

    @ApiModelProperty("일간사용")
    private String ilganUse;

    @ApiModelProperty("CONSALES사용")
    private String consalesUse;

    @ApiModelProperty("JSTORE사용")
    private String jstoreUse;

    @ApiModelProperty("소셜전송여부")
    private String socialUse;

    @ApiModelProperty("벌크 사용")
    @Builder.Default
    private String bulkFlag = MokaConstants.NO;

    @ApiModelProperty("CP수신사용여부")
    @Builder.Default
    private String rcvUsedYn = MokaConstants.YES;

    @ApiModelProperty("CP담당자")
    private String cpAdmin;

    @ApiModelProperty("CP담당자 연락처")
    private String cpPhone;

    @ApiModelProperty("CP담당자 이메일")
    private String cpEmail;

    @ApiModelProperty("작업자")
    private String localAdmin;

    @ApiModelProperty("CP FTP XML 로컬경로")
    private String cpXmlPath;

    @ApiModelProperty("CP등록IP주소")
    private String cpRegIp;

    @ApiModelProperty("내용편집 필요여부")
    @Builder.Default
    private String artEditYn = MokaConstants.NO;

    @ApiModelProperty("조인스XML형식")
    @Builder.Default
    private String joinsXmlFormat = MokaConstants.YES;

    @ApiModelProperty("이미지수신여부")
    @Builder.Default
    private String receiveImgYn = MokaConstants.NO;
}
