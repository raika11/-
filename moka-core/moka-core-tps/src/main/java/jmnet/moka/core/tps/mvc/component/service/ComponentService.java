package jmnet.moka.core.tps.mvc.component.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.dto.ComponentSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.vo.ComponentVO;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 컴포넌트 서비스
 */
public interface ComponentService {

    /**
     * 컴포넌트 목록 조회(MyBatis)
     *
     * @param search 검색조건
     * @return 컴포넌트 목록
     */
    public List<ComponentVO> findAllComponent(ComponentSearchDTO search);

    /**
     * 데이터셋ID로 컴포넌트 조회
     *
     * @param datasetSeq 데이터셋ID
     * @param pageable   Pageable
     * @return 컴포넌트 목록
     */
    public Page<Component> findComponentByDataset_DatasetSeq(Long datasetSeq, Pageable pageable);

    /**
     * 데이터타입, 데이터셋ID로 컴포넌트 조회
     *
     * @param dataType   데이터타입
     * @param datasetSeq 데이터셋ID
     * @return 컴포넌트
     */
    public Optional<Component> findComponentByDataTypeAndDataset_DatasetSeq(String dataType, Long datasetSeq);

    /**
     * 파라미터 datasetSeq를 쓰고 있는 컴포넌트가 있으면 true, 없으면 false
     *
     * @param datasetSeq 데이터셋ID
     * @return 컴포넌트 존재 유무
     */
    public boolean usedByDatasetSeq(Long datasetSeq);

    /**
     * 컴포넌트 조회
     *
     * @param componentSeq 컴포넌트순번
     * @return 컴포넌트
     * @throws NoDataException 데이터없음 예외처리
     */
    public Optional<Component> findComponentBySeq(Long componentSeq);

    /**
     * 컴포넌트 등록
     *
     * @param component 등록할 컴포넌트
     * @param histPublishDTO    임시저장/전송/예약 정보
     * @return 등록된 컴포넌트
     * @throws NoDataException 데이터 없음
     * @throws Exception       예외
     */
    public Component insertComponent(Component component, HistPublishDTO histPublishDTO)
            throws NoDataException, Exception;

    /**
     * 여러개의 컴포넌트 등록
     *
     * @param components 등록할 컴포넌트 리스트
     * @param histPublishDTO    임시저장/전송/예약 정보
     * @return 등록된 컴포넌트 리스트
     * @throws Exception 에러
     */
    public List<Component> insertComponents(List<Component> components, HistPublishDTO histPublishDTO)
            throws Exception;

    /**
     * 컴포넌트 업데이트
     *
     * @param component      새로운 컴포넌트
     * @param histPublishDTO    임시저장/전송/예약 정보
     * @return
     * @throws Exception 예외
     */
    public Component updateComponent(Component component, HistPublishDTO histPublishDTO)
            throws Exception;

    /**
     * 컴포넌트 업데이트(프런트에서 컴포넌트 수정할 때 사용)
     *
     * @param newComponent      새로운 컴포넌트
     * @param orgComponent      원래 컴포넌트
     * @param histPublishDTO    임시저장/전송/예약 정보
     * @return
     * @throws Exception 예외
     */
    public Component updateComponent(Component newComponent, Component orgComponent, HistPublishDTO histPublishDTO)
            throws Exception;

    /**
     * 컴포넌트 삭제
     *
     * @param seq 컴포넌트아이디
     * @throws NoDataException 데이터없음
     * @throws Exception       예외
     */
    public void deleteComponent(Long seq)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 삭제
     *
     * @param component 컴포넌트
     * @throws Exception 예외
     */
    public void deleteComponent(Component component)
            throws Exception;

    /**
     * 관련 컴포넌트 조회
     *
     * @param search   검색조건
     * @param pageable Pageable
     * @return 컴포넌트 목록
     */
    public Page<Component> findAllComponentRel(RelationSearchDTO search, Pageable pageable);

    /**
     * 도메인아이디와 관련된 컴포넌트수
     *
     * @param domainId 도메인아이디
     * @return 컴포넌트수
     */
    public int countComponentByDomainId(String domainId);
}
