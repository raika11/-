/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.Column;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.hibernate.validator.constraints.Length;

/**
 * 시민마이크 분류
 */
@Alias("MicAgendaCategoryVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicAgendaCategoryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 카테고리일련번호
     */
    @Min(value = 0, message = "{tps.agenda-category.error.min.catSeq}")
    @Column(name = "CAT_SEQ", nullable = false)
    private Long catSeq;

    /**
     * 카테고리명
     */
    @NotNull(message = "{tps.agenda-category.error.notnull.catNm}")
    @Length(max = 200, message = "{tps.agenda-category.error.len.catNm}")
    @Column(name = "CAT_NM", nullable = false)
    private String catNm;

    /**
     * 정렬순서
     */
    @NotNull(message = "{tps.agenda-category.error.notnull.ordNo}")
    @Column(name = "ORD_NO", nullable = false)
    @Builder.Default
    private Integer ordNo = 1;

    /**
     * 사용여부
     */
    @NotNull(message = "{tps.agenda-category.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.agenda-category.error.pattern.usedYn}")
    @Column(name = "USED_YN", nullable = false)
    private String usedYn;

    //    /**
    //     * 등록일시
    //     */
    //    @DTODateTimeFormat
    //    @Column(name = "REG_DT", nullable = false)
    //    private Date regDt;

}
