package jmnet.moka.core.tms.mvc.domain;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.item.DomainItem;

/**
 * <pre>
 * 도메인에 관한 정보를 관리한다.
 * 2020. 3. 10. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 3. 10. 오후 2:34:12
 * @author kspark
 */
public interface DomainResolver {

    /**
     * 
     * <pre>
     * 도메인 정보를 로딩한다
     * </pre>
     */
    void loadDomain() throws TmsException;

    /**
     * <pre>
     * 도메인 url로 도메인정보를 가져온다.
     * </pre>
     * 
     * @param domainUrl 도메인 url
     * @return 도메인정보
     */
    DomainItem getDomainInfoByUrl(String domainUrl);

    /**
     * 
     * <pre>
     * 도메인 id로 도메인정보를 가져온다.
     * </pre>
     * 
     * @param domainId 도메인id
     * @return 도메인정보
     */
    DomainItem getDomainInfoById(String domainId);

    /**
     * <pre>
     * 도메인정보 리스트를 반환한다.
     * </pre>
     * 
     * @return 도메인정보 리스트
     */
    List<DomainItem> getDomainInfoList();

    /**
     * <pre>
     * http 요청에 대한 도메인 id를 반환한다.
     * </pre>
     * 
     * @param request http요청
     * @return domain id
     */
    String getDomainId(HttpServletRequest request);

    /**
     * <pre>
     * 도메인에 설정된 예약어를 반환한다.
     * </pre>
     * 
     * @param domainId
     * @return 코드 정보
     */
    ReservedMap getReservedMap(String domainId);


    /**
     * <pre>
     * 도메인에 설정된 예약어를 purge한다.
     * </pre>
     * 
     * @param domainId
     */
    void purgeReserveMap(String domainId);

}
