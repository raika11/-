/**
 * msp-tps ScreenService.java 2020. 5. 13. 오후 1:33:34 ssc
 */
package jmnet.moka.core.tps.mvc.desking.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.tps.common.dto.HistPublishDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingHistSearchDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingOrdDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkDTO;
import jmnet.moka.core.tps.mvc.desking.dto.DeskingWorkSearchDTO;
import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.desking.entity.Desking;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingHist;
import jmnet.moka.core.tps.mvc.desking.entity.DeskingWork;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentHistVO;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;
import jmnet.moka.core.tps.mvc.desking.vo.DeskingWorkVO;
import org.springframework.web.multipart.MultipartFile;

/**
 * <pre>
 *
 * 2020. 5. 13. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 5. 13. 오후 1:33:34
 */
public interface DeskingService {
    /**
     * 편집데이타를 가지고 있는지 조사
     *
     * @param datasetSeq 데이타셋SEQ
     * @return 데이타가 있으면 true
     */
    boolean usedByDatasetSeq(Long datasetSeq);

    /**
     * 컴포넌트Work 초기화(사용자의 work 모두삭제) 컴포넌트Work와 컴포넌트의 편집기사워크 조회(편집영역 내의 모든 컴포넌트)
     *
     * @param search 검색조건
     * @return 편집컴포넌트 목록
     */
    List<ComponentWorkVO> findAllComponentWork(DeskingWorkSearchDTO search);

    /**
     * 컴포넌트Work와 컴포넌트의 편집데이타 조회(단일 컴포넌트)
     *
     * @param seq            컴포넌트워크순번
     * @param includeDesking 컴포넌트워크의 편집기사워크를 조회할지 말지 플래그. true시 조회
     * @return 편집컴포넌트
     */
    ComponentWorkVO findComponentWorkBySeq(Long seq, boolean includeDesking);


    /**
     * 편집기사워크 목록조회
     *
     * @param datasetSeq 데이타셋SEQ
     * @param regId      작업자
     * @return 편집기사워크 목록
     */
    List<DeskingWorkVO> findAllDeskingWork(Long datasetSeq, String regId);

    /**
     * 컴포넌트 임시저장 : ComponentHist에 status='SAVE', approvalYn='N'로 저장.
     *
     * @param componentWorkVO 컴포넌트워크정보
     * @param regId           작업자
     * @param templateSeq     템플릿순번
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    void save(ComponentWorkVO componentWorkVO, String regId, Long templateSeq)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 전송
     *
     * @param componentWorkVO work컴포넌트정보
     * @param regId           작업자
     * @param templateSeq     템플릿순번
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    void publish(ComponentWorkVO componentWorkVO, String regId, Long templateSeq)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 예약
     *
     * @param componentWorkVO work컴포넌트정보
     * @param regId           작업자
     * @param reserveDt       예약시간
     * @param templateSeq     템플릿순번
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    void reserve(ComponentWorkVO componentWorkVO, String regId, Date reserveDt, Long templateSeq)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 예약삭제
     *
     * @param componentWorkVO work컴포넌트정보
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    void deleteReserve(ComponentWorkVO componentWorkVO)
            throws NoDataException, Exception;

    //    /**
    //     * 컴포넌트 예약여부 조회
    //     *
    //     * @param workVO work컴포넌트정보
    //     * @return 예약여부. 예약된게 있으면 true
    //     */
    //    boolean existReserve(ComponentWorkVO workVO);


    /**
     * 컴포넌트 히스토리 등록
     *
     * @param workVO         work컴포넌트정보
     * @param regId          작업자
     * @param histPublishDTO 임시저장/전송/예약 정보
     * @param templateSeq    템플릿순번
     * @return 수정된 컴포넌트
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    ComponentHist insertComponentHist(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO, Long templateSeq)
            throws NoDataException, Exception;

    /**
     * 편집 컴포넌트 수정
     *
     * @param workVO         work컴포넌트정보
     * @param regId          작업자
     * @param histPublishDTO 임시저장/전송/예약 정보
     * @param templateSeq    템플릿순번
     * @return 수정된 컴포넌트
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    Component updateComponent(ComponentWorkVO workVO, String regId, HistPublishDTO histPublishDTO, Long templateSeq)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 히스토리 등록
     *
     * @param componentHist   컴포넌트정보
     * @param deskingWorkList 편집기사목록
     * @param regId           작업자
     * @return 수정된 컴포넌트
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    void insertDeskingHist(ComponentHist componentHist, List<DeskingWorkVO> deskingWorkList, String regId)
            throws NoDataException, Exception;

    /**
     * 편집데이타 전송 : 편집데이타 히스토리등록, 기존데이타 삭제->새로운데이타 편집데이타로 등록
     *
     * @param component       컴포넌트
     * @param deskingWorkList 편집기사목록
     * @param histPublishDTO  임시저장/전송/예약 정보
     * @param regId           작업자
     * @return
     */
    void updateDesking(Component component, List<DeskingWorkVO> deskingWorkList, String regId, HistPublishDTO histPublishDTO);

