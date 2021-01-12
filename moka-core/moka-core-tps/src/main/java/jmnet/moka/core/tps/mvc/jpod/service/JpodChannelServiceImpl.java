package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodChannelRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodKeywordRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodMemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : JpodChannelServiceImpl
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:37
 */
@Service
public class JpodChannelServiceImpl implements JpodChannelService {

    private final JpodChannelRepository jpodChannelRepository;

    private final JpodKeywordRepository jpodKeywordRepository;

    private final JpodMemberRepository jpodMemberRepository;


    public JpodChannelServiceImpl(JpodChannelRepository jpodChannelRepository, JpodKeywordRepository jpodKeywordRepository,
            JpodMemberRepository jpodMemberRepository) {
        this.jpodChannelRepository = jpodChannelRepository;
        this.jpodKeywordRepository = jpodKeywordRepository;
        this.jpodMemberRepository = jpodMemberRepository;
    }


    @Override
    public Page<JpodChannel> findAllJpodChannel(JpodChannelSearchDTO search) {
        return jpodChannelRepository.findAllJpodChannel(search);
    }

    @Override
    public List<JpodChannel> findAllJpodChannel() {
        return jpodChannelRepository.findAll();
    }

    @Override
    public Optional<JpodChannel> findJpodChannelBySeq(Long channelSeq) {
        return jpodChannelRepository.findById(channelSeq);
    }


    @Override
    public JpodChannel insertJpodChannel(JpodChannel channel, List<JpodKeyword> keywords, List<JpodMember> members) {
        return saveJpodEpisodeDetail(channel, keywords, members);
    }

    @Override
    public JpodChannel updateJpodChannel(JpodChannel channel, List<JpodKeyword> keywords, List<JpodMember> members) {
        return saveJpodEpisodeDetail(channel, keywords, members);
    }

    @Override
    public JpodChannel updateJpodChannelUsedYn(JpodChannel channel) {
        return jpodChannelRepository.save(channel);
    }

    @Override
    public void deleteJpodChannelById(Long channelSeq) {
        jpodChannelRepository.deleteById(channelSeq);
    }

    @Override
    public void deleteJpodChannel(JpodChannel jpodChannel) {
        jpodChannelRepository.delete(jpodChannel);
    }

    @Override
    public List<JpodKeyword> findAllJpodChannelKeyword(Long chnlSeq) {
        return jpodKeywordRepository.findAllByChnlSeqAndEpsdSeqOrderByOrdNoAsc(chnlSeq, 0L);
    }

    @Override
    public List<JpodMember> findAllJpodChannelMember(Long chnlSeq) {
        return jpodMemberRepository.findAllByChnlSeqAndEpsdSeqOrderBySeqNoAsc(chnlSeq, 0L);
    }

    public JpodChannel saveJpodEpisodeDetail(JpodChannel jpodChannel, List<JpodKeyword> keywords, List<JpodMember> members) {

        if (jpodChannel.getChnlSeq() != null && jpodChannel.getChnlSeq() > 0) {
            jpodChannelRepository.deleteKeywordByChnlSeq(jpodChannel.getChnlSeq());
            jpodChannelRepository.deleteMemberByChnlSeq(jpodChannel.getChnlSeq());
        }

        JpodChannel currentJpodChannel = jpodChannelRepository.save(jpodChannel);

        if (keywords != null) {
            AtomicInteger atomicInteger = new AtomicInteger(0);
            keywords.forEach(jpodKeyword -> {
                jpodKeyword.setChnlSeq(jpodChannel.getChnlSeq());
                jpodKeyword.setEpsdSeq(0L);
                jpodKeyword.setOrdNo(atomicInteger.addAndGet(1));
            });

            jpodKeywordRepository.saveAll(keywords);
        }

        if (members != null) {
            members.forEach(jpodMember -> {
                jpodMember.setChnlSeq(jpodChannel.getChnlSeq());
                jpodMember.setEpsdSeq(0L);
            });

            jpodMemberRepository.saveAll(members);
        }



        return currentJpodChannel;
    }
}
