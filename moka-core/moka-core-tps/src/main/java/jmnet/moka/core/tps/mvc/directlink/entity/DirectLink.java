package jmnet.moka.core.tps.mvc.directlink.entity;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.*;

import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the TB_15RE_DIRECT_LINK table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_15RE_DIRECT_LINK")
@NamedQuery(name = "DirectLink.findAll", query = "SELECT d FROM DirectLink d")
public class DirectLink extends BaseAudit {

    private static final long serialVersionUID = -6113879324816610973L;


    /**
     * 링크일련번호
     */
    @Id
    @Column(name = "LINK_SEQ",nullable = false, insertable = false, updatable = false)
    private String linkSeq;

    /**
     * 사용여부(Y:사용,N:미사용)
     */
    @Column(name = "USED_YN", nullable = false, length = 1)
    private String usedYn;

    /**
     * 노출고정(y:항상노출n:검색시만노출)
     */
    @Column(name = "FIX_YN", nullable = false, length = 1)
    private String fixYn;

    /**
     * 링크타입(s:본창n:새창)
     */
    @Column(name = "LINK_TYPE", nullable = false, length = 1)
    private String linkType;

    /**
     * 노출시작일
     */
    @Column(name = "VIEW_SDATE", length = 10)
    private String viewSdate;

    /**
     * 노출종료일
     */
    @Column(name = "VIEW_EDATE", length = 10)
    private String viewEdate;

    /**
     * 서비스제목
     */
    @Column(name = "LINK_TITLE", nullable = false)
    private String linkTitle;

    /**
     * 대표이미지
     */
    @Column(name = "IMG_URL", nullable = false)
    private String imgUrl;

    /**
     * 링크url
     */
    @Column(name = "LINK_URL", nullable = false)
    private String linkUrl;

    /**
     * 내용
     */
    @Column(name = "LINK_CONTENT", nullable = false)
    private String linkContent;

    /**
     * 링크키워드
     */
    @Column(name = "LINK_KWD", nullable = false)
    private String linkKwd;

    /**
     * 등록일자
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 등록자아이디
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일자
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자아이디
     */
    @Column(name = "MOD_ID")
    private String modId;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = this.usedYn == null ? "N" : this.usedYn;
        this.fixYn = this.fixYn == null ? "N" : this.fixYn;
        this.linkType = this.linkType == null ? "N" : this.linkType;
    }
}
