/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

/**
 * Description: 기사정보 수정항목
 *
 * @author ssc
 * @since 2020-12-23
 */
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.core.tps.mvc.article.vo.ArticleContentVO;
import jmnet.moka.core.tps.mvc.article.vo.ArticleReporterVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleBasicUpdateDTO")
public class ArticleBasicUpdateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleBasicUpdateDTO>>() {
    }.getType();

    /**
     * 기사제목
     */
    private String artTitle;

    /**
     * 기사부제목
     */
    private String artSubTitle;

    /**
     * 분류코드 목록
     */
    private List<String> categoryList = new ArrayList<>();

    /**
     * 기자 목록
     */
    private List<ArticleReporterVO> reporterList = new ArrayList<>();

    /**
     * 추천태그 목록
     */
    private List<String> tagList = new ArrayList<>();

    /**
     * 기사본문
     */
    private ArticleContentVO artContent;

}
