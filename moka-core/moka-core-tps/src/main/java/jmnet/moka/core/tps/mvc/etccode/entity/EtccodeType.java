package jmnet.moka.core.tps.mvc.etccode.entity;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_ETCCODE_TYPE database table.
 * 
 */
@Entity
@Table(name = "WMS_ETCCODE_TYPE")
@NamedQuery(name = "EtccodeType.findAll", query = "SELECT e FROM EtccodeType e")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "etccodes")
@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "codeTypeId")
public class EtccodeType implements Serializable {

    private static final long serialVersionUID = 7521210132764582029L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CODE_TYPE_SEQ")
    private Long codeTypeSeq;

    @Column(name = "CODE_TYPE_ID")
    private String codeTypeId;

    @Column(name = "CODE_TYPE_NAME")
    private String codeTypeName;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "MODIFIED_YMDT")
    private String modifiedYmdt;

    @Column(name = "MODIFIER")
    private String modifier;

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "etccodeType", cascade = CascadeType.REMOVE)
    private Set<Etccode> etccodes = new LinkedHashSet<Etccode>();


}