    /**
     * 편집 컴포넌트Work 수정
     *
     * @param workVO work컴포넌트정보
     * @param regId  작업자
     * @return 수정된 컴포넌트
     * @throws NoDataException 데이터없음 예외
     * @throws Exception       기타예외
     */
    public ComponentWork updateComponentWork(ComponentWorkVO workVO, String regId)
            throws NoDataException, Exception;

    /**
     * work 컴포넌트워크 스냅샷 수정
     *
     * @param componentWorkSeq work컴포넌트순번
     * @param snapshotYn       스냅샷여부
     * @param snapshotBody     스냅샷HTML
     * @param regId            작업자
     * @return work컴포넌트
     * @throws NoDataException
     * @throws Exception
     */
    public ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn, String snapshotBody, String regId)
            throws NoDataException, Exception;

    //    /**
    //     * work 편집기사 추가 및 편집기사목록 정렬
    //     *
    //     * @param deskingWork 추가할 편집기사
    //     * @param datasetSeq  데이타셋순번
    //     * @param regId       작업자
    //     */
    //    public void insertDeskingWork(DeskingWork deskingWork, Long datasetSeq, String regId);

    /**
     * 편집기사워크 추가 및 편집기사목록 정렬
     *
     * @param insertdeskingList 추가할 편집기사워크 목록
     * @param datasetSeq        데이타셋순번
     * @param regId             작업자
     */
    void insertDeskingWorkList(List<DeskingWorkDTO> insertdeskingList, Long datasetSeq, String regId);

    /**
     * 편집기사워크  삭제(VO로 삭제. 관련기사도 삭제)
     *
     * @param deleteDeksingList 삭제할 편집기사워크 목록
     * @param datasetSeq        데이타셋순번
     * @param regId             작업자
     */
    void deleteDeskingWorkList(List<DeskingWorkVO> deleteDeksingList, Long datasetSeq, String regId);

    /**
     * 삭제 후 수정할 정렬값 조회
     *
     * @param datasetSeq 데이타셋순번
     * @param regId      작업자
     * @return 수정할 순번목록
     */
    List<DeskingOrdDTO> resortAfterDelete(Long datasetSeq, String regId);

    /**
     * 편집기사워크를 조회한다
     *
     * @param seq 편집기사 아이디
     * @return 데스킹 워크
     */
    public Optional<DeskingWork> findDeskingWorkBySeq(Long seq);


    /**
     * 데스킹 워크 수정
     *
     * @param deskingWork 수정할 데스킹워크
     * @return 결과
     */
    public DeskingWork updateDeskingWork(DeskingWork deskingWork);

    /**
     * 데스킹 Hist 수정
     *
     * @param deskingHist 수정할 데스킹Hist
     * @return 결과
     */
    public DeskingHist updateDeskingHist(DeskingHist deskingHist);

    /**
     * work 컴포넌트의 정렬순서 변경
     *
     * @param datasetSeq   데이타셋순
     * @param deskingWorks 편집기사목록
     * @param regId        작업자
     */
    public void updateDeskingWorkSort(Long datasetSeq, List<DeskingWorkVO> deskingWorks, String regId);

    /**
     * <pre>
     * work 편집기사 이동
     * </pre>
     *
     * @param deskingWork   추가할 편집기사
     * @param tgtDatasetSeq target 데이타셋순번
     * @param srcDatasetSeq source 데이타셋순번
     * @param creator       작업자
     */
    public void moveDeskingWork(DeskingWorkDTO deskingWork, Long tgtDatasetSeq, Long srcDatasetSeq, String creator);

    //    /**
    //     * 저장간격내에 저장한 사람을 조회
    //     *
    //     * @param datasetSeq 데이타셋순번
    //     * @param interval 저장간격
    //     * @param creator 작업자
    //     * @return 작업된 데스킹목록
    //     */
    //    public List<Desking> hasOtherSaved(Long datasetSeq, int interval, String creator);



    //    /**
    //     * work 컴포넌트워크 템플릿 수정
    //     *
    //     * @param componentWorkSeq work컴포넌트순번
    //     * @param templateSeq      변경할 템플릿순번
    //     * @param creator          작업자
    //     * @return work컴포넌트
    //     * @throws NoDataException
    //     * @throws Exception
    //     */
    //    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String creator)
    //            throws NoDataException, Exception;



    //    /**
    //     * 데스킹 릴레이션 워크 목록 저장
    //     *
    //     * @param newDeskingRelWorks 저장할 데스킹릴레이션워크 목록
    //     * @return 결과
    //     */
    //    public List<DeskingRelWork> updateDeskingRelWorks(List<DeskingRelWork> newDeskingRelWorks);
    //
    //    /**
    //     * 데스킹 릴레이션 워크 목록 저장
    //     *
    //     * @param deskingSeq 데스킹아이디
    //     * @param creator 생성자
    //     * @param newDeskingRelWorks 저장할 데스킹릴레이션워크 목록
    //     * @return 결과
    //     */
    //    public List<DeskingRelWork> updateDeskingRelWorks(Long deskingSeq, String creator,
    //            List<DeskingRelWork> newDeskingRelWorks);
    //
    //    /**
    //     * 데스킹 릴레이션 워크 삭제
    //     *
    //     * @param deskingRelWork deskingRelWork
    //     */
    //    public void deleteDeskingRelWork(DeskingRelWork deskingRelWork);

    /**
     * 데스킹 워크 썸네일 사진 저장
     *
     * @param areaSeq     편집영역순번
     * @param deskingWork 데스킹워크
     * @param thumbnail   멀티파트파일
     * @return 이미지 uri
     * @throws Exception 에러
     */
    public String saveDeskingWorkImage(Long areaSeq, DeskingWork deskingWork, MultipartFile thumbnail)
            throws Exception;

    /**
     * 컴포넌트 히스토리 목록 조회
     *
     * @param search 검색객체
     * @return 데스킹히스토리 그룹 목록
     */
    List<ComponentHistVO> findAllComponentHist(DeskingHistSearchDTO search);
    //
    //    /**
    //     * 데스킹 히스토리 그룹 카운트
    //     *
    //     * @param search          검색객체
    //     * @return                데스킹 히스토리 그룹 카운트
    //     */
    //    Long countByHistGroup(DeskingHistSearchDTO search);

    /**
     * 데스킹 히스토리 목록 조회
     *
     * @param componentHistSeq 컴포넌트 히스토리 SEQ
     * @return 데스킹히스토리 상세
     */
    List<DeskingHist> findAllDeskingHist(Long componentHistSeq);
    //
    //    /**
    //     * 페이지내 모든 데스킹 히스토리 그룹 목록 조회
    //     *
    //     * @param search 검색객체
    //     * @param pageSeq 페이지아이디
    //     * @return 데스킹 히스토리 그룹 목록
    //     */
    //    public List<DeskingHistGroupVO> findAllDeskingHistGroup(DeskingHistSearchDTO search,
    //            Long pageSeq);
    //
    //    public List<EditionVO> getEditionList(Long pageSeq);
    //

    /**
     * 히스토리를 불러와 컴포넌트워크, 편집기사워크에 저장한다.
     *
     * @param componentWorkSeq 컴포넌트 work SEQ
     * @param componentHistSeq 컴포넌트 히스토리 SEQ
     * @param regId            작업자
     * @param updateTemplateYn 템플릿수정여부(네이버채널에서 Y)
     */
    void importDeskingWorkHistory(Long componentWorkSeq, Long componentHistSeq, String regId, String updateTemplateYn)
            throws Exception;

    /**
     * 데이타셋에 해당하는 기사목록 조회(주기사만 조회)
     *
     * @param datasetSeq 데이타셋Seq
     * @return
     */
    List<Desking> findByDatasetSeq(Long datasetSeq);

    /**
     * 컴포넌트워크의 템플릿수정
     *
     * @param componentWorkSeq 컴포넌트워크
     * @param templateSeq      템플릿순번
     * @param regId            작업자
     * @return 컴포넌트워크
     */
    ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String regId)
            throws Exception;

    /**
     * 편집기사 텍스트필드 escape
     *
     * @param deskingWorkDTO 편집기사워크 정보
     */
    void escapeHtml(DeskingWorkDTO deskingWorkDTO);

    /**
     * 예약편집기사를 서비스에 등록
     *
     * @param componentSeq 컴포넌트순번
     */
    void excuteReserve(Long componentSeq)
            throws Exception;
}
