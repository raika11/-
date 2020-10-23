package jmnet.moka.core.tps.mvc.page.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;


/**
 * The persistent class for the TB_WMS_PAGE_HIST database table.
 * 
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
@NamedQuery(name = "PageHist.findAll", query = "SELECT p FROM PageHist p")
public class PageHist extends RegAudit {

    private static final long serialVersionUID = -6758004507889699806L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAGE_SEQ", referencedColumnName = "PAGE_SEQ", nullable = false)
    private Page page;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @Nationalized
    @Column(name = "PAGE_BODY")
    private String pageBody;

    @Column(name = "WORK_TYPE", columnDefinition = "char", length = 1)
    @Builder.Default
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
    }
}
