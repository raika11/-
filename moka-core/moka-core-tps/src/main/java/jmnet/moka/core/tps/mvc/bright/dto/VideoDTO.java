/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.bright.dto;

import java.util.Date;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.Builder;

/**
 * Description: OVP 정보
 *
 * @author ssc
 * @since 2020-12-04
 */
public class VideoDTO {

    private Long id;

    private String thumbFileName;
    private Integer thumbWidth = 0;
    private Integer thumbHeight = 0;

    private String name;

    @Builder.Default
    private String state = "ACTIVE";

    @DTODateTimeFormat
    private Date regDt;

}
