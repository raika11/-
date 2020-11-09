package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodChannelRepository;
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

    public JpodChannelServiceImpl(JpodChannelRepository jpodChannelRepository) {
        this.jpodChannelRepository = jpodChannelRepository;
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
    public JpodChannel insertJpodChannel(JpodChannel channel) {
        return jpodChannelRepository.save(channel);
    }

    @Override
    public JpodChannel updateJpodChannel(JpodChannel channel) {
        return jpodChannelRepository.save(channel);
    }

    @Override
    public void deleteJpodChannelById(Long channelSeq) {
        this
                .findJpodChannelBySeq(channelSeq)
                .ifPresent(this::deleteJpodChannel);
    }

    @Override
    public void deleteJpodChannel(JpodChannel jpodChannel) {
        jpodChannelRepository.delete(jpodChannel);
    }
}
