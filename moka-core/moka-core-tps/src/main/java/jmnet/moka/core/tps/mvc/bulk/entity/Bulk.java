package jmnet.moka.core.tps.mvc.bulk.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_BULK_ARTICLE table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_BULK_ARTICLE")
public class Bulk extends RegAudit {

    private static final long serialVersionUID = -6113879344816610973L;

    /**
     * int   10,0    NO  클릭기사일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BULKART_SEQ")
    Long bulkartSeq;

    /**
     * char 1   NO  클릭기사구분 - H(아티클핫클릭) N(벌크)
     */
    @Column(name = "BULKART_DIV", nullable = false, length = 1)
    String bulkartDiv;

    /**
     * varchar  2   NO  출처 - 썬데이[60] 중앙일보[3]
     */
    @Column(name = "SOURCE_CODE", nullable = false, length = 2)
    String sourceCode;

    /**
     * char 1   ('N')   NO  서비스여부
     */
    @Builder.Default
    @Column(name = "USED_YN", nullable = false, length = 1)
    String usedYn = MokaConstants.NO;

    /**
     * varchar  10  YES 상태 - SAVE(임시) / PUBLISH(전송)
     */
    @Column(name = "STATUS", length = 10)
    String status;

    /**
     * datetime YES 전송일시 - PUBLISH 될때 들어감
     */
    @Column(name = "SEND_DT")
    Date sendDt;

    /**
     * char 1   ('N')   NO  벌크전송여부
     */
    @Column(name = "BULK_SEND_YN", nullable = false, length = 1)
    String bulkSendYn;

    /**
     * datetime YES 벌크전송일시
     */
    @Column(name = "BULK_SEND_DT")
    Date bulkSendDt;

    /**
     * varchar 4000 YES 종합문구
     */
    @Column(name = "CONTENT")
    String content;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = this.usedYn == null ? "N" : this.usedYn;
        this.bulkSendYn = this.bulkSendYn == null ? "N" : this.bulkSendYn;
    }
}



