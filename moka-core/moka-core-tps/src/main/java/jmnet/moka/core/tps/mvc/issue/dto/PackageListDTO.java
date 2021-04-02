/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.issue.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

/**
 * Description: 패키지의 기사
 *
 * @author ssc
 * @since 2021-04-02
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder(toBuilder = true)
@Alias("PackageListDTO")
public class PackageListDTO {

    public static final Type TYPE = new TypeReference<List<PackageListDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    private Long seqNo;

    private String catDiv;

    private Long ordNo;

    private Long totalId;

    private String title;
    
}
