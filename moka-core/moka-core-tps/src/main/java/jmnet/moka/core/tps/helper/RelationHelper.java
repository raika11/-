package jmnet.moka.core.tps.helper;

import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tps.common.dto.RelSearchDTO;
import jmnet.moka.core.tps.mvc.ad.service.AdService;
import jmnet.moka.core.tps.mvc.component.dto.ComponentDTO;
import jmnet.moka.core.tps.mvc.component.entity.Component;
import jmnet.moka.core.tps.mvc.component.service.ComponentService;
import jmnet.moka.core.tps.mvc.container.dto.ContainerDTO;
import jmnet.moka.core.tps.mvc.container.entity.Container;
import jmnet.moka.core.tps.mvc.container.service.ContainerService;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.page.service.PageService;
import jmnet.moka.core.tps.mvc.page.vo.PageVO;
import jmnet.moka.core.tps.mvc.reserved.service.ReservedService;
import jmnet.moka.core.tps.mvc.skin.service.SkinService;
import jmnet.moka.core.tps.mvc.skin.vo.SkinVO;
import jmnet.moka.core.tps.mvc.template.service.TemplateService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * 아이템에서 관련된 부모 찾는 헬퍼
 * @author ohtah
 *
 */
public class RelationHelper {

    @Autowired
    DomainService domainService;

    @Autowired
    PageService pageService;

    @Autowired
    SkinService skinService;

    @Autowired
    ContainerService containerService;

    @Autowired
    ComponentService componentService;
    
    @Autowired
    TemplateService templateService;
    
    @Autowired
    AdService adService;
    
    @Autowired
    ReservedService reservedService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * 관련 아이템이 있는 볼륨인지 체크
     *
     * @param volumeId 볼륨아이디
     * @return 유무
     */
    public Boolean isRelatedVolume(String volumeId) {

        // 도메인 체크
        if (domainService.countByVolumeId(volumeId) > 0) {
            return true;
        }

        return false;
    }

