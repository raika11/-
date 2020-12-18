/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.code.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JAM분류코드
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_JAM_MASTERCODE")
public class JamMastercode implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    @Builder.Default
    private JamMastercodePK id = new JamMastercodePK();

    /**
     * JAM대분류영문명
     */
    @Column(name = "SERVCODE_ENG", nullable = false)
    private String servcodeEng;

    /**
     * JAM중분류영문명
     */
    @Column(name = "SECTCODE_ENG", nullable = false)
    private String sectcodeEng;

    /**
     * JAM소분류영문명
     */
    @Column(name = "CONTCODE_ENG", nullable = false)
    private String contcodeEng;

    /**
     * JAM대분류한글명
     */
    @Column(name = "SERVCODE_KOR", nullable = false)
    private String servcodeKor;

    /**
     * JAM중분류한글명
     */
    @Column(name = "SECTCODE_KOR", nullable = false)
    private String sectcodeKor;

    /**
     * JAM소분류한글명
     */
    @Column(name = "CONTCODE_KOR", nullable = false)
    private String contcodeKor;

}
