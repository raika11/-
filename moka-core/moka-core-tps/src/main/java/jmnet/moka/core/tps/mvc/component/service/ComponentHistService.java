package jmnet.moka.core.tps.mvc.component.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ComponentHistService {

    /**
     * 컴포넌트Id로 히스토리 목록 조회
     *
     * @param componentSeq 컴포넌트Id
     * @param pageable     Pageable
     * @return 히스토리
     */
    Page<ComponentHist> findAllComponentHist(Long componentSeq, Pageable pageable);

    /**
     * 컴포넌트 히스토리 등록
     *
     * @param history 컴포넌트 히스토리
     * @return 히스토리
     * @throws Exception 에러
     */
    ComponentHist insertComponentHist(ComponentHist history)
            throws Exception;


    /**
     * 여러개의 히스토리를 한번에 등록
     *
     * @param maybeHistories 히스토리 리스트 또는 컴포넌트 리스트
     * @param histPublishDTO 임시저장/전송/예약 정보
     * @return 히스토리 리스트
     * @throws Exception 에러
     */
    List<ComponentHist> insertComponentHistList(List<?> maybeHistories, HistPublishDTO histPublishDTO)
            throws Exception;

    /**
     * 컴포넌트 히스토리 등록
     *
     * @param component      컴포넌트
     * @param histPublishDTO 임시저장/전송/예약 정보
     * @return
     * @throws Exception
     */
    ComponentHist insertComponentHist(Component component, HistPublishDTO histPublishDTO)
            throws Exception;

    /**
     * 히스토리에서 데스크 데이터셋 찾기위해, 전송된 마지막 히스토리 조회
     *
     * @param componentSeq 컴포넌트SEQ
     * @param dataType     데이타타입
     * @return 컴포넌트히스토리
     */
    List<ComponentHist> findLastHist(Long componentSeq, String dataType)
            throws Exception;

    Optional<ComponentHist> findComponentHistBySeq(Long seq);

    //    /**
    //     * 예약된 컴포넌트 존재여부 조회
    //     *
    //     * @param componentSeq 컴포넌트SEQ
    //     * @return 예약컴포넌트 히스토리 존재여부. 있으면 true
    //     */
    //    boolean existsReserveComponentSeq(Long componentSeq);

    /**
     * 예약된 컴포넌트 삭제
     *
     * @param componentSeq 컴포넌트SEQ
     */
    void deleteByReserveComponentSeq(Long componentSeq)
            throws Exception;
}
