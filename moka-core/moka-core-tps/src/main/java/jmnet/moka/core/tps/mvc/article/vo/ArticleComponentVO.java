/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 기사의 이미지 컴포넌트
 *
 * @author ssc
 * @since 2020-12-17
 */
@Alias("ArticleComponentVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("기사 이미지 컴포넌트 VO")
public class ArticleComponentVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleComponentVO>>() {
    }.getType();

    @ApiModelProperty("일련번호")
    @Column(name = "SEQ_NO")
    private Long seqNo;

    @ApiModelProperty("컴포넌트제목")
    @Column(name = "COMP_TITLE")
    private String compTitle;

    @ApiModelProperty("컴포넌트파일URL")
    @Column(name = "COMP_FILE_URL")
    private String compFileUrl;

    @ApiModelProperty("컴포넌트파일제목")
    @Column(name = "COMP_FILE_TITLE")
    private String compFileTitle;

    @ApiModelProperty("이미지가로")
    @Column(name = "IMG_WIDTH")
    private Integer imgWidth;

    @ApiModelProperty("이미지세로")
    @Column(name = "IMG_HEIGHT")
    private Integer imgHeight;

    @ApiModelProperty("이미지사이즈(KB)")
    @Column(name = "IMG_KSIZE")
    private Integer imgKSize;
}
