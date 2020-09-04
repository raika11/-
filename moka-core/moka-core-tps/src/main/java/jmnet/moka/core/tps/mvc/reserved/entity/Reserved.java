package jmnet.moka.core.tps.mvc.reserved.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_RESERVED database table.
 * 
 */
@Entity
@Table(name = "WMS_RESERVED")
@NamedQuery(name = "Reserved.findAll", query = "SELECT r FROM Reserved r")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Reserved implements Serializable {

    private static final long serialVersionUID = -8423627992254670355L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESERVED_SEQ")
    private Long reservedSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = false, referencedColumnName = "DOMAIN_ID")
    private Domain domain;

    @Column(name = "RESERVED_ID")
    private String reservedId;

    @Column(name = "RESERVED_VALUE")
    private String reservedValue;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

}
