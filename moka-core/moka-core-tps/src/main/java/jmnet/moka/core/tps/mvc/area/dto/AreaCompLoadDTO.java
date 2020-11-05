/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.area.dto;

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
 * 편집영역 컴포넌트 로딩 결과 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AreaCompLoadDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<AreaCompLoadDTO>>() {
    }.getType();

    /**
     * 페이지에 컴포넌트가 없다면, true
     */
    @Builder.Default
    private Boolean byPage = false;

    /**
     * 페이지에 컴포넌트가 없다면, 메세지있음
     */
    @Builder.Default
    private String byPageMessage;

    /**
     * 컨테이너에 컴포넌트가 없다면, true
     */
    @Builder.Default
    private Boolean byContainer = false;

    /**
     * 페이지에 컴포넌트가 없다면, 메세지있음
     */
    @Builder.Default
    private String byComponentMessage;

}
