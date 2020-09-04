package jmnet.moka.core.tps.mvc.ad.entity;

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
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_AD database table.
 * 
 */
@Entity
@Table(name = "WMS_AD")
@NamedQuery(name = "Ad.findAll", query = "SELECT a FROM Ad a")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(of = "adSeq")
@Builder
public class Ad implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AD_SEQ")
    private Long adSeq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "DOMAIN_ID", nullable = true)
    private Domain domain;

    @Column(name = "AD_NAME")
    private String adName;

    @Column(name = "AD_DEPT_NO")
    private int adDeptNo;

    @Column(name = "AD_USE_TYPE")
    private String adUseType;

    @Column(name = "AD_LOCATION")
    private String adLocation;

    @Column(name = "PERIOD_YN", columnDefinition = "char")
    private String periodYn;

    @Column(name = "PERIOD_END_YMDT")
    private String periodEndYmdt;

    @Column(name = "PERIOD_START_YMDT")
    private String periodStartYmdt;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "AD_HEIGHT")
    private int adHeight;

    @Column(name = "AD_WIDTH")
    private int adWidth;

    @Column(name = "SLIDE_TYPE")
    private String slideType;

    @Lob
    @Column(name = "AD_BODY")
    private String adBody;

    @Column(name = "AD_FILE_NAME")
    private String adFileName;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Column(name = "AD_TYPE", columnDefinition = "char")
    private String adType;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

}
