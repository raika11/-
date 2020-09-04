package jmnet.moka.core.tps.mvc.component.service;

import java.util.LinkedHashSet;
import java.util.Set;
import jmnet.moka.core.tps.mvc.component.entity.ComponentAd;

/**
 * ComponentAd Service
 * 
 * @author 전현지
 *
 */
public interface ComponentAdService {

    /**
     * 컴포넌트ID로 컴포넌트광고를 지운다
     * 
     * @param componentSeq 컴포넌트ID
     * @throws Exception 에러
     */
    public void deleteByComponentSeq(Long componentSeq) throws Exception;

    /**
     * 컴포넌트ID로 컴포넌트광고 목록을 조회한다
     * 
     * @param componnentSeq 컴포넌트ID
     * @return 컴포넌트광고 목록
     */
    public LinkedHashSet<ComponentAd> findByComponentSeq(Long componnentSeq);

    /**
     * 컴포넌트광고 추가
     * 
     * @param ads 컴포넌트광고리스트
     * @return 컴포넌트광고리스트
     * @throws Exception 에러
     */
    public Set<ComponentAd> insertComponentAdList(Set<ComponentAd> ads) throws Exception;

    /**
     * 컴포넌트광고 수정
     * 
     * @param newAds 새로운 리스트
     * @param orgAds 원래 리스트
     * @return 컴포넌트광고리스트
     * @throws Exception 에러
     */
    public Set<ComponentAd> updateComponentAdList(Set<ComponentAd> newAds, Set<ComponentAd> orgAds)
            throws Exception;
}
