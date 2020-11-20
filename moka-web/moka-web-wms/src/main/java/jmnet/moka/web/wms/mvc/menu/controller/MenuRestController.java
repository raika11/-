package jmnet.moka.web.wms.mvc.menu.controller;

import io.swagger.annotations.ApiOperation;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.menu.dto.MenuAuthBatchDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuAuthSimpleDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNodeDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuOrderDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import jmnet.moka.web.wms.mvc.menu.service.RouteConfigService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * <pre>
 * 메뉴 관리 Controller
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.menu.controller
 * ClassName : MenuRestController
 * Created : 2020-11-06 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-06 09:14
 */
@RestController
@Validated
@Slf4j
@RequestMapping("/api/menus")
public class MenuRestController {

    private final MenuService menuService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;

    private final RouteConfigService menuConfigService;


    public MenuRestController(MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger,
            RouteConfigService menuConfigService) {
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
        this.menuConfigService = menuConfigService;
    }

    /**
     * 메뉴목록조회
     *
     * @param search 검색조건
     * @return 메뉴목록
     */
    @ApiOperation(value = "메뉴 목록 조회")
    @GetMapping
    public ResponseEntity<?> getMenuList(@SearchParam MenuSearchDTO search) {

        ResultListDTO<MenuDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        if (McpString.isYes(search.getUseTotal())) {
            Page<Menu> returnValue = menuService.findAllMenu(search);
            List<MenuDTO> menuDtoList = modelMapper.map(returnValue.getContent(), MenuDTO.TYPE);
            resultListMessage.setTotalCnt(returnValue.getTotalElements());
            resultListMessage.setList(menuDtoList);
        } else {
            List<Menu> returnValue = menuService.findAllMenuByParentId(search.getParentMenuId());
            List<MenuDTO> menuDtoList = modelMapper.map(returnValue, MenuDTO.TYPE);
            resultListMessage.setList(menuDtoList);
        }

        ResultDTO<ResultListDTO<MenuDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(true);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 메뉴목록조회
     *
     * @return 메뉴목록
     */
    @ApiOperation(value = "메뉴 목록 트리 조회")
    @GetMapping("/tree")
    public ResponseEntity<?> getMenuTree(@SearchParam MenuSearchDTO search) {

        // 조회
        MenuNodeDTO menuNodeDTO = menuService.findMenuTree(search);

        // 리턴값 설정
        ResultDTO<MenuNodeDTO> resultDto = new ResultDTO<>(menuNodeDTO);

        tpsLogger.success();

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * 메뉴정보 조회
     *
     * @param request 요청
     * @param menuSeq 메뉴 일련번호 (필수)
     * @return 메뉴정보
     * @throws NoDataException 메뉴 정보가 없음
     */
    @ApiOperation(value = "메뉴 조회")
    @GetMapping("/{menuSeq}")
    public ResponseEntity<?> getMenu(HttpServletRequest request,
            @PathVariable("menuSeq") @Min(value = 0, message = "{tps.menu.error.min.menuSeq}") Long menuSeq)
            throws NoDataException {

        String message = messageByLocale.get("tps.menu.error.no-data", request);
        Menu menu = menuService
                .findMenuBySeq(menuSeq)
                .orElseThrow(() -> new NoDataException(message));

        MenuDTO dto = modelMapper.map(menu, MenuDTO.class);

        tpsLogger.success();

        ResultDTO<MenuDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 메뉴 중복 아이디 체크
     *
     * @param menuId 메뉴아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{menuId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId) {

        boolean duplicated = menuService.isDuplicatedId(menuId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param request 요청
     * @param menuDTO 등록할 메뉴정보
     * @return 등록된 메뉴정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "메뉴 등록")
    @PostMapping
    public ResponseEntity<?> postMenu(HttpServletRequest request, @Valid MenuDTO menuDTO)
            throws InvalidDataException, Exception {

        // MenuDTO -> Menu 변환
        Menu menu = modelMapper.map(menuDTO, Menu.class);

        try {
            // insert
            if (!menuService.isDuplicatedId(menuDTO.getMenuId())) {
                Menu returnValue = menuService.insertMenu(menu);

                // 결과리턴
                MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
                ResultDTO<MenuDTO> resultDto = new ResultDTO<>(dto, messageByLocale.get("tps.menu.success.insert", request));
                menuConfigService.addMenuRoute(dto.getMenuUrl());
                // 액션 로그에 성공 로그 출력
                tpsLogger.success();

                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                // 중복 아이디 발생으로 인해 실패 로그 출력
                tpsLogger.fail(messageByLocale.get("tps.menu.error.duplicated.menuId", request));

                return new ResponseEntity<>(MapBuilder
                        .getInstance()
                        .add("message", messageByLocale.get("tps.menu.error.duplicated.menuId", request))
                        .getMultiValueMap(), HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("[FAIL TO INSERT MENU]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(e.toString());
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request 요청
     * @param menuSeq 메뉴 일련번호
     * @param menuDTO 수정할 메뉴정보
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "메뉴 수정")
    @PutMapping("/{menuSeq}")
    public ResponseEntity<?> putMenu(HttpServletRequest request,
            @PathVariable("menuSeq") @Min(value = 0, message = "{tps.menu.error.min.menuSeq}") Long menuSeq, @Valid MenuDTO menuDTO)
            throws Exception {


        // MenuDTO -> Menu 변환
        String infoMessage = messageByLocale.get("tps.menu.error.no-data", request);
        Menu newMenu = modelMapper.map(menuDTO, Menu.class);

        // 오리진 데이터 조회
        Menu orgMenu = menuService
                .findMenuBySeq(menuSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            // update
            Menu returnValue = menuService.updateMenu(newMenu);


            // 결과리턴
            MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
            ResultDTO<MenuDTO> resultDto = new ResultDTO<>(dto, messageByLocale.get("tps.menu.success.update", request));

            // menu url이 변경 되었다면 route 설정 변경
            if (McpString.isNotEmpty(orgMenu.getMenuUrl()) && !orgMenu
                    .getMenuUrl()
                    .equals(dto.getMenuUrl())) {
                menuConfigService.changeMenuRoute(orgMenu.getMenuUrl(), dto.getMenuUrl());
            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }

    /**
     * 순서 수정
     *
     * @param request 요청
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "메뉴 순서 조절")
    @PutMapping("/{parentMenuId}/change-order-children")
    public ResponseEntity<?> putMenuOrder(HttpServletRequest request,
            @PathVariable("parentMenuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.pattern.parentMenuId}") String parentMenuId,
            @RequestBody List<@Valid MenuOrderDTO> menuOrders)
            throws Exception {

        // 데이터 조회
        String noContentMessage = messageByLocale.get("tps.menu.error.no-data", request);
        Menu parentMenu = menuService
                .findMenuById(parentMenuId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        List<Menu> menuList = menuService.findAllMenuByParentId(parentMenuId);

        try {
            if (menuList != null) {
                menuList.forEach((Menu menu) -> menuOrders
                        .stream()
                        .filter(menuOrder -> menuOrder
                                .getMenuId()
                                .equals(menu.getMenuId()))
                        .findFirst()
                        .ifPresent(menuOrder -> {
                            menu.setMenuOrder(menuOrder.getMenuOrder());
                            // 순서 뿐만 아니라 depth도 부모의 depth의 +1하여 저장한다.
                            menu.setDepth(parentMenu.getDepth() + 1);
                            menuService.updateMenu(menu);
                        }));
            }
            if (menuList != null) {
                menuList.sort(Comparator.comparingInt(Menu::getMenuOrder));
            }

            // 결과리턴
            List<MenuDTO> resultList = modelMapper.map(menuList, MenuDTO.TYPE);
            ResultDTO<List<MenuDTO>> resultDto = new ResultDTO<>(resultList, messageByLocale.get("tps.menu.success.change-menuOrder", request));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }


    /**
     * 여러 메뉴의 그룹 권한 수정
     *
     * @param request          요청
     * @param menuAuthBatchDTO 메뉴권한목록
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "여러 메뉴의 그룹 권한 수정")
    @PutMapping("/groups/auths")
    public ResponseEntity<?> putGroupMenuAuthBatch(HttpServletRequest request, @Valid MenuAuthBatchDTO menuAuthBatchDTO)
            throws Exception {

        try {
            menuAuthBatchDTO
                    .getMenuIds()
                    .forEach(menuId -> {
                        try {
                            saveMenuAuth(menuId, MenuAuthTypeCode.GROUP, menuAuthBatchDTO.getMenuAuths());
                        } catch (Exception ex) {
                            tpsLogger.skip(ex.toString());
                        }
                    });

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }


    /**
     * 여러 메뉴의 사용자 권한 수정
     *
     * @param request          요청
     * @param menuAuthBatchDTO 메뉴권한목록
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "메뉴 권한 수정")
    @PutMapping("/members/auths")
    public ResponseEntity<?> putMemberMenuAuth(HttpServletRequest request, @Valid MenuAuthBatchDTO menuAuthBatchDTO)
            throws Exception {

        try {
            menuAuthBatchDTO
                    .getMenuIds()
                    .forEach(menuId -> {
                        try {
                            saveMenuAuth(menuId, MenuAuthTypeCode.MEMBER, menuAuthBatchDTO.getMenuAuths());
                        } catch (Exception ex) {
                            tpsLogger.skip(ex.toString());
                        }
                    });

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }

    /**
     * 여러 메뉴의 사용자 권한 수정
     *
     * @param request      요청
     * @param menuAuthSeqs 메뉴 권한 시퀀스 목록
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "메뉴 권한 수정")
    @PutMapping("/auths")
    public ResponseEntity<?> deleteMemberMenuAuth(HttpServletRequest request, List<Long> menuAuthSeqs)
            throws Exception {

        try {
            menuAuthSeqs.forEach(seq -> {
                try {
                    menuService.deleteMenuAuth(seq);
                } catch (Exception ex) {
                    tpsLogger.skip(ex.toString());
                }
            });

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU AUTH]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }


    /**
     * 메뉴 권한 저장
     *
     * @param menuId             아아디
     * @param menuAuthType       권한 구분
     * @param menuAuthSimpleDTOs 권한 정보 목록
     * @return 성공 결과 수
     */
    public int saveMenuAuth(String menuId, MenuAuthTypeCode menuAuthType, List<MenuAuthSimpleDTO> menuAuthSimpleDTOs) {
        AtomicInteger successCount = new AtomicInteger(0);
        menuAuthSimpleDTOs.forEach(menuAuthSimpleDTO -> {
            menuService.saveMenuAuth(menuId, menuAuthType, modelMapper.map(menuAuthSimpleDTO, MenuAuth.class));
            successCount.addAndGet(1);
        });
        return successCount.get();
    }


    /**
     * 메뉴 권한 존재 여부
     *
     * @param request 요청
     * @param menuId  존재 여부 확인 메뉴ID
     * @return 존재여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 메뉴 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "메뉴 권한 존재 여부")
    @GetMapping("/{menuId}/exist-auth")
    public ResponseEntity<?> existAuth(HttpServletRequest request,
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId)
            throws InvalidDataException, NoDataException, Exception {


        // 메뉴 데이터 조회
        String noContentMessage = messageByLocale.get("tps.menu.error.no-data", request);
        menuService
                .findMenuById(menuId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            boolean exists = menuService.isUsedGroupOrMember(menuId);
            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, exists ? messageByLocale.get("tps.menu.error.delete.related", request) : null);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SELECT MENU] menuId: {} {}", menuId, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.common.error", request), e);
        }
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param menuId  삭제 할 메뉴아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 메뉴 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "메뉴 삭제")
    @DeleteMapping("/{menuId}")
    public ResponseEntity<?> deleteMenu(HttpServletRequest request,
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId)
            throws InvalidDataException, NoDataException, Exception {


        // 메뉴 데이터 조회
        String noContentMessage = messageByLocale.get("tps.menu.error.no-data", request);
        Menu menu = menuService
                .findMenuById(menuId)
                .orElseThrow(() -> new NoDataException(noContentMessage));
        boolean success = false;
        String message;
        Menu parentMenu = null;
        try {
            if (!McpString
                    .defaultValue(menu.getParentMenuId(), TpsConstants.ROOT_MENU_ID)
                    .equals(TpsConstants.ROOT_MENU_ID)) {
                parentMenu = menuService
                        .findMenuById(menu.getParentMenuId())
                        .orElse(null);
            }

            // 삭제
            if (!menuService.isUsedGroupOrMember(menuId)) {
                if (menuService.countMenuByParentId(menuId) == 0) {
                    menuService.deleteMenu(menu);
                    success = true;
                    message = messageByLocale.get("tps.menu.success.delete", request);
                } else {
                    message = messageByLocale.get("tps.menu.error.delete.exist.children", request);
                }
            } else {
                message = messageByLocale.get("tps.menu.error.delete.related", request);
            }

            if (success) {
                menuConfigService.removeMenuRoute(menu.getMenuUrl());
                // 액션 로그에 성공 로그 출력
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // 결과리턴
            ResultMapDTO resultMapDTO = new ResultMapDTO(MapBuilder
                    .getInstance()
                    .add("success", success)
                    .add("parentMenu", parentMenu)
                    .getMap(), message);

            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU] menuId: {} {}", menuId, e.getMessage());
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.delete", request), e);
        }
    }



}
