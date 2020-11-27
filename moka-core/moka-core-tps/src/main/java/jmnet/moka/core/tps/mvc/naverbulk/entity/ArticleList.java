package jmnet.moka.core.tps.mvc.naverbulk.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;


/**
 * The persistent class for the TB_CLICK_ARTICLE_LIST table.
 */
@Entity
@Table(name = "TB_CLICK_ARTICLE_LIST")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
//@NamedQuery(name = "ArticleList.findAll", query = "SELECT d FROM ArticleList d")
public class ArticleList implements Serializable{

    private static final long serialVersionUID = -6123879324816610973L;

    /**
     * 에피소드 관련기사 ID
     */
    @EmbeddedId
    private ArticlePK id;

//    /**
//     * int   10,0    NO  클릭기사일련번호
//     */
//    @Column(name = "CLICKART_SEQ" insertable=false, )
//    Long clickartSeq;

//    /**
//     * tinyint  3,0 ((1))   NO  순서
//     */
//    @Column(name = "ORD_NO", nullable = false, length = 3)
//    Long ordNo;

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




