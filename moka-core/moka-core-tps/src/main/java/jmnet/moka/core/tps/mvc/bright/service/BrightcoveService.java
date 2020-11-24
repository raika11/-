package jmnet.moka.core.tps.mvc.bright.service;

import jmnet.moka.core.tps.mvc.bright.dto.OvpSearchDTO;
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
}
