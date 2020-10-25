package jmnet.moka.core.tps.mvc.template.vo;

import java.io.Serializable;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jmnet.moka.core.common.MokaConstants;
import lombok.*;
import org.apache.ibatis.type.Alias;

@Alias("TemplateVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateVO implements Serializable {
    
    private static final long serialVersionUID = 8921206765125787780L;

    /**
     * 도메인 플랫폼
     */
    @Column(name = "SERVICE_PLATFORM")
    @Builder.Default
    private String servicePlatform = "P";

    /**
     * 도메인아이디
     */
    @Column(name = "DOMAIN_ID")
    private String domainId;

    /**
     * 도메인명
     */
    @Column(name = "DOMAIN_NAME")
    private String domainName;

    /**
     * 템플릿SEQ
     */
    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    /**
     * 템플릿명
     */
    @Column(name = "TEMPLATE_NAME")
    private String templateName;

    /**
     * 템플릿가로
     */
    @Column(name = "TEMPLATE_WIDTH")
    @Builder.Default
    private Integer templateWidth = 0;

    /**
     * 템플릿썸네일경로
     */
    @Column(name = "TEMPLATE_THUMB")
    private String templateThumb;

    /**
     * 템플릿그룹명
     */
    @Column(name = "TP_ZONE")
    private String tpZone;

    /**
     * 템플릿 사용여부
     */
    @Column(name = "USE_YN")
    @Builder.Default
    private String useYn = MokaConstants.NO;

    /**
     * 삽입된 템플릿 순서 (템플릿을 관련아이템으로 조회시 사용)
     */
    @Column(name = "REL_ORD")
    @Builder.Default
    private Integer relOrd = 1;
}
