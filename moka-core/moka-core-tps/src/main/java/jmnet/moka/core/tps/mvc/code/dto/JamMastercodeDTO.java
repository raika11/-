/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.code.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
@JsonIgnoreProperties(ignoreUnknown = true)
public class JamMastercodeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<JamMastercodeDTO>>() {
    }.getType();

    /**
     * JAM대분류코드
     */
    private String servcode;

    /**
     * JAM중분류코드
     */
    private String sectcode;

    /**
     * JAM소분류코드
     */
    private String contcode;

    /**
     * JAM대분류영문명
     */
    private String servcodeEng;

    /**
     * JAM중분류영문명
     */
    private String sectcodeEng;

    /**
     * JAM소분류영문명
     */
    private String contcodeEng;

    /**
     * JAM대분류한글명
     */
    private String servcodeKor;

    /**
     * JAM중분류한글명
     */
    private String sectcodeKor;

    /**
     * JAM소분류한글명
     */
    private String contcodeKor;
}
