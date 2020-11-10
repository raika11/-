/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
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
 * Description: 편집영역 컴포넌트 로딩 결과 DTO
 *
 * @author ohtah
 * @since 2020. 11. 5.
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
    private String byPageMessage;

    /**
     * 페이지에 컨테이너가 없다면, true
     */
    @Builder.Default
    private Boolean byContainer = false;

    /**
     * 페이지에 컨테이너가 없다면, 메세지있음
     */
    private String byContainerMessage;

    /**
     * 컨테이너에 컴포넌트가 없다면, true
     */
    @Builder.Default
    private Boolean byContainerComp = false;

    /**
     * 컨테이너에 컴포넌트가 없다면, 메세지있음
     */
    private String byContainerCompMessage;

}
