/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.merge.service;

import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.article.dto.ArticleBasicUpdateDTO;
import jmnet.moka.core.tps.mvc.articlepage.dto.ArticlePageDTO;
import jmnet.moka.core.tps.mvc.page.dto.PageDTO;
import jmnet.moka.core.tps.mvc.rcvArticle.dto.RcvArticleBasicUpdateDTO;

/**
 * Description: merge서비스
 *
 * @author ssc
 * @since 2020-12-03
 */
public interface MergeService {
    String getMergePage(PageDTO pageDto)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergePage(PageDTO pageDto, boolean baseTag)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergePageWork(Long pageSeq, Long areaSeq, String regId, String pageType)
            throws TemplateParseException, DataLoadException, TemplateMergeException, NoDataException;

    String getMergeComponentWork(Long areaSeq, Long componentWorkSeq, String resourceYn, String regId)
            throws Exception;

    String getMergeAreaWork(Long areaSeq, String regId)
            throws Exception;

    String getMergeArticlePage(ArticlePageDTO articlePageDto, Long totalId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergeRcvArticle(Long rid, RcvArticleBasicUpdateDTO updateDto, String domainType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergeUpdateArticle(Long totalId, ArticleBasicUpdateDTO updateDto, String domainType, String artType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergeArticle(Long totalId, String domainType, String artType)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;

    String getMergeArticle(Long totalId, String domainId)
            throws NoDataException, TemplateParseException, DataLoadException, TemplateMergeException;
}
