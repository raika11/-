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
 * 히스토리 정보
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

    /**
     * 히스토리 일련번호
     */
    @Column(name = "SEQ")
    private Long seq;

    /**
     * 도메인
     */
    private DomainSimpleDTO domain;

    /**
     * 작업유형 I/U/D
     */
    @Column(name = "WORK_TYPE")
    private String workType;

    /**
     * 작업일자
     */
    @Column(name = "REG_DT")
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 작업자ID
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 작업자명
     */
    @Column(name = "REG_NM")
    private String regNm;
}
