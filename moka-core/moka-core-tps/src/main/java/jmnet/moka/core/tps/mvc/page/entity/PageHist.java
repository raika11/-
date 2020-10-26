package jmnet.moka.core.tps.mvc.page.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;


/**
 * 페이지 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@EqualsAndHashCode(exclude = "page")
//@JsonInclude(Include.NON_NULL)
@Table(name = "TB_WMS_PAGE_HIST")
public class PageHist extends RegAudit {

    private static final long serialVersionUID = -6758004507889699806L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 페이지
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = false)
    private Page page;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 페이지본문
     */
    @Nationalized
    @Column(name = "PAGE_BODY")
    @Builder.Default
    private String pageBody = "";

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.pageBody = McpString.defaultValue(this.pageBody);
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
    }
}
