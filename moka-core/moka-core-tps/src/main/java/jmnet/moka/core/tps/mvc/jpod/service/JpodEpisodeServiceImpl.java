package jmnet.moka.core.tps.mvc.jpod.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeDetail;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodMember;
import jmnet.moka.core.tps.mvc.jpod.mapper.JpodEpisodeMapper;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeDetailRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRelArtRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodEpisodeRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodKeywordRepository;
import jmnet.moka.core.tps.mvc.jpod.repository.JpodMemberRepository;
import jmnet.moka.core.tps.mvc.jpod.vo.JpodEpisodeVO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.service
 * ClassName : JpodEpisodeServiceImpl
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:37
 */
@Service
public class JpodEpisodeServiceImpl implements JpodEpisodeService {

    private final JpodEpisodeRepository jpodEpisodeRepository;

    private final JpodEpisodeDetailRepository jpodEpisodeDetailRepository;

    private final JpodEpisodeMapper jpodEpisodeMapper;

    private final JpodKeywordRepository jpodKeywordRepository;

    private final JpodEpisodeRelArtRepository jpodEpisodeRelArtRepository;

    private final JpodMemberRepository jpodMemberRepository;

    public JpodEpisodeServiceImpl(JpodEpisodeRepository jpodEpisodeRepository, JpodEpisodeDetailRepository jpodEpisodeDetailRepository,
            JpodEpisodeMapper jpodEpisodeMapper, JpodKeywordRepository jpodKeywordRepository, JpodEpisodeRelArtRepository jpodEpisodeRelArtRepository,
            JpodMemberRepository jpodMemberRepository) {
        this.jpodEpisodeRepository = jpodEpisodeRepository;
        this.jpodEpisodeDetailRepository = jpodEpisodeDetailRepository;
        this.jpodEpisodeMapper = jpodEpisodeMapper;
        this.jpodKeywordRepository = jpodKeywordRepository;
        this.jpodEpisodeRelArtRepository = jpodEpisodeRelArtRepository;
        this.jpodMemberRepository = jpodMemberRepository;
    }


