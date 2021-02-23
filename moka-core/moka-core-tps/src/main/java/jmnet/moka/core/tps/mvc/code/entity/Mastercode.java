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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Description: 분류코드 (2/2/3)
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
@Table(name = "TB_MASTERCODE")
public class Mastercode {

    private static final long serialVersionUID = 1L;

    /**
     * 마스터 분류코드
     */
    @Id
    @Column(name = "MASTER_CODE", nullable = false)
    private String masterCode;

    /**
     * 대분류 영문명
     */
    @Column(name = "SERVICE_ENGNAME")
    private String serviceEngname;

    /**
     * 중분류 영문명
     */
    @Column(name = "SECTION_ENGNAME")
    private String sectionEngname;

    /**
     * 소분류 영문명
     */
    @Column(name = "CONTENT_ENGNAME")
    private String contentEngname;

    /**
     * 대분류 한글명
     */
    @Column(name = "SERVICE_KORNAME")
    private String serviceKorname;

    /**
     * 중분류 한글명
     */
    @Column(name = "SECTION_KORNAME")
    private String sectionKorname;

    /**
     * 소분류 한글명
     */
    @Column(name = "CONTENT_KORNAME")
    private String contentKorname;

    /**
     * 사용여부 : Y/N
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 순서
     */
    @Column(name = "CODE_ORD")
    @Builder.Default
    private Integer codeOrd = 1;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.usedYn = this.usedYn == null ? MokaConstants.YES : this.usedYn;
        this.codeOrd = this.codeOrd == null ? 1 : this.codeOrd;
    }
}
