package jmnet.moka.core.tms.mvc.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.DomainItem;

/**
 * <pre>
 * 요청된 url에 대한 도메인 정보와 코드정보를 관리하며 제공한다.
 * 2020. 2. 19. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 2. 19. 오전 8:40:06
 * @author kspark
 */
public abstract class AbstractDomainResolver implements DomainResolver {
    public static final Logger logger = LoggerFactory.getLogger(AbstractDomainResolver.class);

    protected static final ReservedMap EMPTY_RESERVED_MAP = new ReservedMap(0L);
    protected HashMap<String, DomainItem> domainItemMapByUrl;
    protected HashMap<String, DomainItem> domainItemMapById;
    protected HashMap<String, ReservedMap> allReservedMap;
    protected List<DomainItem> domainItemList;
    protected boolean domainLoaded = false;

    public AbstractDomainResolver() {
        this.domainItemList = new ArrayList<DomainItem>(8);
        this.domainItemMapByUrl = new HashMap<String, DomainItem>(64);
        this.domainItemMapById = new HashMap<String, DomainItem>(64);
        this.allReservedMap = new HashMap<String, ReservedMap>(64);
    }

    public DomainItem getDomainInfoByUrl(String domainUrl) {
        return this.domainItemMapByUrl.get(domainUrl);
    }

    public DomainItem getDomainInfoById(String domainId) {
        return this.domainItemMapById.get(domainId);
    }

    public List<DomainItem> getDomainInfoList() {
        return this.domainItemList;
    }

    /**
     * <pre>
     * http 요청에 대한 도메인 id를 반환한다.
     * </pre>
     * 
     * @param request http요청
     * @return domain id
     */
    public String getDomainId(HttpServletRequest request) {
        // 도메인정보가 load되지 않았을 경우 다시 로딩을 시도한다.
        if (this.domainLoaded == false) {
            try {
                this.loadDomain();
            } catch (TmsException e) {
                logger.warn("Domain load failed : {}", e);
                return null;
            }
        }
        String host = request.getHeader("Host");
        // port는 제거함
        if (host.contains(":")) {
            host = host.split(":")[0];
        }
        DomainItem domainItem = getDomainInfoByUrl(host);
        if (domainItem != null) {
            return domainItem.getString(ItemConstants.DOMAIN_ID);
        } else {
            return null;
        }
    }

    public void purgeReserveMap(String domainId) {
        ReservedMap newReservedMap = this.loadReservedMap(domainId);
        this.allReservedMap.put(domainId, newReservedMap);
    }

    /**
     * <pre>
     * 도메인에 설정된 예약어 정보를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return 코드 정보
     */
    public abstract ReservedMap getReservedMap(String domainId);

    /**
     * <pre>
     * 도메인에 설정된 예약어 정보를 적재한다.
     * </pre>
     * 
     * @param domainId 도메인 id
     * @return 코드 정보
     */
    protected abstract ReservedMap loadReservedMap(String domainId);
}
