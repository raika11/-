package jmnet.moka.core.tps.mvc.sns.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.article.entity.ArticleBasic;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 기사 SNS메타
 */
@Entity
@Table(name = "TB_ARTICLE_SNS_SHARE")
@Data
@EqualsAndHashCode(callSuper = true)
public class ArticleSnsShare extends jmnet.moka.core.tps.common.entity.BaseAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private ArticleSnsSharePK id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TOTAL_ID", insertable = false, updatable = false)
    private ArticleBasic articleBasic;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn;

    /**
     * SNS 전송일시(업데이트시 수정됨)
     */
    @Column(name = "SNS_INS_DT")
    private Date snsInsDt;

    /**
     * SNS 등록일시
     */
    @Column(name = "SNS_REG_DT")
    private Date snsRegDt;

    /**
     * SNS 기사ID
     */
    @Column(name = "SNS_ART_ID")
    private String snsArtId;

    /**
     * SNS 전송상태
     */
    @Column(name = "SNS_ART_STS")
    private String snsArtSts;

    /**
     * 예약일시
     */
    @Column(name = "RESERVE_DT")
    private Date reserveDt;

    /**
     * 포스트 메시지
     */
    @Column(name = "SNS_POST_MSG")
    private String snsPostMsg;

    /**
     * 이미지
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 기사제목
     */
    @Column(name = "ART_TITLE")
    private String artTitle;

    /**
     * 메타데이터 추가 키워드
     */
    @Column(name = "ART_KEYWORD")
    private String artKeyword;

    /**
     * 설명
     */
    @Column(name = "ART_SUMMARY")
    private String artSummary;

}
