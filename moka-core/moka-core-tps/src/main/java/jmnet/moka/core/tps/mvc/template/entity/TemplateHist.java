package jmnet.moka.core.tps.mvc.template.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_TEMPLATE_HIST database table.
 * 
 */
@Entity
@Table(name = "WMS_TEMPLATE_HIST")
@NamedQuery(name = "TemplateHist.findAll", query = "SELECT t FROM TemplateHist t")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TemplateHist implements Serializable {

    private static final long serialVersionUID = -5653969038976101774L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    @Column(name = "CREATE_YMDT")
    private String createYmdt;

    @Column(name = "CREATOR")
    private String creator;

    @Column(name = "DOMAIN_ID", columnDefinition = "char", nullable = true)
    private String domainId;

    @Lob
    @Column(name = "TEMPLATE_BODY")
    private String templateBody;

    @ManyToOne
    @JoinColumn(name = "TEMPLATE_SEQ")
    private Template template;

    @Column(name = "WORK_TYPE", columnDefinition = "char")
    private String workType;

}
