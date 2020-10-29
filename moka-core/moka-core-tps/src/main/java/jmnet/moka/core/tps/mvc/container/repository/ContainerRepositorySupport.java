package jmnet.moka.core.tps.mvc.container.repository;

import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 컨테이너 레포지토리 구현 클래스
 *
 * @author ohtah
 */
public interface ContainerRepositorySupport {

    /**
     * <pre>
     * 검색조건에 해당하는 아이템을 사용중인 컨테이너 목록 조회(부모찾기)
     *   : 컴포넌트,템플릿,데이타셋,광고에서 사용하는 함수
     * </pre>
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 컨테이너 목록
     */
    public Page<Container> findRelList(RelationSearchDTO search, Pageable pageable);

    //public Page<Container> findList(ContainerSearchDTO search, Pageable pageable);

    //페이지에서 사용중인 컨테이너 목록 조회(자식찾기)
    //: 페이지에서 사용하는 함수
    //public Page<Container> findPageChildRels(ContainerSearchDTO search, Pageable pageable);

    // 콘텐츠스킨에서 사용중인 컨테이너 목록 조회(자식찾기)
    //   : 콘텐츠스킨에서 사용하는 함수
    //public Page<Container> findSkinChildRels(ContainerSearchDTO search, Pageable pageable);
}
