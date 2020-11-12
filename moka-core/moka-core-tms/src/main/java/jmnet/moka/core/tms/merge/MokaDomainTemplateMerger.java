package jmnet.moka.core.tms.merge;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.template.loader.AbstractTemplateLoader;

/**
 * <pre>
 * 도메인 단위의 템플릿을 머징한다.
 * 2019. 9. 11. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 11. 오후 5:10:49
 * @author kspark
 */
public class MokaDomainTemplateMerger implements DomainTemplateMerger {

    private static final Logger logger = LoggerFactory.getLogger(MokaDomainTemplateMerger.class);
    private HashMap<String, MokaTemplateMerger> templateMergerMap;
    private DataLoader dataLoader;
    private GenericApplicationContext appContext;


    /**
     * DPS기반의 DomainTemplateMerger를 생성한다.
     * 
     * @param appContext 컨텍스트
     * @param defaultApiHost api호스트
     * @param defaultApiPath api경로
     */
    public MokaDomainTemplateMerger(GenericApplicationContext appContext,
                                    String defaultApiHost, String defaultApiPath) {
        this.appContext = appContext;
        this.templateMergerMap = new HashMap<String, MokaTemplateMerger>(16);
        this.dataLoader =
                appContext.getBean(HttpProxyDataLoader.class, defaultApiHost, defaultApiPath);
        logger.debug("HttpProxyDataLoader Created: {} {}", defaultApiHost, defaultApiPath);
    }

    @Override
    public void loadUri(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        ftm.loadUri();
    }

    @Override
    public Map<String, String> getUri2ItemMap(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getUri2ItemMap();
    }

    @Override
    public StringBuilder merge(String domainId, String itemType, String itemId,
            MergeContext context) throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.merge(itemType, itemId, context);
    }


    public String getItemKey(String domainId, String path)
            throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItemKey(path);
    }

    @Override
    public MergeItem getItem(String domainId, String itemType, String itemId)
            throws TemplateParseException, TemplateMergeException, TemplateLoadException {
        MokaTemplateMerger ftm = getTemplateMerger(domainId);
        return ftm.getItem(itemType, itemId);
    }

    @Override
    public void purgeItem(String domainId, String itemType, String itemId)
            throws TemplateMergeException, TemplateParseException {
        MokaTemplateMerger templateMerger = getTemplateMerger(domainId);
        templateMerger.purgeItem(itemType, itemId);
    }


    /**
     * <pre>
     * 도메인별 TemplateMerger를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return
     * @throws TemplateMergeException
     * @throws TemplateParseException
     */
    public MokaTemplateMerger getTemplateMerger(String domainId)
            throws TemplateMergeException, TemplateParseException {

        MokaTemplateMerger tm = this.templateMergerMap.get(domainId);
        if (tm == null) {
            try {
                if (this.dataLoader != null) {
                    AbstractTemplateLoader templateLoader =
                            this.appContext.getBean(AbstractTemplateLoader.class, domainId);
                    tm = new MokaTemplateMerger(this.appContext, domainId, templateLoader,
                            this.dataLoader);
                    this.templateMergerMap.put(domainId, tm);
                    logger.debug("Domain Template Merger Created : {}", domainId);
                } else {
                    throw new IOException("Domain DataLoader Not Found:" + domainId);
                }
            } catch (IOException e) {
                throw new TemplateMergeException("Domain Template Merger Creation Fail", e);
            }
        }
        return tm;
    }


}
