package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
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
