package jmnet.moka.core.tms.mvc.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jmnet.moka.core.common.DpsApiConstants;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.loader.HttpProxyDataLoader;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.template.loader.DpsItemFactory;
import jmnet.moka.core.tms.template.loader.DpsTemplateLoader;
import org.springframework.context.support.GenericApplicationContext;

/**
 * <pre>
 * 요청된 url에 대한 도메인 정보와 코드정보를 관리하며 제공한다.
 * 2020. 2. 19. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 2. 19. 오전 8:40:06
 * @author kspark
 */
public class DpsDomainResolver extends AbstractDomainResolver {
    public static final Logger logger = LoggerFactory.getLogger(DpsDomainResolver.class);

    private HttpProxyDataLoader httpProxyDataLoader;
    private static final DpsItemFactory dpsItemFactory = new DpsItemFactory();
    private long reservedExpireTime;

    public DpsDomainResolver(GenericApplicationContext appContext, HttpProxyDataLoader httpProxyDataLoader, long reservedExpireTime) {
        super(appContext);
        try {
            this.httpProxyDataLoader = httpProxyDataLoader;
            this.reservedExpireTime = reservedExpireTime;
            this.loadDomain();
        } catch (Exception e) {
            logger.warn("DomainResolver Creation failed: {}", e.getMessage());
        }
    }

    public void loadDomain() throws TmsException {
        try {
            Map<String, Object> parameterMap = new HashMap<String, Object>();
            JSONResult jsonResult = this.httpProxyDataLoader
                    .getJSONResult(DpsApiConstants.ITEM_DOMAIN, parameterMap, true);
            Object resultObject = jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);

            List<DomainItem> newDomainItemList = dpsItemFactory
                    .getDomainItemList((JSONArray) resultObject, System.currentTimeMillis());

            HashMap<String, DomainItem> newDomainItemMapById = new HashMap<String, DomainItem>(8);
            HashMap<String, DomainItem> newDomainItemMapByUrl = new HashMap<String, DomainItem>(8);

            for (DomainItem domainItem : newDomainItemList) {
                newDomainItemMapByUrl.put(domainItem.getString(ItemConstants.DOMAIN_URL),
                        domainItem);
                String domainId = domainItem.getString(ItemConstants.DOMAIN_ID);
                newDomainItemMapById.put(domainId, domainItem);
            }

            this.domainItemList = newDomainItemList;
            this.domainItemMapById = newDomainItemMapById;
            this.domainItemMapByUrl = newDomainItemMapByUrl;
            this.domainLoaded = true;
        } catch (Exception e) {
            logger.error("Domain Loading Fail: {}",e);
            throw new TmsException("Domain Item load fail by DPS", e);
        }
    }



    /**
     * <pre>
     * 도메인에 설정된 코드정보를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return 코드 정보
     */
    @Override
    public ReservedMap getReservedMap(String domainId) {
        ReservedMap reservedMap = this.allReservedMap.get(domainId);
        if (reservedMap == null) {
            synchronized (this.allReservedMap) {
                if ((reservedMap = this.allReservedMap.get(domainId)) == null) {
                    reservedMap = loadReservedMap(domainId);
                }
            }
            allReservedMap.put(domainId, reservedMap);
        } else {
            if (reservedMap.isExpired()) {
                synchronized (this.allReservedMap) {
                    if ((reservedMap = this.allReservedMap.get(domainId)) == null) {
                        reservedMap = loadReservedMap(domainId);
                    }
                }
            }
        }
        return reservedMap;
    }

    /**
     * <pre>
     * 도메인에 설정된 코드정보를 적재한다.
     * </pre>
     * 
     * @param domainId 도메인 id
     * @return 코드 정보
     */
    @SuppressWarnings("unchecked")
    @Override
    protected ReservedMap loadReservedMap(String domainId) {
        try {
            Map<String, Object> parameterMap = new HashMap<String, Object>();
            parameterMap.put("domainId", domainId);
            JSONResult jsonResult = this.httpProxyDataLoader
                    .getJSONResult(DpsApiConstants.ITEM_RESERVED, parameterMap, true);
            Object resultObject = jsonResult.get(Constants.DEFAULT_LOOP_DATA_SELECT);
            ReservedMap reservedMap = new ReservedMap(this.reservedExpireTime);
            if (resultObject != null && resultObject instanceof JSONArray) {
                String lastModified = null;
                for (JSONObject jsonObject : (List<JSONObject>) resultObject) {
                    Map<String, String> reserved = ResourceMapper.getDefaultObjectMapper()
                            .convertValue(jsonObject, ResourceMapper.TYPEREF_MAP_STRING);

                    String reservedId = reserved.get(ItemConstants.DpsItemConstants.RESERVED_ID);
                    String value = reserved.get(ItemConstants.DpsItemConstants.RESERVED_VALUE);
                    String modified =
                            reserved.get(ItemConstants.DpsItemConstants.RESERVED_MODIFED_YMDT);
                    if (modified != null) {
                        if (lastModified == null || lastModified.compareTo(modified) > 0) {
                            lastModified = modified;
                        }
                    }
                    reservedMap.put(reservedId, value);
                }
                reservedMap.setLastModified(lastModified);
            }
            return reservedMap;
        } catch (Exception e) {
            logger.error("Reserved load error", e);
            return EMPTY_RESERVED_MAP;
        }
    }
}
