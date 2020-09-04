/**
 * msp-tps StyleServiceImpl.java 2020. 4. 29. 오후 2:51:16 ssc
 */
package jmnet.moka.core.tps.mvc.style.service;

import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jmnet.moka.core.tps.mvc.style.dto.StyleSearchDTO;
import jmnet.moka.core.tps.mvc.style.entity.Style;
import jmnet.moka.core.tps.mvc.style.entity.StyleRef;
import jmnet.moka.core.tps.mvc.style.repository.StyleRepository;

/**
 * <pre>
 * 
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 4. 29. 오후 2:51:16
 * @author ssc
 */
@Service
public class StyleServiceImpl implements StyleService {

    // private static final Logger logger = LoggerFactory.getLogger(StyleServiceImpl.class);

    @Autowired
    StyleRepository styleRepository;

    // @Autowired
    // StyleRefRepository styleRefRepository;

    // @Autowired
    // StyleRefHistRepository styleRefHistRepository;

    @Override
    public Page<Style> findList(@Valid StyleSearchDTO search, Pageable pageable) {
        return styleRepository.findList(search, pageable);
    }

    @Override
    @Transactional
    public Style insertStyle(Style style) {
        for (StyleRef ref : style.getStyleRefs()) {
            ref.setCreateYmdt(style.getCreateYmdt());
            ref.setCreator(style.getCreator());
            ref.setStyle(style);
        }
        return styleRepository.save(style);
    }

    @Override
    public Optional<Style> findByStyleSeq(Long styleSeq) {
        return styleRepository.findById(styleSeq);
    }
}