    /**
     * 관련 아이템이 있는 도메인인지 체크
     * @param domainId 도메인아이디
     * @return 유무
     */
    public Boolean isRelatedDomain(String domainId) {
        
        // 템플릿 체크
        if (templateService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        // 컴포넌트 체크
        if (componentService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        // 컨테이너 체크
        if (containerService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        // 페이지 체크
        RelSearchDTO search = RelSearchDTO.builder()
                .relSeqType(MspConstants.ITEM_DOMAIN)
                .domainId(domainId).build();
        search.setDefaultSort("pageSeq,desc");
        Page<jmnet.moka.core.tps.mvc.page.entity.Page> pages = 
                pageService.findByDomainId(domainId, search.getPageable());
        
        if (pages.getContent().size() > 1) {
            return true;
        } else if (pages.getContent().size() == 1) {
            jmnet.moka.core.tps.mvc.page.entity.Page one = pages.getContent().get(0);
            if (one.getParent() != null) {
                // 루트 페이지 체크
                return true;
            }
        }
        
        // 콘텐츠스킨 체크
        if (skinService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        // 광고 체크
        if (adService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        // 예약어 체크
        if (reservedService.countByDomainId(domainId) > 0) {
            return true;
        }
        
        return false;
    }

    /**
     * 관련 부모 아이템이 있는지 체크
     * @param seq 아이디
     * @param itemType 아이템 타입
     * @return 부모아이템 존재여부
     */
    public Boolean hasRelations(Long seq, String itemType) {
    	
        if (itemType.equals(MspConstants.ITEM_TEMPLATE)
        		|| itemType.equals(MspConstants.ITEM_DATASET)) {
            
            // 관련 컴포넌트가 있는지 확인한다
            RelSearchDTO search = RelSearchDTO.builder()
                    .relSeq(seq).relSeqType(itemType)
                    .relType(MspConstants.ITEM_COMPONENT).build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MspConstants.ITEM_TEMPLATE)
                || itemType.equals(MspConstants.ITEM_DATASET)
                || itemType.equals(MspConstants.ITEM_COMPONENT)
                || itemType.equals(MspConstants.ITEM_AD)) {
            
            // 관련 컨테이너가 있는지 확인한다
            RelSearchDTO search = RelSearchDTO.builder()
                    .relSeq(seq).relSeqType(itemType)
                    .relType(MspConstants.ITEM_CONTAINER).build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MspConstants.ITEM_TEMPLATE)
                || itemType.equals(MspConstants.ITEM_DATASET)
                || itemType.equals(MspConstants.ITEM_COMPONENT)
                || itemType.equals(MspConstants.ITEM_AD)
                || itemType.equals(MspConstants.ITEM_CONTAINER)) {
            
            // 관련 본문스킨이 있는지 확인한다
            RelSearchDTO search = RelSearchDTO.builder()
                    .relSeq(seq).relSeqType(itemType)
                    .relType(MspConstants.ITEM_CONTENT_SKIN).build();
            if (this.isRelated(search)) {
                return true;
            }
        }

        if (itemType.equals(MspConstants.ITEM_TEMPLATE)
                || itemType.equals(MspConstants.ITEM_DATASET)
                || itemType.equals(MspConstants.ITEM_COMPONENT)
                || itemType.equals(MspConstants.ITEM_AD)
                || itemType.equals(MspConstants.ITEM_CONTAINER)) {
            
            // 관련 페이지가 있는지 확인한다
            RelSearchDTO search = RelSearchDTO.builder()
                    .relSeq(seq).relSeqType(itemType)
                    .relType(MspConstants.ITEM_PAGE).build();
            if (this.isRelated(search)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 관련 부모 아이템이 있는지 체크
     * @param search 검색조건
     * @return 관련 부모 아이템 존재 여부
     */
    public boolean isRelated(RelSearchDTO search) {
        String relType = search.getRelType();

        if (relType.equals(MspConstants.ITEM_PAGE)) {
            
            // 페이지 목록 조회
        	search.setEntityClass(PageVO.class);
            search.setDefaultSort("pageSeq,desc");
            Long totalCount = pageService.findRelCount(search);
            if (totalCount > 0) return true;
            
        } else if (relType.equals(MspConstants.ITEM_CONTENT_SKIN)) {
            
            // 콘텐츠스킨 목록 조회
        	search.setEntityClass(SkinVO.class);
            search.setDefaultSort("skinSeq,desc");
            Long totalCount = skinService.findRelCount(search);
            if (totalCount > 0) return true;

        } else if (relType.equals(MspConstants.ITEM_CONTAINER)) {
            
            // 컨테이너 목록 조회
            search.setDefaultSort("containerSeq,desc");
            Pageable pageable = search.getPageable();
            Page<Container> containers = containerService.findRelList(search, pageable);
            if (containers.getTotalElements() > 0) return true;

        } else if (relType.equals(MspConstants.ITEM_COMPONENT)) {
            
            // 컴포넌트 목록 조회
            search.setDefaultSort("componentSeq,desc");
            Pageable pageable = search.getPageable();
            Page<Component> components = componentService.findRelList(search, pageable);
            if (components.getTotalElements() > 0) return true;
            
        }
        
        return false;
    }

    /**
     * <pre>
     * 관련아이템으로 Response 한다
     * </pre>
     * 
     * @param search 관련아이템 검색조건
     * @return 관련아이템 리스트
     */
    public ResponseEntity<?> findRelations(RelSearchDTO search) {
        String relType = search.getRelType();

        if (relType.equals(MspConstants.ITEM_PAGE)) {
            
        	// 페이지 목록 조회
        	search.setEntityClass(PageVO.class);
            search.setDefaultSort("pageSeq,desc");
            List<PageVO> pages = pageService.findRelList(search);
            Long totalCount = pageService.findRelCount(search);

            ResultListDTO<PageVO> resultListMessage = new ResultListDTO<PageVO>();
            resultListMessage.setTotalCnt(totalCount);
            resultListMessage.setList(pages);

            ResultDTO<ResultListDTO<PageVO>> resultDto =
                    new ResultDTO<ResultListDTO<PageVO>>(resultListMessage);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } else if (relType.equals(MspConstants.ITEM_CONTENT_SKIN)) {
            // 콘텐츠 스킨 목록 조회
        	search.setEntityClass(SkinVO.class);
            search.setDefaultSort("skinSeq,desc");
            List<SkinVO> skins = skinService.findRelList(search);
            Long totalCount = skinService.findRelCount(search);

            ResultListDTO<SkinVO> resultListMessage = new ResultListDTO<SkinVO>();
            resultListMessage.setTotalCnt(totalCount);
            resultListMessage.setList(skins);

            ResultDTO<ResultListDTO<SkinVO>> resultDto =
                    new ResultDTO<ResultListDTO<SkinVO>>(resultListMessage);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } else if (relType.equals(MspConstants.ITEM_CONTAINER)) {
            
        	// 컨테이너 목록 조회
            search.setDefaultSort("containerSeq,desc");
            Pageable pageable = search.getPageable();

            Page<Container> containers = containerService.findRelList(search, pageable);
            ResultListDTO<ContainerDTO> resultListMessage = new ResultListDTO<ContainerDTO>();

            List<ContainerDTO> dtoList =
                    modelMapper.map(containers.getContent(), ContainerDTO.TYPE);
            resultListMessage.setTotalCnt(containers.getTotalElements());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<ContainerDTO>> resultDto =
                    new ResultDTO<ResultListDTO<ContainerDTO>>(resultListMessage);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } else if (relType.equals(MspConstants.ITEM_COMPONENT)) {
            
        	// 컴포넌트 목록 조회
            search.setDefaultSort("componentSeq,desc");
            Pageable pageable = search.getPageable();

            Page<Component> components = componentService.findRelList(search, pageable);
            ResultListDTO<ComponentDTO> resultListMessage = new ResultListDTO<ComponentDTO>();

            List<ComponentDTO> dtoList =
                    modelMapper.map(components.getContent(), ComponentDTO.TYPE);
            resultListMessage.setTotalCnt(components.getTotalElements());
            resultListMessage.setList(dtoList);

            ResultDTO<ResultListDTO<ComponentDTO>> resultDto =
                    new ResultDTO<ResultListDTO<ComponentDTO>>(resultListMessage);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        }

        return new ResponseEntity<>(new ResultDTO<Boolean>(false), HttpStatus.OK);
    }
}
