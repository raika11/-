/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.code.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Embeddable
@ToString
@EqualsAndHashCode
public class JamMastercodePK implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * JAM대분류코드
     */
    @Column(name = "SERVCODE", nullable = false, columnDefinition = "char", insertable = false, updatable = false)
    private String servcode;

    /**
     * JAM중분류코드
     */
    @Column(name = "SECTCODE", nullable = false, columnDefinition = "char", insertable = false, updatable = false)
    private String sectcode;

    /**
     * JAM소분류코드
     */
    @Column(name = "CONTCODE", nullable = false, columnDefinition = "char", insertable = false, updatable = false)
    private String contcode;
}
