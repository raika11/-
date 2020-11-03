/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 * 히스토리 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 21. 오전 11:17:30
 */
@Alias("HistSimpleVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistSimpleVO implements Serializable {

    private static final long serialVersionUID = -6295381817079217210L;

    public static final Type TYPE = new TypeReference<List<HistSimpleVO>>() {
    }.getType();

    @Column(name = "SEQ")
    private Long seq;

    private DomainSimpleDTO domain;

    @Column(name = "WORK_TYPE")
    private String workType;

    @Column(name = "REG_DT")
    @DTODateTimeFormat
    private Date regDt;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "REG_NM")
    private String regNm;
}
