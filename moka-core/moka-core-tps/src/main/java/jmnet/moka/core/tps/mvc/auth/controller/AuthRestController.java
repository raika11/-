package jmnet.moka.core.tps.mvc.auth.controller;

import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.helper.ApiCodeHelper;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import jmnet.moka.core.tps.mvc.domain.entity.Domain;
import jmnet.moka.core.tps.mvc.domain.service.DomainService;
import jmnet.moka.core.tps.mvc.codeMgt.entity.CodeMgt;
import jmnet.moka.core.tps.mvc.codeMgt.service.CodeMgtService;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;

/**
 * <pre>
 * 사용자 권한  
 * 2020. 1. 28. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 1. 28. 오후 2:09:06
 * @author ssc
 */
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private DomainService domainService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CodeMgtService codeMgtService;

    @Autowired
    private ApiCodeHelper apiCodeHelper;


    @Autowired
    private MenuService menuService;

    @Autowired
    private MessageByLocale messageByLocale;

    /**
     * <pre>
     * 사용자 메뉴목록조회
     * </pre>
     * 
     * @return 메뉴목록
     * @throws NoDataException
     */
    @GetMapping("/menus")
    public ResponseEntity<?> getMenuList(HttpServletRequest request) throws NoDataException {

        MenuNode menuNode = menuService.makeTree();
        if (menuNode == null) {
            throw new NoDataException(messageByLocale.get("tps.menu.error.noContent", request));
        }

        ResultDTO<MenuNode> resultDto = new ResultDTO<MenuNode>(menuNode);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    // private List<MenuNode> makeMenuTree() {
    // List<MenuNode> rootNode = new ArrayList<MenuNode>();
    //
    // MenuNode menu01 = createMenuNode("01", "/", "화면편집", "desking", "", 1, 1, "dashboard");
    // rootNode.add(menu01);
    //
    // MenuNode menu02 = createMenuNode("02", "", "페이지서비스", "page", "", 1, 2, "layers");
    // rootNode.add(menu02);
    // MenuNode menu02001 = createMenuNode("02001", "/page", "페이지 관리", "page", "02", 2, 1, "");
    // menu02.add(menu02001);
    // // MenuNode menu02002 = createMenuNode("02002", "/props", "리소스 관리", "resource", "02", 2, 2,
    // // "");
    // // menu02.add(menu02002);
    // MenuNode menu02003 =
    // createMenuNode("02003", "/container", "컨테이너 관리", "container", "02", 2, 3, "");
    // menu02.add(menu02003);
    // MenuNode menu02004 =
    // createMenuNode("02004", "/component", "컴포넌트 관리", "component", "02", 2, 4, "");
    // menu02.add(menu02004);
    // MenuNode menu02005 =
    // createMenuNode("02005", "/template", "템플릿 관리", "template", "02", 2, 5, "");
    // menu02.add(menu02005);
    // MenuNode menu02006 =
    // createMenuNode("02006", "/dataset", "데이타셋 관리", "dataset", "02", 2, 6, "");
    // menu02.add(menu02006);
    // MenuNode menu02007 =
    // createMenuNode("02007", "/reserved", "예약어 관리", "reserved", "02", 2, 7, "");
    // menu02.add(menu02007);
    // MenuNode menu02008 =
    // createMenuNode("02008", "/resource", "리소스 관리", "resource", "02", 2, 8, "");
    // menu02.add(menu02008);
    // MenuNode menu02009 =
    // createMenuNode("02009", "/rmslink", "리소스 탐색", "rmslink", "02", 2, 9, "");
    // menu02.add(menu02009);
    // MenuNode menu02010 = createMenuNode("02010", "/skin", "콘텐츠스킨 관리", "skin", "02", 2, 10, "");
    // menu02.add(menu02010);
    // MenuNode menu02011 =
    // createMenuNode("02011", "/style", "소재스타일 관리", "style", "02", 2, 11, "");
    // menu02.add(menu02011);
    // MenuNode menu02012 = createMenuNode("02012", "/test", "테스트", "test", "02", 2, 12, "");
    // menu02.add(menu02012);
    //
    // MenuNode menu03 = createMenuNode("03", "/ad", "광고 관리", "advertise", "", 1, 3, "");
    // rootNode.add(menu03);
    //
    // MenuNode menu04 = createMenuNode("04", "", "시스템", "system", "", 1, 4, "developer_board");
    // rootNode.add(menu04);
    // MenuNode menu04001 = createMenuNode("04001", "/domain", "도메인 관리", "domain", "04", 4, 1, "");
    // menu04.add(menu04001);
    // MenuNode menu04002 = createMenuNode("04002", "/volume", "볼륨 관리", "volume", "04", 4, 2, "");
    // menu04.add(menu04002);
    // MenuNode menu04003 =
    // createMenuNode("04003", "/etccodeType", "기타코드 관리", "etccodeType", "04", 4, 3, "");
    // menu04.add(menu04003);
    //
    // return rootNode;
    // }
    //
    // private MenuNode createMenuNode(String menuId, String url, String displayName, String name,
    // String parentMenuId, int depth, int order, String iconName) {
    // return MenuNode.builder().menuId(menuId).url(url).displayName(displayName).name(name)
    // .parentMenuId(parentMenuId).depth(depth).order(order).iconName(iconName).build();
    // }


    /**
     * 도메인목록조회(권한별 모든 도메인목록)
     * 
     * @param request 요청
     * @return 도메인목록
     */
    @GetMapping("/domains")
    public ResponseEntity<?> getDomainList(HttpServletRequest request) {
        // 조회
        List<Domain> returnValue = domainService.findDomainList();

        // 리턴값 설정
        ResultListDTO<DomainDTO> resultListMessage = new ResultListDTO<DomainDTO>();
        List<DomainDTO> domainDtoList = modelMapper.map(returnValue, DomainDTO.TYPE);

        List<CodeMgt> CodeMgts = codeMgtService.findUseList(TpsConstants.DATAAPI);
        List<DomainDTO> domainDtoMapList = domainDtoList.stream().map((item) -> {
            String apiCodeId =
                    apiCodeHelper.getDataApiCode(CodeMgts, item.getApiHost(), item.getApiPath());
            if (apiCodeId != null) {
                item.setApiCodeId(apiCodeId);
            }
            return item;
        }).collect(Collectors.toList());

        resultListMessage.setTotalCnt(returnValue.size());
        resultListMessage.setList(domainDtoMapList);

        ResultDTO<ResultListDTO<DomainDTO>> resultDto =
                new ResultDTO<ResultListDTO<DomainDTO>>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}
