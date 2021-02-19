/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.rcvArticle.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * Description: 선데이/중앙 조판기사(XML) DTO
 *
 * @author ssc
 * @since 2021-02-18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Alias("RcvArticleJiXmlDTO")
public class RcvArticleJiXmlDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<RcvArticleJiXmlDTO>>() {
    }.getType();

    RcvArticleJiXmlId id;

    /**
     * 출판일자
     */
    private String pressDate;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 수신기사xml본문
     */
    private String xmlBody;
}
