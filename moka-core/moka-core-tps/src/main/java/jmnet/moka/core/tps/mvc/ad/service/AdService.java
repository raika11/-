package jmnet.moka.core.tps.mvc.ad.service;

import java.util.List;
import jmnet.moka.core.tps.mvc.ad.dto.AdSearchDTO;
import jmnet.moka.core.tps.mvc.ad.vo.AdVO;

public interface AdService {
    
    /**
     * 광고 목록 조회(Mybatis)
     * @param search 검색조건
     * @return 광고VO 목록
     */
    public List<AdVO> findList(AdSearchDTO search);
    
    /**
     * 광고 갯수 조회(Mybatis)
     * @param search 검색조건
     * @return 광고건수
     */
    public Long findListCount(AdSearchDTO search);
        
    /**
     * 도메인아이디와 관련된 광고수
     * @param domainId 도메인아이디
     * @return 광고수
     */
    public int countByDomainId(String domainId);
}
