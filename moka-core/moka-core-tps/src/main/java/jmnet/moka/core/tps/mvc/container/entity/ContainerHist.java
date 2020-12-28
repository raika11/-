package jmnet.moka.core.tps.mvc.container.entity;

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
 * 컨테이너 히스토리
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "container")
@Entity
@Table(name = "TB_WMS_CONTAINER_HIST")
public class ContainerHist extends RegAudit {

    private static final long serialVersionUID = 6857747089425705175L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 컨테이너
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTAINER_SEQ", referencedColumnName = "CONTAINER_SEQ", nullable = false)
    private Container container;

    /**
     * 도메인
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    /**
     * 컨테이너본문
     */
    @Nationalized
    @Column(name = "CONTAINER_BODY")
    private String containerBody;

    /**
     * 작업유형
     */
    @Column(name = "WORK_TYPE", columnDefinition = "char")
    @Builder.Default
    private String workType = TpsConstants.WORKTYPE_UPDATE;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = McpString.defaultValue(this.workType, TpsConstants.WORKTYPE_UPDATE);
    }
}
