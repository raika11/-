/**
 * msp-tps SkinVO.java 2020. 7. 8. 오후 4:07:24 ssc
 */
package jmnet.moka.core.tps.mvc.skin.vo;

import java.io.Serializable;

import javax.persistence.Column;

import org.apache.ibatis.type.Alias;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("SkinVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SkinVO implements Serializable {

    private static final long serialVersionUID = -8590517726596159762L;

    @Column(name = "SKIN_SEQ")
    private Long skinSeq;

    @Column(name = "SKIN_NAME")
    private String skinName;

    @Column(name = "SKIN_SERVICE_NAME")
    private String skinServiceName;

    private DomainSimpleDTO domain;
}
