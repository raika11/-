/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.naver.service;

import java.io.IOException;
import javax.xml.stream.XMLStreamException;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.exception.NoDataException;

/**
 * Description: 설명
 *
 * @author ssc
 * @since 2020-12-10
 */
public interface NaverService {

    /**
     * newsStand전송
     *
     * @param source
     * @param areaSeq
     */
    void publishNaverStand(String source, Long areaSeq)
            throws NoDataException, XMLStreamException, IOException, TemplateParseException, DataLoadException, TemplateMergeException;
}
