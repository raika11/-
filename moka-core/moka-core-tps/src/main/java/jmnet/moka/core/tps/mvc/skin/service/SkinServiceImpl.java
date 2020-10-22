package jmnet.moka.core.tps.mvc.skin.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

import jmnet.moka.core.common.MokaConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.common.data.mybatis.support.McpMybatis;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.template.ParsedItemDTO;
import jmnet.moka.core.common.template.helper.TemplateParserHelper;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.ItemDTO;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.skin.dto.SkinSearchDTO;
import jmnet.moka.core.tps.mvc.skin.entity.Skin;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;
import jmnet.moka.core.tps.mvc.skin.entity.SkinRel;
import jmnet.moka.core.tps.mvc.skin.mapper.SkinRelMapper;
import jmnet.moka.core.tps.mvc.skin.repository.SkinHistRepository;
import jmnet.moka.core.tps.mvc.skin.repository.SkinRelRepository;
import jmnet.moka.core.tps.mvc.skin.repository.SkinRepository;
import jmnet.moka.core.tps.mvc.skin.vo.SkinVO;

@Service
public class SkinServiceImpl implements SkinService {

    // private static final Logger logger = LoggerFactory.getLogger(SkinServiceImpl.class);

    @Autowired
    SkinRepository skinRepository;


    @Autowired
    SkinRelRepository skinRelRepository;

    @Autowired
    SkinHistRepository skinHistRepository;

    @Autowired
    ContainerService containerService;

    @Autowired
    ComponentService componentService;

    @Autowired
    private SkinRelMapper skinRelMapper;

    @Override
    public Page<Skin> findList(SkinSearchDTO search, Pageable pageable) {
        return skinRepository.findList(search, pageable);
    }

    @Override
    public Optional<Skin> findBySkinSeq(Long skinSeq) {
        return skinRepository.findById(skinSeq);
    }

    @Override
    public List<Skin> findByServiceName(String skinServiceName, String domainId) {
        return skinRepository.findBySkinServiceNameAndDomain_DomainId(skinServiceName, domainId);
    }

    @Override
    public Skin insertSkin(Skin skin)
            throws TemplateParseException, UnsupportedEncodingException, IOException {
        // 1. 관련정보 추가
        insertRel(skin);

        // 2. 페이지
        Skin saveSkin = skinRepository.save(skin);

        // 3. 히스토리저장
        insertHist(saveSkin, TpsConstants.WORKTYPE_INSERT, saveSkin.getRegId());

        return saveSkin;
    }

