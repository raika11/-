package jmnet.moka.core.tps.mvc.ad.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("adVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AdVO implements Serializable {

    private static final long serialVersionUID = 7921548540583492033L;

    @Column(name = "AD_SEQ")
    private Long adSeq;

    @Column(name = "AD_NAME")
    private String adName;

    // DB의 useYn이 아니라 실제로 컴포넌트에서 쓰이는 유무
    @Column(name = "USE_YN")
    private String useYn;

    @Column(name = "AD_LOCATION")
    private String adLocation;

    @Column(name = "REL_ORDER")
    private Integer relOrder;

}
