package jmnet.moka.core.tps.mvc.etccode.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jmnet.moka.core.tps.mvc.etccode.dto.EtccodeSearchDTO;
import jmnet.moka.core.tps.mvc.etccode.entity.Etccode;
import jmnet.moka.core.tps.mvc.etccode.entity.EtccodeType;

/**
 * <pre>
 * 기타코트 Service
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오후 6:16:50
 * @author jeon
 */
public interface EtccodeService {

    /**
     * <pre>
     * Type별로 사용중인 공통코드목록을 조회한다.
     * </pre>
     * 
     * @param codeTypeId 그룹아이디
     * @return 코드목록
     */
    public List<Etccode> findUseList(String codeTypeId);

    /**
     * <pre>
     * Type별로 사용중인 공통코드목록을 조회한다.
     * </pre>
     * 
     * @param search 검색조건
     * @param pageable 페이징
     * @return 코드목록
     */
    public Page<Etccode> findList(EtccodeSearchDTO search, Pageable pageable);

    /**
     * <pre>
      * 그룹 목록 조회
     * </pre>
     * 
     * @param search 페이징조건
     * @param pageable 페이징
     * @return 그룹 목록
     */
    public Page<EtccodeType> findTypeList(Pageable pageable);

    /**
     * <pre>
     * 그룹정보 조회
     * </pre>
     * 
     * @param codeTypeSeq 그룹아이디순번
     * @return 코드정보
     */
    public Optional<EtccodeType> findByCodeTypeSeq(Long codeTypeSeq);

    /**
     * <pre>
     * 그룹등록
     * </pre>
     * 
     * @param etccodeType 그룹정보
     * @return 그룹정보
     */
    public EtccodeType insertEtccodeType(EtccodeType etccodeType);

    /**
     * <pre>
     * 그룹수정
     * </pre>
     * 
     * @param etccodeType 그룹정보
     * @return 그룹정보
     */
    public EtccodeType updateEtccodeType(EtccodeType etccodeType);

    /**
     * <pre>
      * 그룹 삭제
     * </pre>
     * 
     * @param etccodeType 그룹정보
     * @param name 사용자
     */
    public void deleteEtccodeType(EtccodeType etccodeType, String name);

    /**
     * <pre>
     * 하위코드목록개수
     * </pre>
     * 
     * @param codeTypeId 그룹아이디
     * @return 코드갯수
     */
    public Long countEtccodeByCodeTypeId(String codeTypeId);

    /**
     * 코드정보 조회
     * 
     * @param seq 코드순번
     * @return 코드정보
     */
    public Optional<Etccode> findBySeq(Long seq);

    /**
     * 코드정보 등록
     * 
     * @param etccode 코드정보
     * @return 코드정보
     */
    public Etccode insertEtccode(Etccode etccode);

    /**
     * 코드정보수정
     * 
     * @param etccode 코드정보
     * @return 코드정보
     */
    public Etccode updateEtccode(Etccode etccode);

    /**
     * 코드정보 삭제
     * 
     * @param etccode 코드정보
     * @param name 사용자
     */
    public void deleteEtccode(Etccode etccode, String name);

    /**
     * <pre>
      * 일치하는 그룹아이디 조회
     * </pre>
     * 
     * @param codeTypeId 그룹아이디
     * @return 그룹갯수
     */
    public Long countEtccodeTypeByCodeTypeId(String codeTypeId);

    /**
     * <pre>
      * 일치하는 코드아이디 조회
     * </pre>
     * 
     * @param codeTypeId 그룹아이디
     * @param codeId 코드아이디
     * @return 일치하는 코드갯수
     */
    public Long countEtccodeByCodeId(String codeTypeId, String codeId);
    
    /**
     * <pre>
     * 코드아이디로 Etccode 조회
     * </pre>
     * 
     * @param codeId codeId
     * @return Etccode
     */
    public Optional<Etccode> findByCodeId(String codeId);

}
