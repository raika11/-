/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvarticle.vo;

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

@Alias("RcvArticleReporterVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class RcvArticleReporterVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<RcvArticleReporterVO>>() {
    }.getType();

    /**
     * 기사일련버호
     */
    @Column(name = "RID")
    private Long rid;

    /**
     * 이름
     */
    @Column(name = "REPORTER_NAME")
    private String reporterName;

    /**
     * 이메일
     */
    @Column(name = "REPORTER_EMAIL")
    private String reporterEmail;

    /**
     * 기자페이지
     */
    @Column(name = "REPORTER_BLOG")
    private String reporterBlog;

    /**
     * 기자기타정보
     */
    @Column(name = "REPORTER_ETC")
    private String reporterEtc;
}
