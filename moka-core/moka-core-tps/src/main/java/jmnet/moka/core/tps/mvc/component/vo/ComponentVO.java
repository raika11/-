package jmnet.moka.core.tps.mvc.component.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("componentVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ComponentVO implements Serializable {

    private static final long serialVersionUID = 4915460246745266545L;

    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    @Column(name = "COMPONENT_NAME")
    private String componentName;

    @Column(name = "TP_ZONE")
    private String tpZone;

    @Column(name = "USE_YN")
    private String useYn;

    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @Column(name = "REL_ORDER")
    private Integer relOrder;

}