    /**
     * 관련아이템 저장
     * 
     * @param skin 본문스킨 엔티티
     * @throws TemplateParseException
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    private void insertRel(Skin skin)
            throws UnsupportedEncodingException, IOException, TemplateParseException {

        List<ParsedItemDTO> parsedItemDTOList =
                TemplateParserHelper.getItemList(skin.getSkinBody());
        List<ItemDTO> itemDTOList = ResourceMapper.getDefaultObjectMapper()
                .convertValue(parsedItemDTOList, new TypeReference<List<ItemDTO>>() {});
        for (ItemDTO item : itemDTOList) {
            SkinRel relation = new SkinRel();
            relation.setRelType(item.getNodeName());
            relation.setRelSeq(Long.parseLong(item.getId()));
            relation.setRelParentType("NN");
            relation.setRelOrd(item.getOrder());

            // 동일한 아이템은 추가하지 않는다.
            if (skin.isEqualRel(relation)) {
                continue;
            } else {
                relation.setSkin(skin);
                relation.setDomain(skin.getDomain());
                // skin.addSkinRel(relation);
            }

            // if (item.getNodeName().equals(MspConstants.ITEM_CONTAINER)) { // 컨테이너 자식을 찾아서 추가한다.
            //
            // List<ContainerRel> containerRelList =
            // containerService.findChildRelList(Long.parseLong(item.getId()));
            //
            // for (ContainerRel containerRel : containerRelList) {
            // SkinRel relationCT = new SkinRel();
            // relationCT.setRelType(containerRel.getRelType());
            // relationCT.setRelSeq(containerRel.getRelSeq());
            // // 부모를 CT로 변경
            // relationCT.setRelParentType(MspConstants.ITEM_CONTAINER);
            // relationCT.setRelParentSeq(Long.parseLong(item.getId()));
            // relationCT.setRelOrder(item.getOrder());
            //
            // // 동일한 아이템은 추가하지 않는다.
            // if (!skin.isEqualRel(relationCT)) {
            // relationCT.setSkin(skin);
            // relationCT.setDomain(skin.getDomain());
            // // skin.addSkinRel(relationCT);
            // }
            // }
            //
            // } else
            if (item.getNodeName().equals(MokaConstants.ITEM_COMPONENT)) {    // 컴포넌트 자식을 찾아서
                                                                             // 추가한다.
                Optional<Component> component =
                        componentService.findByComponentSeq(Long.parseLong(item.getId()));

                if (component.isPresent()) {

                    // template 아이템 추가
                    SkinRel relationTP = new SkinRel();
                    relationTP.setRelType(MokaConstants.ITEM_TEMPLATE);
                    relationTP.setRelSeq(component.get().getTemplate().getTemplateSeq());
                    relationTP.setRelParentType(MokaConstants.ITEM_COMPONENT);
                    relationTP.setRelParentSeq(component.get().getComponentSeq());
                    relationTP.setRelOrd(item.getOrder());

                    // 동일한 아이템은 추가하지 않는다.
                    if (!skin.isEqualRel(relationTP)) {
                        relationTP.setSkin(skin);
                        relationTP.setDomain(skin.getDomain());
                        // skin.addSkinRel(relationTP);
                    }

                    // data 아이템 추가
                    if (component.get().getDataset() != null) {
                        SkinRel relatioDS = new SkinRel();
                        relatioDS.setRelType(MokaConstants.ITEM_DATASET);
                        relatioDS.setRelSeq(component.get().getDataset().getDatasetSeq());
                        relatioDS.setRelParentType(MokaConstants.ITEM_COMPONENT);
                        relatioDS.setRelParentSeq(component.get().getComponentSeq());
                        relatioDS.setRelOrd(item.getOrder());

                        if (!skin.isEqualRel(relatioDS)) {
                            relatioDS.setSkin(skin);
                            relatioDS.setDomain(skin.getDomain());
                            // skin.addSkinRel(relatioDS);
                        }
                    }

                }
            }
        }
    }

    /**
     * 히스토리저장
     * 
     * @param saveSkin 스킨정보
     * @param workType 작업유형
     * @param userName 작업자
     */
    private void insertHist(Skin saveSkin, String workType, String userName) {
        SkinHist hist = new SkinHist();
        hist.setSkin(saveSkin);
        hist.setDomain(saveSkin.getDomain());
        hist.setSkinBody(saveSkin.getSkinBody());
        hist.setWorkType(workType);

        if (workType.equals(TpsConstants.WORKTYPE_INSERT)) {
            hist.setRegDt(saveSkin.getRegDt());
            hist.setRegId(saveSkin.getRegId());
        } else if (workType.equals(TpsConstants.WORKTYPE_UPDATE)) {
            hist.setRegDt(saveSkin.getModDt());
            hist.setRegId(saveSkin.getModId());
        } else if (workType.equals(TpsConstants.WORKTYPE_DELETE)) {
            hist.setRegDt(McpDate.now());
            hist.setRegId(userName);
        }

        skinHistRepository.save(hist);
    }

    @Override
    public List<SkinVO> findRelList(RelSearchDTO search) {
        return skinRelMapper.findAll(search, McpMybatis.getRowBounds(search.getPage(), search.getSize()));
    }

    @Override
    public Long findRelCount(RelSearchDTO search) {
        return skinRelMapper.count(search);
    }

    @Override
    public void updateRelItems(Component newComponent, Component orgComponent) {

        // 템플릿 업데이트
        if (!newComponent.getTemplate().getTemplateSeq()
                .equals(orgComponent.getTemplate().getTemplateSeq())) {
            skinRelRepository.updateRelTemplates(newComponent);
        }

        // 데이타셋 업데이트
        boolean updateDS = false;
        if (!newComponent.getDataType().equals(orgComponent.getDataType()))
            updateDS = true;
        if (newComponent.getDataset() != null && orgComponent.getDataset() != null) {
            if (!newComponent.getDataset().getDatasetSeq()
                    .equals(orgComponent.getDataset().getDatasetSeq()))
                updateDS = true;
        }
        if (newComponent.getDataset() == null && orgComponent.getDataset() != null)
            updateDS = true;
        if (newComponent.getDataset() != null && orgComponent.getDataset() == null)
            updateDS = true;


        if (updateDS) {
            // datasetSeq가 추가된 경우: select -> insert. querydsl에서 insert는 안되므로 여기서 처리
            if (!newComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)
                    && orgComponent.getDataType().equals(TpsConstants.DATATYPE_NONE)) {

                List<SkinRel> relList = skinRelRepository.findList(MokaConstants.ITEM_COMPONENT,
                        newComponent.getComponentSeq());

                for (SkinRel rel : relList) {
                    SkinRel newRel = SkinRel.builder().skin(rel.getSkin()).domain(rel.getDomain())
                            .relType(MokaConstants.ITEM_DATASET)
                            .relSeq(newComponent.getDataset().getDatasetSeq())
                            .relParentType(MokaConstants.ITEM_COMPONENT)
                            .relParentSeq(newComponent.getComponentSeq())
                            .relOrd(rel.getRelOrd()).build();
                    skinRelRepository.save(newRel);
                }
            } else {
                skinRelRepository.updateRelDatasets(newComponent, orgComponent);
            }
        }
    }

    @Override
    public int countByDomainId(String domainId) {
        return skinRepository.countByDomain_DomainId(domainId);
    }
}
