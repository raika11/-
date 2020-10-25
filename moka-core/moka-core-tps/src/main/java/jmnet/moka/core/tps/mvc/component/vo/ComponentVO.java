package jmnet.moka.core.tps.mvc.component.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Alias("ComponentVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentVO implements Serializable {

    private static final long serialVersionUID = 4915460246745266545L;

    /**
     * 컴포넌트SEQ
     */
    @Column(name = "COMPONENT_SEQ")
    private Long componentSeq;

    /**
     * 컴포넌트명
     */
    @Column(name = "COMPONENT_NAME")
    private String componentName;

    /**
     * 템플릿그룹(템플릿위치그룹)
     */
    @Column(name = "TP_ZONE")
    private String tpZone;

    /**
     * 사용여부
     */
    @Column(name = "USE_YN")
    @Builder.Default
    private String useYn = MokaConstants.NO;

    /**
     * 템플릿SEQ
     */
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    /**
     * 관련 컴포넌트 순서
     */
    @Column(name = "REL_ORDER")
    @Builder.Default
    private Integer relOrder = 1;

}
