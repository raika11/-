package jmnet.moka.core.tps.mvc.codemgt.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtDtlDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtGrpSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.dto.CodeMgtSearchDTO;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeMgtGrp;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeSimple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 * 기타코트 Service
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 4. 14. 오후 6:16:50
 */
public interface CodeMgtService {

    /**
     * <pre>
     * Type별로 사용중인 공통코드목록을 조회한다.
     * </pre>
     *
     * @param grpCd 그룹아이디
     * @return 코드목록
     */
    public List<CodeMgt> findUseList(String grpCd);

    /**
     * 그룹 코드에 해당되는 코드목록을 Simple 클래스 목록으로 조회한다.
     *
     * @param grpCd 그룹아이디
     * @return 코드목록
     */
    public List<CodeSimple> findUseSimpleList(String grpCd);

    /**
     * <pre>
     * Type별로 사용중인 공통코드목록을 조회한다.
     * </pre>
     *
     * @param search   검색조건
     * @param pageable 페이징
     * @return 코드목록
     */
    public Page<CodeMgt> findAllCodeMgt(CodeMgtSearchDTO search, Pageable pageable);

    /**
     * <pre>
     * 그룹 목록 조회
     * </pre>
     *
     * @param search 검색조건
     * @return 그룹 목록
     */
    public Page<CodeMgtGrp> findAllCodeMgtGrp(CodeMgtGrpSearchDTO search);

    /**
     * <pre>
     * 그룹정보 조회
     * </pre>
     *
     * @param seqNo 그룹아이디순번
     * @return 코드정보
     */
    public Optional<CodeMgtGrp> findByGrpSeqNo(Long seqNo);

    /**
     * <pre>
     * 그룹등록
     * </pre>
     *
     * @param codeMgtGrp 그룹정보
     * @return 그룹정보
     */
    public CodeMgtGrp insertCodeMgtGrp(CodeMgtGrp codeMgtGrp);

    /**
     * <pre>
     * 그룹수정
     * </pre>
     *
     * @param codeMgtGrp 그룹정보
     * @return 그룹정보
     */
    public CodeMgtGrp updateCodeMgtGrp(CodeMgtGrp codeMgtGrp);

    /**
     * <pre>
     * 그룹 삭제
     * </pre>
     *
     * @param codeMgtGrp 그룹정보grpCd
     */
    public void deleteCodeMgtGrp(CodeMgtGrp codeMgtGrp);

    /**
     * <pre>
     * 하위코드목록개수
     * </pre>
     *
     * @param grpCd 그룹아이디
     * @return 코드갯수
     */
    public Long countCodeMgtByGrpCd(String grpCd);

    /**
     * 코드정보 조회
     *
     * @param seqNo 코드순번
     * @return 코드정보
     */
    public Optional<CodeMgt> findBySeqNo(Long seqNo);

    /**
     * 코드정보 등록
     *
     * @param codeMgt 코드정보
     * @return 코드정보
     */
    public CodeMgt insertCodeMgt(CodeMgt codeMgt);

    /**
     * 코드정보수정
     *
     * @param codeMgt 코드정보
     * @return 코드정보
     */
    public CodeMgt updateCodeMgt(CodeMgt codeMgt);

    /**
     * 코드정보 삭제
     *
     * @param codeMgt 코드정보
     */
    public void deleteCodeMgt(CodeMgt codeMgt);

    /**
     * <pre>
     * 일치하는 그룹아이디 조회
     * </pre>
     *
     * @param grpCd 그룹아이디
     * @return 그룹갯수
     */
    int countCodeMgtGrpByGrpCd(String grpCd);

    /**
     * <pre>
     * 일치하는 코드아이디 조회
     * </pre>
     *
     * @param grpCd 그룹아이디
     * @param dtlCd 코드아이디
     * @return 일치하는 코드갯수
     */
    public int countCodeMgtByDtlCd(String grpCd, String dtlCd);

    /**
     * <pre>
     * 코드아이디로 CodeMgt 조회
     * </pre>
     *
     * @param dtlCd dtlCd
     * @return CodeMgt
     */
    public Optional<CodeMgt> findByDtlCd(String dtlCd);

    public Optional<CodeMgtGrp> findByGrpCd(String grpCd);

    /**
     * <pre>
     * 코드아이디로 CodeMgt 조회
     * </pre>
     *
     * @param dtlCd dtlCd
     * @return CodeMgt
     */
    List<CodeMgt> findByDtlCd(String grpCd, String dtlCd);

    /**
     * 코드정보수정
     *
     * @param codeMgtDtlDTO 코드정보
     * @return 코드정보
     */
    public CodeMgtDtlDTO updateCodeMgtDtl(CodeMgtDtlDTO codeMgtDtlDTO);

    /**
     * 그룹CD 중복검사
     *
     * @param grpCd 그룹ID
     * @return 중복여부
     */
    boolean isDuplicatedGrpCd(String grpCd);

    /**
     * 코드 중복검사
     *
     * @param grpCd 그룹ID
     * @param dtlCd 코드ID
     * @return 중복여부
     */
    boolean isDuplicatedDtlCd(String grpCd, String dtlCd);
}
