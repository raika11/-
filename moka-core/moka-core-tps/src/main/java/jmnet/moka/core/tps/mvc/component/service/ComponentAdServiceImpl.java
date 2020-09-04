package jmnet.moka.core.tps.mvc.component.service;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jmnet.moka.core.tps.mvc.component.entity.ComponentAd;
import jmnet.moka.core.tps.mvc.component.repository.ComponentAdRepository;

@Service
public class ComponentAdServiceImpl implements ComponentAdService {

    @Autowired
    private ComponentAdRepository componentAdRepository;

    @Override
    public void deleteByComponentSeq(Long componentSeq) throws Exception {
        componentAdRepository.deleteByComponentSeq(componentSeq);
    }

    @Override
    public LinkedHashSet<ComponentAd> findByComponentSeq(Long componentSeq) {
        LinkedHashSet<ComponentAd> result = new LinkedHashSet<ComponentAd>(
                componentAdRepository.findByComponentSeqOrderByListParagraph(componentSeq));
        return result;
    }

    @Override
    @Transactional
    public Set<ComponentAd> updateComponentAdList(Set<ComponentAd> newAds, Set<ComponentAd> orgAds)
            throws Exception {
        Set<ComponentAd> result = orgAds;

        if (!newAds.equals(orgAds)) {
            if (orgAds != null && orgAds.size() > 0) {
                componentAdRepository.deleteAll(orgAds);
            }

            if (newAds != null && newAds.size() > 0) {
                result = new LinkedHashSet<>(componentAdRepository.saveAll(newAds));
                // listParagraph 기준으로 asc
                result.parallelStream().sorted((a, b) -> {
                    return a.getListParagraph() - b.getListParagraph();
                });
            }
        }

        return result;
    }

    @Override
    public Set<ComponentAd> insertComponentAdList(Set<ComponentAd> ads) throws Exception {
        Set<ComponentAd> result =
                new LinkedHashSet<ComponentAd>(componentAdRepository.saveAll(ads));
        result.stream().sorted((a, b) -> {
            return a.getListParagraph() - b.getListParagraph();
        });
        return result;
    }

}
