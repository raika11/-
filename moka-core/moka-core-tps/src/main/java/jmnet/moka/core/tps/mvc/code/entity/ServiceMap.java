/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.code.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Description: 분류코드(마스터코드) 묶음
 *
 * @author ohtah
 * @since 2020. 11. 7.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_SERVICE_MAP")
public class ServiceMap {

    /**
     * 마스터코드
     */
    @Id
    @Column(name = "MASTER_CODE", nullable = false)
    private String masterCode;

    /**
     * 서비스코드
     */
    @Column(name = "SERVICE_CODE", nullable = false)
    private String serviceCode;

    /**
     * 첫번째코드
     */
    @Column(name = "FRST_CODE", nullable = false)
    private String frstCode;

    /**
     * 두번째코드
     */
    @Column(name = "SCND_CODE", nullable = false)
    private String scndCode;

    /**
     * 첫번째코드한글명
     */
    @Column(name = "FRST_KOR_NM")
    private String frstKorNm;

    /**
     * 두번째코드한글명
     */
    @Column(name = "SCND_KOR_NM")
    private String scndKorNm;

    /**
     * 첫번째코드영문명
     */
    @Column(name = "FRST_ENG_NM")
    private String frstEngNm;

    /**
     * 두번째코드영문명
     */
    @Column(name = "SCND_ENG_NM")
    private String scndEngNm;
}
