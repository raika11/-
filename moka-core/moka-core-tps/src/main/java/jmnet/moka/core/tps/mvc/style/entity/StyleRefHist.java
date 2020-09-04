package jmnet.moka.core.tps.mvc.style.entity;

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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_STYLE_REF_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_STYLE_REF_HIST")
@NamedQuery(name = "StyleRefHist.findAll", query = "SELECT s FROM StyleRefHist s")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "style")
@JsonInclude(Include.NON_NULL)
public class StyleRefHist implements Serializable {

    private static final long serialVersionUID = -2321984659013252140L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "REF_TYPE")
    private String refType;

    @Lob
    @Column(name = "STYLE_BODY")
    private String styleBody;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STYLE_SEQ", referencedColumnName = "STYLE_SEQ", nullable = false)
    private Style style;

    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

}
