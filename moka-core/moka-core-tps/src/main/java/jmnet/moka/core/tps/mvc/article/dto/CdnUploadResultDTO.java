/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.article.dto;

import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: cdn업로드 결과 정보 DTO
 *
 * @author ssc
 * @since 2021-01-03
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("CdnUploadResultDTO")
@ApiModel("cdn업로드 결과 정보 DTO")
public class CdnUploadResultDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Builder.Default
    private boolean success = false;

    private String cdnUrl;

    private String redirectUrl;
}
