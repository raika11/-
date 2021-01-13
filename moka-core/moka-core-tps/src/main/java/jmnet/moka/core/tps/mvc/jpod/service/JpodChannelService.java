package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeStatVO;
import org.springframework.data.domain.Page;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : JpodChannelService
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 14:15
 */
public interface JpodChannelService {
    /**
     * 채널 목록 조회
     *
     * @param search 검색 조건
     * @return 목록
     */
    Page<JpodChannel> findAllJpodChannel(JpodChannelSearchDTO search);

    /**
     * 전체 채널 목록 조회
     *
     * @return 채널 목록
     */
    List<JpodChannel> findAllJpodChannel();

    /**
     * 채널 일련번호로 채널정보 조회
     *
     * @param channelSeq 채널 일련번호
     * @return 채널 정보
     */
    Optional<JpodChannel> findJpodChannelBySeq(Long channelSeq);

    /**
     * 채널 정보 저장
     *
     * @param channel JpodChannel
     * @return 저장 결과
     */
    JpodChannel insertJpodChannel(JpodChannel channel, List<JpodKeyword> keywords, List<JpodMember> members);

    /**
     * 채널 정보 수정
     *
     * @param channel JpodChannel
     * @return 수정 결과
     */
    JpodChannel updateJpodChannel(JpodChannel channel, List<JpodKeyword> keywords, List<JpodMember> members);

    /**
     * 채널 정보 사용 여부 수정
     *
     * @param channel JpodChannel
     * @return 수정 결과
     */
    JpodChannel updateJpodChannelUsedYn(JpodChannel channel);

    /**
     * 채널 일련번호로 삭제
     *
     * @param channelSeq 채널 일련번호
     */
    void deleteJpodChannelById(Long channelSeq);

    /**
     * 채널 삭제
     *
     * @param jpodChannel 채널 정보
     */
    void deleteJpodChannel(JpodChannel jpodChannel);


    /**
     * 채널 키워드 목록 조회
     *
     * @return 채널 키워드 목록
     */
    List<JpodKeyword> findAllJpodChannelKeyword(Long chnlSeq);

    /**
     * 채널 진행자 목록 조회
     *
     * @return 채널 진행자 목록
     */
    List<JpodMember> findAllJpodChannelMember(Long chnlSeq);

    JpodEpisodeStatVO findEpisodeStat(Long chnlSeq);
}
