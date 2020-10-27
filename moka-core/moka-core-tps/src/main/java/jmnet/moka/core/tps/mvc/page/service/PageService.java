package jmnet.moka.core.tps.mvc.page.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.page.dto.PageNode;
import jmnet.moka.core.tps.mvc.page.dto.PageSearchDTO;
import jmnet.moka.core.tps.mvc.page.entity.Page;
import jmnet.moka.core.tps.mvc.page.entity.PageHist;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import org.springframework.data.domain.Pageable;

/**
 * 페이지 서비스
 */
public interface PageService {
    /**
     * 페이지트리조회
     *
     * @param search 검색정보
     * @return 페이지목록
     */
    public PageNode makeTree(PageSearchDTO search);

    /**
     * 페이지정보 조회
     *
     * @param pageSeq 페이지순번
     * @return 페이지정보
     */
    public Optional<Page> findPageBySeq(Long pageSeq);

    /**
     * 페이지정보 등록
     *
     * @param page 등록할 페이지정보
     * @return 등록된 페이지정보
     * @throws TemplateParseException, UnsupportedEncodingException, IOException
     */
    public Page insertPage(Page page)
            throws TemplateParseException, UnsupportedEncodingException, IOException;

    /**
     * 페이지정보 수정
     *
     * @param page 수정할 페이지정보
     * @return 수정된 페이지정보
     * @throws TemplateParseException, IOException
     */
    public Page updatePage(Page page)
            throws Exception;

    /**
     * 페이지정보 삭제
     *
     * @param page     삭제 할 페이지
     * @param userName 삭제하는 작업자아이디
     */
    public void deletePage(Page page, String userName);

    /**
     * 기존에 등록된 pageUrl 페이지조회
     *
     * @param pageUrl  페이지주소
     * @param domainId 도메인아이디
     * @return 페이지정보
     */
    public List<Page> findPageByPageUrl(String pageUrl, String domainId);

    /**
     * 페이지 히스토리 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 히스토리 목록
     */
    public org.springframework.data.domain.Page<PageHist> findAllPageHist(HistSearchDTO search, Pageable pageable);

    /**
     * 페이지 히스토리 상세 조회
     *
     * @param histSeq 히스토리SEQ
     * @return 히스토리 목록
     */
    public Optional<PageHist> findPageHistBySeq(Long histSeq);

    /**
     * 페이지 목록 조회
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 페이지 목록
     */
    public org.springframework.data.domain.Page<Page> findAllPage(PageSearchDTO search, Pageable pageable);

    /**
     * 관련 페이지 조회
     *
     * @param search 검색조건
     * @return 페이지 목록
     */
    public List<PageVO> findAllPageRel(RelSearchDTO search);

    /**
     * 관련 페이지 조회건수
     *
     * @param search 검색조건
     * @return 페이지 건수
     */
    public Long countPageRel(RelSearchDTO search);

    /**
     * 도메인아이디와 관련된 페이지 목록 조회
     *
     * @param domainId 도메인아이디
     * @param pageable 페이지
     * @return 페이지 목록
     */
    public org.springframework.data.domain.Page<Page> findPageByDomainId(String domainId, Pageable pageable);

    /**
     * 컴포넌트정보 변경에 따른, 관련아이템 업데이트
     *
     * @param newComponent 변경된 컴포넌트
     * @param orgComponent 원본 컴포넌트
     */
    public void updatePageRelItems(Component newComponent, Component orgComponent);
}
