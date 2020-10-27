package jmnet.moka.core.tps.mvc.container.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.container.dto.ContainerSearchDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.entity.ContainerHist;
import jmnet.moka.core.tps.mvc.container.vo.ContainerVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContainerService {
    /**
     * 컨테이너 목록 조회(MyBatis)
     *
     * @param search 검색조건
     * @return 컨테이너 목록
     */
    public List<ContainerVO> findAllContainer(ContainerSearchDTO search);

    /**
     * 컨테이너정보 조회
     *
     * @param containerSeq 컨테이너순번
     * @return 컨테이너정보
     */
    public Optional<Container> findContainerBySeq(Long containerSeq);

    /**
     * 컨테이너정보 등록
     *
     * @param container 등록할 컨테이너정보
     * @return 등록된 컨테이너정보
     * @throws TemplateParseException, UnsupportedEncodingException, IOException
     */
    public Container insertContainer(Container container)
            throws TemplateParseException, UnsupportedEncodingException, IOException;

    /**
     * 컨테이너정보 수정
     *
     * @param container 수정할 컨테이너정보
     * @return 등록된 컨테이너정보
     * @throws TemplateParseException, UnsupportedEncodingException, IOException
     */
    public Container updateContainer(Container container)
            throws Exception;

    /**
     * 컨테이너정보 삭제
     *
     * @param container 컨테이너
     * @param name      사용자명
     */
    public void deleteContainer(Container container, String name);

    /**
     * 컨테이너 히스토리 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 히스토리 목록
     */
    public Page<ContainerHist> findAllContainerHist(HistSearchDTO search, Pageable pageable);

    /**
     * 컨테이너 히스토리 상세 조회
     *
     * @param histSeq 히스토리SEQ
     * @return 히스토리 목록
     */
    Optional<ContainerHist> findContainerHistBySeq(Long histSeq);

    /**
     * <pre>
     * 컴포넌트정보 변경에 따른, 관련아이템 업데이트
     * </pre>
     *
     * @param newComponent 변경된 컴포넌트
     * @param orgComponent 원본 컴포넌트
     */
    public void updateRelItems(Component newComponent, Component orgComponent);

    /**
     * 도메인아이디와 관련된 컨테이너 수
     *
     * @param domainId 도메인아이디
     * @return 컨테이너수
     */
    public int countContainerByDomainId(String domainId);

    /**
     * <pre>
     * 검색조건에 해당하는 아이템을 사용중인 컨테이너 목록 조회(부모찾기)
     *   : 컴포넌트,템플릿,데이타셋,광고에서 사용하는 함수
     * </pre>
     *
     * @param search 검색조건
     * @return 컨테이너 목록
     */
    public Page<Container> findAllContainerRel(RelSearchDTO search, Pageable pageable);

}
