package jmnet.moka.core.tps.mvc.desking.mapper;

import java.util.List;

import org.apache.ibatis.session.RowBounds;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.common.dto.WorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistGroupVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingRelWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;

public interface DeskingWorkMapper extends BaseMapper<DeskingWorkVO, WorkSearchDTO> {

    /**
     * <pre>
     * 기존의 작업용 편집기사 삭제
     * </pre>
     *
     * @param creator 작업자
     */
    void deleteByCreator(String creator);

    /**
     * <pre>
     * 기존의 작업용 관련편집기사 삭제
     * </pre>
     *
     * @param creator 작업자
     */
    void deleteRelByCreator(String creator);

    /**
     * <pre>
     * 페이지의 편집기사를 작업자용 편집기사로 일괄 등록
     * </pre>
     *
     * @param param 검색조건
     */
    void importDeskingWorks(WorkSearchDTO param);

    /**
     * <pre>
     * 페이지의 관련 편집기사를 작업자용 관련 편집기사로 일괄 등록
     * </pre>
     *
     * @param param 검색조건
     */
    void importDeskingRelWorks(WorkSearchDTO param);

    /**
     * <pre>
     * 페이지의 모든 Work 편집데이타 조회(복수)
     *
     * <pre>
     *
     * @param search 검색조건
     * @return  페이지의 모든 편집기사목록
     */
    List<DeskingWorkVO> findDeskingWorkAll(WorkSearchDTO search);

    /**
     * <pre>
     * 페이지의 모든 Work 관련편집데이타 조회(복수)
     *
     * <pre>
     *
     * @param search 검색조건
     * @return 페이지의 모든 관련편집기사목록
     */
    List<DeskingRelWorkVO> findDeskingRelWorkAll(WorkSearchDTO search);

    /**
     * <pre>
     * Work 편집데이타 조회(단수)
     *
     * <pre>
     *
     * @param search 검색조건
     * @return 페이지의 편집기사목록
     */
    List<DeskingWorkVO> findDeskingWork(WorkSearchDTO search);

    /**
     * <pre>
     * Work 관련편집데이타 조회(단수)
     *
     * <pre>
     *
     * @param search 검색조건
     * @return 페이지의 관련편집기사목록
     */
    List<DeskingRelWorkVO> findDeskingRelWork(WorkSearchDTO search);

    /**
     * 데스킹 히스토리 그룹 목록 조회
     *
     * @param search    검색객체
     * @param rowBounds RowBounds
     * @return 데스킹 히스토리 그룹 목록
     */
    List<DeskingHistGroupVO> findHistGroup(DeskingHistSearchDTO search, RowBounds rowBounds);

    /**
     * 데스킹 히스토리 그룹 목록 카운트 조회
     *
     * @param search 검색객체
     * @return 카운트
     */
    Long countByHistGroup(DeskingHistSearchDTO search);

    /**
     * 데스킹 히스토리 상세 목록 조회
     *
     * @param search 검색객체
     * @return 데스킹 히스토리 상세 목록
     */
    List<DeskingHistVO> findHistDetail(DeskingHistSearchDTO search);

    /**
     * 페이지 내 모든 데스킹 히스토리 그룹 목록 조회
     *
     * @param search    검색객체
     * @param rowBounds RowBounds
     * @return 데스킹 히스토리 그룹 목록
     */
    List<DeskingHistGroupVO> findAllHistGroup(DeskingHistSearchDTO search, RowBounds rowBounds);

    /**
     * <pre>
     * 페이지의 편집기사히스토리를 작업자용 편집기사로 일괄 등록
     * </pre>
     *
     * @param search 검색조건
     */
    void importDeskingWorkFromHist(DeskingHistSearchDTO search);

    /**
     * <pre>
     * 페이지의 관련 편집기사히스토리를 작업자용 관련 편집기사로 일괄 등록
     * </pre>
     *
     * @param search 검색조건
     */
    void importDeskingRelWorkFromHist(DeskingHistSearchDTO search);
}
