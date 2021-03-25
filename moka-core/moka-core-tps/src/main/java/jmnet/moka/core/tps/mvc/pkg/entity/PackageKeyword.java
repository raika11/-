package jmnet.moka.core.tps.mvc.pkg.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.packagae.entity
 * ClassName : PackageKeyword
 * Created : 2021-03-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-03-19 오후 2:27
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_MOKA_PACKAGE_KWD")
public class PackageKeyword implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    //    @Column(name = "PKG_SEQ")
    //    private Long pkgSeq;

    @Column(name = "CAT_DIV")
    private String catDiv;

    @Column(name = "SCH_CONDI")
    private String schCondi;

    @Column(name = "AND_OR")
    private String andOr;

    @Column(name = "KWD_CNT")
    private Long kwdCnt;

    @Column(name = "ORD_NO")
    private Long ordno;

    //    @Column(name = "REP_MASTER")
    //    private Long repMaster;

    @Column(name = "KWD_ORD")
    private Long kwdOrd;

    @Column(name = "KEYWORD")
    private String keyword;

    @Column(name = "S_DATE")
    private String sDate;

    @Column(name = "E_DATE")
    private String eDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "PKG_SEQ", nullable = false, updatable = false, insertable = true)
    private PackageMaster packageMaster;


    //    @OneToOne(fetch = FetchType.EAGER)
    //    @NotFound(action = NotFoundAction.IGNORE)
    //    @JoinColumn(name = "REP_MASTER", referencedColumnName = "REP_SEQ", nullable = true)
    //    private Reporter reporter;

}
