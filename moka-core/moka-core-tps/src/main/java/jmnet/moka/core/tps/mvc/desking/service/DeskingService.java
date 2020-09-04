/**
 * msp-tps ScreenService.java 2020. 5. 13. 오후 1:33:34 ssc
 */
package jmnet.moka.core.tps.mvc.desking.service;

import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import jmnet.moka.core.tps.common.dto.WorkSearchDTO;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.component.vo.DeskingComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingRelWork;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistGroupVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingRelWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.EditionVO;

/**
 * <pre>
 * 
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 13. 오후 1:33:34
 * @author ssc
 */
public interface DeskingService {
    /**
     * <pre>
     * 편집데이타를 가지고 있는지 조사
     * </pre>
     * 
     * @param datasetSeq
     * @return 데이타가 있으면 true
     */
    public boolean usedByDatasetSeq(Long datasetSeq);

    /**
     * <pre>
      * Work컴포넌트 초기화(사용자의 work 모두삭제)
     * </pre>
     * 
     * @param pageSeq 페이지순번
     * @param creator 작업자
     */
    public void InitComponentWorks(Long pageSeq, String creator);

    /**
     * <pre>
     * Work컴포넌트와 컴포넌트의 편집데이타 조회(페이지 내의 모든 컴포넌트)
     * </pre>
     * 
     * @param pageSeq 페이지순번
     * @param creator 작업자
     * @return 편집컴포넌트 목록
     */
    public List<DeskingComponentWorkVO> getComponentWorkAll(Long pageSeq, Long editionSeq,
            String creator);

    /**
     * <pre>
      * Work컴포넌트와 컴포넌트의 편집데이타 조회(단일 컴포넌트)
     * </pre>
     * 
     * @param seq work컴포넌트순번
     * @return 편집컴포넌트
     */
    public DeskingComponentWorkVO getComponentWork(Long seq);

    /**
     * Work컴포넌트 조회(컴포넌트의 편집데이터를 조회할지 말지 플래그 받음)
     * 
     * @param seq work컴포넌트순번
     * @param flag 편집데이터 조회할지말지 결정하는 플래그
     * @return 편집컴포넌트
     */
    public DeskingComponentWorkVO getComponentWork(Long seq, boolean flag);

    /**
     * 데스킹 워크를 조회한다
     * 
     * @param seq 데스킹워크 아이디
     * @return 데스킹 워크
     */
    public Optional<DeskingWork> getDeskingWork(Long seq);

    /**
     * <pre>
      * Work컴포넌트의 편집데이타 등록(전송시 사용)
      *   : 기존데이타 삭제->새로운데이타 편집데이타로 등록 -> 편집데이타 히스토리등록
     * </pre>
     * 
     * @param component 컴포넌트
     * @param deskingWorks 편집기사목록
     * @param deskingRelWorks 관련편집기사목록
     * @param creator 작업자
     * @return
     */
    public void updateDesking(Component component, List<DeskingWorkVO> deskingWorks,
            List<DeskingRelWorkVO> deskingRelWorks, String creator);

    /**
     * 데스킹 워크 수정
     * 
     * @param deskingWork 수정할 데스킹워크
     * @return 결과
     */
    public DeskingWork updateDeskingWork(DeskingWork deskingWork);


    /**
     * work 컴포넌트의 정렬순서 변경
     * 
     * @param datasetSeq 데이타셋순
     * @param deskingWorks 편집기사목록
     * @param creator 작업자
     * @param search 편집기사목록 조회용 검색조건
     * @return Work편집기사목록
     */
    public List<DeskingWorkVO> updateDeskingWorkPriority(Long datasetSeq,
            List<DeskingWorkVO> deskingWorks, String creator, WorkSearchDTO search);

    /**
     * <pre>
     * work 편집기사 추가 및 편집기사목록 정렬
     * </pre>
     * 
     * @param deskingWork 추가할 편집기사
     * @param datasetSeq 데이타셋순번
     * @param editionSeq 예약순번
     * @param creator 작업자
     */
    public void insertDeskingWork(DeskingWork deskingWork, Long datasetSeq, Long editionSeq,
            String creator);

    /**
     * <pre>
     * work 편집기사 이동
     * </pre>
     *
     * @param deskingWork 추가할 편집기사
     * @param tgtDatasetSeq target 데이타셋순번
     * @param srcDatasetSeq source 데이타셋순번
     * @param editionSeq 예약순번
     * @param creator 작업자
     */
    public void moveDeskingWork(DeskingWork deskingWork, Long tgtDatasetSeq, Long srcDatasetSeq, Long editionSeq,
                                  String creator);

    /**
     * 저장간격내에 저장한 사람을 조회
     * 
     * @param datasetSeq 데이타셋순번
     * @param interval 저장간격
     * @param creator 작업자
     * @return 작업된 데스킹목록
     */
    public List<Desking> hasOtherSaved(Long datasetSeq, int interval, String creator);

