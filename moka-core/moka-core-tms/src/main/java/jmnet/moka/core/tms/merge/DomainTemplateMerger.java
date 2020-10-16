package jmnet.moka.core.tms.merge;

import java.util.Map;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.MergeItem;

public interface DomainTemplateMerger {


    /**
     * 
     * <pre>
     * 도메인별 서비스 uri를 로딩한다.
     * </pre>
     * 
     * @param domainId
     */
    void loadUri(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException;


    /**
     * 
     * <pre>
     * Uri별 아이템 정보를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws TmsException
     */
    Map<String, String> getUri2ItemMap(String domainId)
            throws TemplateMergeException, TemplateParseException, TmsException;

    /**
     * <pre>
     * 머지를 수행한 결과를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @param itemType
     * @param itemId
     * @param context
     * @return
     * @throws TemplateMergeException
     * @throws TemplateParseException
     */
    StringBuilder merge(String domainId, String itemType, String itemId, MergeContext context)
            throws TemplateMergeException, TemplateParseException;

    /**
     * <pre>
     * URL경로로 아이템에 대한 키(domain,itemType,itemId)정보를 생성한다.
     * </pre>
     * 
     * @param domainId
     * @param path
     * @return
     * @throws TemplateMergeException
     * @throws TemplateParseException
     */
    String getItemKey(String domainId, String path)
            throws TemplateMergeException, TemplateParseException;

    /**
     * <pre>
     * 아이템 정보를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @param itemType
     * @param itemId
     * @return
     * @throws TemplateParseException
     * @throws TemplateMergeException
     * @throws TemplateLoadException
     */
    MergeItem getItem(String domainId, String itemType, String itemId)
            throws TemplateParseException, TemplateMergeException, TemplateLoadException;

    /**
     * <pre>
     * 아이템 정보를 purge한다.
     * </pre>
     * 
     * @param domainId
     * @param itemType
     * @param itemId
     * @throws TemplateMergeException
     * @throws TemplateParseException
     */
    void purgeItem(String domainId, String itemType, String itemId)
            throws TemplateMergeException, TemplateParseException;
}
