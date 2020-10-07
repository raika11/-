package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import javax.persistence.*;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;


/**
 * The persistent class for the TB_WMS_CONTAINER_HIST database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "container")
@Entity
@Table(name = "TB_WMS_CONTAINER_HIST")
@NamedQuery(name = "ContainerHist.findAll", query = "SELECT c FROM ContainerHist c")
public class ContainerHist implements Serializable {

    private static final long serialVersionUID = 6857747089425705175L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CONTAINER_SEQ", referencedColumnName = "CONTAINER_SEQ", nullable = false)
    private Container container;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", referencedColumnName = "DOMAIN_ID", nullable = false)
    private Domain domain;

    @Nationalized
    @Column(name = "CONTAINER_BODY")
    private String containerBody;

    @Column(name = "WORK_TYPE", columnDefinition = "char", length = 1)
    private String workType;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 30)
    private String regId;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.workType = McpString.defaultValue(this.workType, "U");
        this.regDt = McpDate.defaultValue(this.regDt);
    }
}
