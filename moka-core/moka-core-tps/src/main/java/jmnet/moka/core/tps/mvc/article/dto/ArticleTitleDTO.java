/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-11-27
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("ArticleTitleDTO")
public class ArticleTitleDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleTitleDTO>>() {
    }.getType();

    /**
     * 서비스기사아이디
     */
    @Min(value = 0, message = "{tps.article.error.min.totalId}")
    private Long totalId;

    /**
     * 편집된 기사제목
     */
    @NotNull(message = "{tps.article.error.notnull.artEditTitle}")
    @Pattern(regexp = ".+", message = "{tps.article.error.pattern.artEditTitle}")
    @Length(min = 1, max = 510, message = "{tps.article.error.length.artEditTitle}")
    private String artEditTitle;

    /**
     * 편집된 모바일 기사제목
     */
    @NotNull(message = "{tps.article.error.notnull.artEditMobTitle}")
    @Pattern(regexp = ".+", message = "{tps.article.error.pattern.artEditMobTitle}")
    @Length(min = 1, max = 510, message = "{tps.article.error.length.artEditMobTitle}")
    private String artEditMobTitle;
}
