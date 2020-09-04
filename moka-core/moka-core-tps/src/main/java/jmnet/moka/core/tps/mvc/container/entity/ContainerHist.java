package jmnet.moka.core.tps.mvc.container.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_CONTAINER_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_CONTAINER_HIST")
@NamedQuery(name = "ContainerHist.findAll", query = "SELECT c FROM ContainerHist c")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "container")
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
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Lob
    @Column(name = "CONTAINER_BODY")
    private String containerBody;

    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

}
