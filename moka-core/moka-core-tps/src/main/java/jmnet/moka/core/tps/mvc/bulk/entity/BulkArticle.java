package jmnet.moka.core.tps.mvc.bulk.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_BULK_ARTICLE_LIST table.
 */
@Entity
@Table(name = "TB_BULK_ARTICLE_LIST")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BulkArticle implements Serializable {

    private static final long serialVersionUID = -6123879324816610973L;

    /**
     * 에피소드 관련기사 ID
     */
    @EmbeddedId
    private BulkArticlePK id;

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

    /**
     * varchar  2   YES 심볼
     */
    @Column(name = "SYMBOL", length = 2)
    String symbol;

}




