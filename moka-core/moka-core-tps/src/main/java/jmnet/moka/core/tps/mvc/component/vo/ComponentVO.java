package jmnet.moka.core.tps.mvc.component.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
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
    @Column(name = "TEMPLATE_GROUP_NAME")
    private String templateGroupName;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = MokaConstants.NO;

    /**
     * 템플릿SEQ
     */
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    /**
     * 관련 컴포넌트 순서
     */
    @Column(name = "REL_ORD")
    @Builder.Default
    private Integer relOrd = 1;

    /**
     * 데이터유형:NONE, DESK, AUTO, FORM
     */
    @Column(name = "DATA_TYPE")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    /**
     * 노출여부
     */
    @Column(name = "VIEW_YN")
    @Builder.Default
    private String viewYn = MokaConstants.YES;
}
