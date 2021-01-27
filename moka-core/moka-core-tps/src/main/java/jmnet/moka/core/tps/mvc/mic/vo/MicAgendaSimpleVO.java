/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 시민마이크 아젠다 Simple
 */
@Alias("MicAgendaSimpleVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicAgendaSimpleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 아젠다일련번호
     */
    @Min(value = 0, message = "{tps.agenda.error.min.agndSeq}")
    @Column(name = "AGND_SEQ", nullable = false)
    private Long agndSeq;

    /**
     * 정렬순서
     */
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

}
