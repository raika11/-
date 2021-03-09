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

@Alias("ArticleReporterVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleReporterVO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticleReporterVO>>() {
    }.getType();

    /**
     * 기자일련버호
     */
    @Column(name = "REP_SEQ")
    private Long repSeq;

    /**
     * 기자명
     */
    @Column(name = "REP_NAME")
    private String repName;

    //    /**
    //     * 기자 Email
    //     */
    //    @Column(name = "REP_EMAIL")
    //    private String repEmail;

    /**
     * 순서
     */
    @Column(name = "ORD_NO")
    @Builder.Default
    private int ordNo = 1;

    /**
     * 기자 프로필 사진
     */
    @Column(name = "REP_PHOTO")
    private String repPhoto;

    /**
     * 직업정보
     */
    @Column(name = "JPLUS_JOB_INFO")
    private String jplusJobInfo;

    /**
     * 집배신 이메일
     */
    @Column(name = "REP_EMAIL1")
    private String repEmail1;

    /**
     * 기자한마디
     */
    @Column(name = "REP_TALK")
    private String repTalk;

    /**
     * 필진타입 (J1:기자필진,J2:외부필진,J3:그룹필진,J0:필진해지)
     */
    @Column(name = "JPLUS_REP_DIV")
    private String jplusRepDiv;

    /**
     * 기자회사
     */
    @Column(name = "CMP_NM")
    private String cmpNm;
}
