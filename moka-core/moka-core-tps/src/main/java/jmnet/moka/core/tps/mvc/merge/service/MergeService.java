/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.merge.service;

import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;

/**
 * Description: merge서비스
 *
 * @author ssc
 * @since 2020-12-03
 */
public interface MergeService {
    String getMergePage(PageDTO pageDto)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergePageWork(Long pageSeq, String regId, String pageType)
            throws TemplateParseException, DataLoadException, TemplateMergeException, NoDataException;

    String getMergeComponentWork(Long areaSeq, Long componentWorkSeq, String resourceYn, String regId)
            throws Exception;

    String getMergeAreaWork(Long areaSeq, String regId)
            throws Exception;
}
