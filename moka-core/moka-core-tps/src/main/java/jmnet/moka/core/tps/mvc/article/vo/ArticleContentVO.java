/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
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

@Alias("ArticleContentVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleContentVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleContentVO>>() {
    }.getType();

    /**
     * 서비스기사아이디
     */
    @Column(name = "TOTAL_ID")
    private Long totalId;

    /**
     * 순번
     */
    @Column(name = "SERIAL_NO")
    private Long serialNo;

    /**
     * 기사내용
     */
    @Column(name = "ART_CONTENT")
    private String artContent;
}