    @Override
    public Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search) {
        return jpodEpisodeRepository.findAllJpodEpisode(search);
    }

    @Override
    public Optional<JpodEpisode> findJpodEpisodeById(Long episodeSeq) {
        return jpodEpisodeRepository.findById(episodeSeq);
    }

    @Override
    public Optional<JpodEpisodeDetail> findJpodEpisodeDetailById(Long episodeSeq) {
        return jpodEpisodeDetailRepository.findById(episodeSeq);
    }

    @Override
    public JpodEpisodeDetail insertJpodEpisode(JpodEpisodeDetail episode) {
        final JpodEpisodeDetail newEpisode = saveJpodEpisodeDetail(episode);

        episode
                .getKeywords()
                .forEach(jpodKeyword -> {
                    jpodKeyword.setEpsdSeq(newEpisode.getEpsdSeq());
                    jpodKeywordRepository.save(jpodKeyword);
                });

        episode
                .getMembers()
                .forEach(jpodMember -> {
                    jpodMember.setEpsdSeq(newEpisode.getEpsdSeq());
                    jpodMemberRepository.save(jpodMember);
                });

        episode
                .getArticles()
                .forEach(jpodEpisodeRelArt -> {
                    jpodEpisodeRelArt
                            .getId()
                            .setEpsdSeq(newEpisode.getEpsdSeq());
                    jpodEpisodeRelArtRepository.save(jpodEpisodeRelArt);
                });


        return episode;
    }

    public JpodEpisodeDetail saveJpodEpisodeDetail(JpodEpisodeDetail episode) {

        if (episode.getEpsdSeq() != null && episode.getEpsdSeq() > 0) {
            jpodEpisodeRepository.deleteArticleByEpsdSeq(episode.getEpsdSeq());
            jpodEpisodeRepository.deleteKeywordByEpsdSeq(episode.getEpsdSeq());
            jpodEpisodeRepository.deleteMemberByEpsdSeq(episode.getEpsdSeq());
        }

        if (episode.getKeywords() != null) {
            AtomicInteger atomicInteger = new AtomicInteger(0);
            episode
                    .getKeywords()
                    .forEach(jpodKeyword -> {
                        jpodKeyword.setChnlSeq(episode.getChnlSeq());
                        jpodKeyword.setEpsdSeq(episode.getEpsdSeq());
                        jpodKeyword.setOrdNo(atomicInteger.addAndGet(1));
                    });
        }

        if (episode.getMembers() != null) {
            episode
                    .getMembers()
                    .forEach(jpodMember -> {
                        jpodMember.setChnlSeq(episode.getChnlSeq());
                        jpodMember.setEpsdSeq(episode.getEpsdSeq());
                    });
        }

        if (episode.getArticles() != null) {
            AtomicInteger atomicInteger = new AtomicInteger(0);
            episode
                    .getArticles()
                    .forEach(jpodEpisodeRelArt -> {
                        jpodEpisodeRelArt
                                .getId()
                                .setChnlSeq(episode.getChnlSeq());
                        jpodEpisodeRelArt
                                .getId()
                                .setEpsdSeq(episode.getEpsdSeq());
                        jpodEpisodeRelArt.setOrdNo(atomicInteger.addAndGet(1));
                    });
        }

        return jpodEpisodeDetailRepository.save(episode);
    }



    @Override
    public JpodEpisodeDetail updateJpodEpisode(JpodEpisodeDetail episode) {
        return saveJpodEpisodeDetail(episode);
    }

    @Override
    public long updateJpodEpisodeUseYn(Long epsdSeq, String usedYn) {
        return jpodEpisodeRepository.updateUsedYn(epsdSeq, usedYn);
    }


    @Override
    public void deleteJpodEpisodeBySeq(Long episodeSeq) {
        this
                .findJpodEpisodeById(episodeSeq)
                .ifPresent(this::deleteJpodEpisode);
    }

    @Override
    public void deleteJpodEpisode(JpodEpisode jpodEpisode) {
        jpodEpisodeRepository.delete(jpodEpisode);
    }

    @Override
    public void insertJpodKeyword(Long chnlSeq, Long epsdSeq, String[] keywords) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();
        insertJpodKeyword(jpodEpisodeVO, keywords);

    }

    @Override
    public void insertJpodKeyword(JpodEpisodeVO jpodEpisodeVO, String[] keywords) {

        jpodEpisodeMapper.deleteAllMember(jpodEpisodeVO);
        int ordNo = 0;
        for (String keyword : keywords) {
            JpodKeyword jpodKeyword = JpodKeyword
                    .builder()
                    .chnlSeq(jpodEpisodeVO.getChnlSeq())
                    .epsdSeq(jpodEpisodeVO.getEpsdSeq())
                    .ordNo(++ordNo)
                    .keyword(keyword)
                    .build();
            jpodKeywordRepository.save(jpodKeyword);
        }
    }

    @Override
    public void insertJpodMember(Long chnlSeq, Long epsdSeq, List<JpodMember> members) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();

        insertJpodMember(jpodEpisodeVO, members);
    }

    @Override
    public void insertJpodMember(JpodEpisodeVO jpodEpisodeVO, List<JpodMember> members) {

        jpodEpisodeMapper.deleteAllMember(jpodEpisodeVO);

        jpodMemberRepository.saveAll(members);
    }

    @Override
    public void insertJpodEpisodeRelArt(Long chnlSeq, Long epsdSeq, List<JpodEpisodeRelArt> arts) {
        JpodEpisodeVO jpodEpisodeVO = JpodEpisodeVO
                .builder()
                .chnlSeq(chnlSeq)
                .epsdSeq(epsdSeq)
                .build();

        insertJpodEpisodeRelArt(jpodEpisodeVO, arts);
    }

    @Override
    public void insertJpodEpisodeRelArt(JpodEpisodeVO jpodEpisodeVO, List<JpodEpisodeRelArt> arts) {

        jpodEpisodeMapper.deleteAllArticle(jpodEpisodeVO);

        jpodEpisodeRelArtRepository.saveAll(arts);
    }
}
