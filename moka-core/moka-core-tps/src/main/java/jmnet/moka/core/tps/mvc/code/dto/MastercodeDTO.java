/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.code.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class MastercodeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<MastercodeDTO>>() {
    }.getType();

    /**
     * 마스터 분류코드
     */
    private String masterCode;

    /**
     * 대분류 영문명
     */
    private String serviceEngname;

    /**
     * 중분류 영문명
     */
    private String sectionEngname;

    /**
     * 소분류 영문명
     */
    private String contentEngname;

    /**
     * 대분류 한글명
     */
    private String serviceKorname;

    /**
     * 중분류 한글명
     */
    private String sectionKorname;

    /**
     * 소분류 한글명
     */
    private String contentKorname;

    /**
     * 사용여부 : Y/N
     */
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 백오피스 노출여부 : Y/N
     */
    @Builder.Default
    private String viewYn = MokaConstants.YES;

    /**
     * 순서
     */
    @Builder.Default
    private Integer codeOrd = 1;
}
