/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.merge.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import jmnet.moka.core.tps.mvc.issue.dto.IssueDeskingComponentDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.ibatis.type.Alias;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2021-04-16
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder(toBuilder = true)
@Alias("IssueDeskingPreviewDTO")
public class IssueDeskingPreviewDTO {

    public static final Type TYPE = new TypeReference<List<IssueDeskingPreviewDTO>>() {
    }.getType();

    private static final long serialVersionUID = 1L;

    String domainId;

    List<IssueDeskingComponentDTO> issueDeskings;
}
