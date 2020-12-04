package jmnet.moka.core.tps.mvc.bright.service;

import java.util.List;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
import jmnet.moka.core.tps.mvc.bright.dto.VideoDTO;
import org.springframework.http.ResponseEntity;

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
public interface BrightcoveService {

    public ResponseEntity<?> findAllOvp(OvpSearchDTO searchDTO);

    List<VideoDTO> findAllVideos(SearchDTO search);
}
