package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : JpodEpisodeService
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 18:38
 */
public interface JpodEpisodeService {
    /**
     * jpod 에피소드 조회
     *
     * @param search 검색 조건
     * @return 검색 결과
     */
    Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search);

    /**
     * jpod 에피소드 상세 조회
     *
     * @param episodeSeq 에피소드 일련번호
     * @return 에피소드 정보
     */
    Optional<JpodEpisode> findJpodEpisodeById(Long episodeSeq);

    /**
     * jpod 에피소드 신규 등록
     *
     * @param episode 에피소드 정보
     * @return 등록 결과
     */
    JpodEpisode insertJpodEpisode(JpodEpisode episode);

    /**
     * jpod 에피소드 수정
     *
     * @param episode 에피소드 정보
     * @return JpodEpisode
     */
    JpodEpisode updateJpodEpisode(JpodEpisode episode);

    /**
     * jpod 에피소드 일련번호로 삭제
     *
     * @param episodeSeq 에피소드 일련번호
     */
    void deleteJpodEpisodeBySeq(Long episodeSeq);

    /**
     * jpod 에피소드 삭제
     *
     * @param jpodEpisode 에피소드 정보
     */
    void deleteJpodEpisode(JpodEpisode jpodEpisode);

    /**
     * 에피소드 키워드 등록 기존 키워드 삭제 후 등록 처리
     *
     * @param chnlSeq  채널 일련번호
     * @param epsdSeq  에피소드 일련번호
     * @param keywords 키워드 목록
     */
    void insertJpodKeyword(Long chnlSeq, Long epsdSeq, String[] keywords);

    /**
     * 에피소드 키워드 등록 기존 키워드 삭제 후 등록 처리
     *
     * @param jpodEpisodeVO 에피소드 정보
     * @param keywords      키워드 목록
     */
    void insertJpodKeyword(JpodEpisodeVO jpodEpisodeVO, String[] keywords);

    /**
     * 에피소드 출연진 등록, 기존 출연진 삭제 후 등록 처리
     *
     * @param chnlSeq 채널 일련번호
     * @param epsdSeq 에피소드 일련번호
     * @param members 출연진 정보
     */
    void insertJpodMember(Long chnlSeq, Long epsdSeq, List<JpodMember> members);

    /**
     * 에피소드 출연진 등록, 기존 출연진 삭제 후 등록 처리
     *
     * @param jpodEpisodeVO 에피소드 정보
     * @param members       출연진 정보
     */
    void insertJpodMember(JpodEpisodeVO jpodEpisodeVO, List<JpodMember> members);

    /**
     * 에피소드 관련 기사 등록, 기존 정보 삭제 처리 후 등록
     *
     * @param chnlSeq 채널 일련번호
     * @param epsdSeq 에피소드 일련번호
     * @param arts    기사 목록
     */
    void insertJpodEpisodeRelArt(Long chnlSeq, Long epsdSeq, List<JpodEpisodeRelArt> arts);

    /**
     * 에피소드 관련 기사 등록, 기존 정보 삭제 처리 후 등록
     *
     * @param jpodEpisodeVO 에피소드 정보
     * @param arts          기사 목록
     */
    void insertJpodEpisodeRelArt(JpodEpisodeVO jpodEpisodeVO, List<JpodEpisodeRelArt> arts);
}
