/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.history.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 히스토리 정보
 * 2020. 5. 21. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 21. 오전 11:17:30
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class HistDTO implements Serializable {

    private static final long serialVersionUID = -6295381817079217210L;

    public static final Type TYPE = new TypeReference<List<HistDTO>>() {
    }.getType();

    @NotNull(message = "{tps.common.error.invalid.seq}")
    private Long seq;

    @NotNull(message = "{tps.common.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    private String body;

    private String workType;

    @DTODateTimeFormat
    private Date regDt;

    private String regId;
}