    /**
     * 편집 컴포넌트 수정
     * 
     * @param workVO work컴포넌트정보
     * @param creator 작업자
     * @return 수정된 컴포넌트
     * @throws NoDataException 데이터없음 예외
     * @throws Exception 기타예외
     */
    public Component updateComponent(DeskingComponentWorkVO workVO, String creator)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 저장(전송)
     * 
     * @param workVO work컴포넌트정보
     * @param creator 작업자
     * @throws NoDataException 데이터없음 예외
     * @throws Exception 기타예외
     */
    public void sendComponent(DeskingComponentWorkVO workVO, String creator)
            throws NoDataException, Exception;

    /**
     * work 컴포넌트워크 스냅샷 수정
     * 
     * @param componentWorkSeq work컴포넌트순번
     * @param snapshotYn 스냅샷여부
     * @param snapshotBody 스냅샷HTML
     * @param creator 작업자
     * @return work컴포넌트
     * @throws NoDataException
     * @throws Exception
     */
    public ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn,
            String snapshotBody, String creator) throws NoDataException, Exception;

    /**
     * work 컴포넌트워크 템플릿 수정
     * 
     * @param componentWorkSeq work컴포넌트순번
     * @param templateSeq 변경할 템플릿순번
     * @param creator 작업자
     * @return work컴포넌트
     * @throws NoDataException
     * @throws Exception
     */
    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq,
            String creator) throws NoDataException, Exception;

    /**
     * work 편집기사 삭제(VO로 삭제. 관련기사도 삭제)
     * 
     * @param deskingWorkVOList 삭제할 work편집기사 목록
     * @param datasetSeq 데이타셋순번
     * @param editionSeq 예약순번
     * @param creator 작업자
     */
    public void deleteDeskingWorkList(List<DeskingWorkVO> deskingWorkVOList, Long datasetSeq,
            Long editionSeq, String creator);

    /**
     * work 편집기사 삭제 전 정렬
     *
     * @param deskingWorkSeqList 삭제할 work편집기사 Seq 목록
     * @param datasetSeq 데이타셋순번
     * @param editionSeq 예약순번
     * @param creator 작업자
     */
    public void sortBeforeDeleteDeskingWork(List<Long> deskingWorkSeqList, Long datasetSeq,
                                      Long editionSeq, String creator);

    /**
     * 데스킹 릴레이션 워크 목록 저장
     * 
     * @param newDeskingRelWorks 저장할 데스킹릴레이션워크 목록
     * @return 결과
     */
    public List<DeskingRelWork> updateDeskingRelWorks(List<DeskingRelWork> newDeskingRelWorks);

    /**
     * 데스킹 릴레이션 워크 목록 저장
     * 
     * @param deskingSeq 데스킹아이디
     * @param creator 생성자
     * @param newDeskingRelWorks 저장할 데스킹릴레이션워크 목록
     * @return 결과
     */
    public List<DeskingRelWork> updateDeskingRelWorks(Long deskingSeq, String creator,
            List<DeskingRelWork> newDeskingRelWorks);

    /**
     * 데스킹 릴레이션 워크 삭제
     * 
     * @param deskingRelWork deskingRelWork
     */
    public void deleteDeskingRelWork(DeskingRelWork deskingRelWork);

    /**
     * 데스킹 워크 썸네일 사진 저장
     * 
     * @param deskingWork 데스킹워크
     * @param thumbnail 멀티파트파일
     * @return 이미지 uri
     * @throws Exception 에러
     */
    public String saveDeskingWorkImage(DeskingWork deskingWork, MultipartFile thumbnail)
            throws Exception;

    /**
     * 데스킹 히스토리 그룹 목록 조회
     * 
     * @param search 검색객체
     * @return 데스킹 히스토리 그룹 목록
     */
    public List<DeskingHistGroupVO> findDeskingHistGroup(DeskingHistSearchDTO search);

    /**
     * 데스킹 히스토리 그룹 카운트
     * 
     * @param search 검색객체
     * @return 데스킹 히스토리 그룹 카운트
     */
    public Long countByHistGroup(DeskingHistSearchDTO search);

    /**
     * 데스킹 히스토리 상세 목록 조회
     * 
     * @param search 검색객체
     * @return 데스킹 히스토리 상세
     */
    public List<DeskingHistVO> findDeskingHistDetail(DeskingHistSearchDTO search);

    /**
     * 페이지내 모든 데스킹 히스토리 그룹 목록 조회
     * 
     * @param search 검색객체
     * @param pageSeq 페이지아이디
     * @return 데스킹 히스토리 그룹 목록
     */
    public List<DeskingHistGroupVO> findAllDeskingHistGroup(DeskingHistSearchDTO search,
            Long pageSeq);

    public List<EditionVO> getEditionList(Long pageSeq);

    public void importDeskingWorkHistory(DeskingHistSearchDTO search);
}
