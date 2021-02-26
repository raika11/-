package jmnet.moka.core.tps.mvc.directlink.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;


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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LINK_SEQ")
    private Long linkSeq;

    /**
     * 대표이미지
     */
    @Column(name = "IMG_URL", nullable = false)
    private String imgUrl;

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
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "MOD_ID", insertable = false, updatable = false)
    private MemberSimpleInfo modMember;


    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = this.usedYn == null ? "N" : this.usedYn;
        this.fixYn = this.fixYn == null ? "N" : this.fixYn;
        this.linkType = this.linkType == null ? "N" : this.linkType;
        //this.imgUrl = this.linkUrl == null ? "http://pds.joins.com/news/search_direct_link/000.jpg" : this.linkUrl;
    }
}
