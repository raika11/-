package jmnet.moka.core.tps.mvc.component.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.ad.entity.Ad;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * 컴포넌트 광고
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_COMPONENT_AD")
public class ComponentAd implements Serializable {

    private static final long serialVersionUID = -7273958000859682529L;

    public static final Type TYPE = new TypeReference<List<ComponentAd>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 컴포넌트SEQ
     */
    @Column(name = "COMPONENT_SEQ", nullable = false)
    private Long componentSeq;

    /**
     * 광고
     */
    @ManyToOne
    @JoinColumn(name = "AD_SEQ", referencedColumnName = "AD_SEQ", nullable = false)
    private Ad ad;

    /**
     * 리스트단락
     */
    @Column(name = "LIST_PARAGRAPH", nullable = false)
    @Builder.Default
    private Integer listParagraph = TpsConstants.LIST_PARAGRAPH;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.listParagraph = this.listParagraph == null ? TpsConstants.LIST_PARAGRAPH : this.listParagraph;
    }

}
