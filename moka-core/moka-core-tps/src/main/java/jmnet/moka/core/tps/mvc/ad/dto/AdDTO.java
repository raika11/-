package jmnet.moka.core.tps.mvc.ad.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdDTO implements Serializable {

    private static final long serialVersionUID = 6196628863616063174L;

    public static final Type TYPE = new TypeReference<List<AdDTO>>() {
    }.getType();

    private Long adSeq;

    private String adBody;

    private Integer adDeptNo;

    private String adFileName;

    private Integer adHeight;

    private Integer adWidth;

    private String adLocation;

    private String adName;

    private String adType;

    private String adUseType;

    private String description;

    private DomainSimpleDTO domain;

    private Date periodEndDt;

    private Date periodStartDt;

    private String periodYn;

    private String slideType;

    private String usedYn;

}
