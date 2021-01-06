package jmnet.moka.core.tps.mvc.jpod.service;

import jmnet.moka.core.tps.mvc.jpod.dto.PodtyEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyChannelVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyEpisodeVO;
import jmnet.moka.core.tps.mvc.jpod.vo.PodtyResultVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.bright.service
 * ClassName : BrightcoveService
 * Created : 2020-11-24 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-24 09:05
 */
public interface PodtyService {

    PodtyResultVO<PodtyChannelVO> findAllChannel();

    public PodtyResultVO<PodtyEpisodeVO> findAllEpisode(String castSrl, PodtyEpisodeSearchDTO searchDTO);

}
