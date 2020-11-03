package jmnet.moka.core.tps.mvc.skin.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.relation.dto.RelationSearchDTO;
import jmnet.moka.core.tps.mvc.skin.dto.SkinSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;
import jmnet.moka.core.tps.mvc.skin.vo.SkinVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SkinService {

    /**
     * 스킨목록 조회
     *
     * @param search   검새조건
     * @param pageable 페이징
     * @return 스킨목록
     */
    public Page<Skin> findList(SkinSearchDTO search, Pageable pageable);

    /**
     * 본문스킨정보 조회
     *
     * @param pageSeq 본문스킨순번
     * @return 본문스킨정보
     */
    public Optional<Skin> findBySkinSeq(Long skinSeq);

    /**
     * 기존에 등록된 serviceName 본문스킨 조회
     *
     * @param skinServieName 본문스킨영문명
     * @param domainId       도메인아이디
     * @return 페이지정보
     */
    public List<Skin> findByServiceName(String skinServiceName, String domainId);

    /**
     * <pre>
     * 본문스킨정보 등록
     * </pre>
     *
     * @param page 등록할 본문스킨정보
     * @return 등록된 본문스킨정보
     * @throws TemplateParseException, UnsupportedEncodingException, IOException
     */
    public Skin insertSkin(Skin skin)
            throws TemplateParseException, UnsupportedEncodingException, IOException;

    /**
     * <pre>
     * 연관 본문스킨 조회
     * </pre>
     *
     * @param search 검색조건
     * @return 본문스킨 목록
     */
    public List<SkinVO> findRelList(RelationSearchDTO search);

    /**
     * <pre>
     * 연관 페이지 조회건수
     * </pre>
     *
     * @param search 검색조건
     * @return 페이지 건수
     */
    public Long findRelCount(RelationSearchDTO search);

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
     * 도메인아이디와 관련된 컨텐츠스킨수
     *
     * @param domainId 도메인아이디
     * @return 컨텐츠스킨수
     */
    public int countByDomainId(String domainId);

    Optional<SkinHist> findSkinHistBySeq(Long histSeq);
}
