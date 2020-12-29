package jmnet.moka.core.tps.mvc.ad.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the WMS_AD database table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "areaComps")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "areaSeq")
@Entity
@Table(name = "TB_WMS_AD")
public class Ad extends BaseAudit {
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

    @Column(name = "PERIOD_END_DT")
    private Date periodEndDt;

    @Column(name = "PERIOD_START_DT")
    private Date periodStartDt;

    @Column(name = "USED_YN", columnDefinition = "char")
    private String usedYn;

    @Column(name = "AD_HEIGHT")
    private int adHeight;

    @Column(name = "AD_WIDTH")
    private int adWidth;

    @Column(name = "AD_TYPE", columnDefinition = "char")
    private String adType;

    @Column(name = "SLIDE_TYPE")
    private String slideType;

    @Column(name = "AD_BODY")
    private String adBody;

    @Column(name = "AD_FILE_NAME")
    private String adFileName;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

}
