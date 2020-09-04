package jmnet.moka.core.tps.mvc.etccode.entity;

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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_ETCCODE database table.
 * 
 */
@Entity
@Table(name = "WMS_ETCCODE")
@NamedQuery(name = "Etccode.findAll", query = "SELECT e FROM Etccode e")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "etccodeType")
@JsonInclude(Include.NON_NULL)
public class Etccode implements Serializable {

    private static final long serialVersionUID = -1877787466206944682L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CODE_ID")
    private String codeId;

    @Column(name = "CODE_NAME")
    private String codeName;

    @Column(name = "CODE_NAME_ETC1")
    private String codeNameEtc1;

    @Column(name = "CODE_NAME_ETC2")
    private String codeNameEtc2;

    @Column(name = "CODE_NAME_ETC3")
    private String codeNameEtc3;

    @Column(name = "CODE_ORDER")
    private Integer codeOrder;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "CODE_TYPE_SEQ", referencedColumnName = "CODE_TYPE_SEQ", nullable = false)
    private EtccodeType etccodeType;

}
