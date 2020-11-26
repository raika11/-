package jmnet.moka.core.tps.mvc.naverbulk.entity;

import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.*;

import javax.persistence.*;


/**
 * The persistent class for the TB_15RE_DIRECT_LINK table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_CLICK_ARTICLE_LIST")
@NamedQuery(name = "ArticleList.findAll", query = "SELECT d FROM ArticleList d")
public class ArticleList  {

    private static final long serialVersionUID = -6123879324816610973L;

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @Id
    @Column(name = "CLICKART_SEQ")
    Long clickartSeq;

    /**
     * tinyint  3,0 ((1))   NO  순서
     */
    @Column(name = "ORD_NO", nullable = false, length = 3)
    Long ordNo;

    /**
     * nvarchar 510 NO  제목
     */
    @Column(name = "TITLE", nullable = false, length = 510)
    String title;

    /**
     * varchar  500 NO  URL
     */
    @Column(name = "URL", nullable = false, length = 500)
    String url;

    /**
     * int  10,0    YES 서비스기사아이디
     */
    @Column(name = "TOTAL_ID", length = 10)
    Long totalId;

}




