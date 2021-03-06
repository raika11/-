package jmnet.moka.web.wms.mvc.menu.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.logger.TpsLogger;
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
 * ?????? ?????? Controller
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
@Api(tags = {"?????? API"})
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
     * ??????????????????
     *
     * @param search ????????????
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getMenuList(@SearchParam MenuSearchDTO search) {

        ResultListDTO<MenuDTO> resultListMessage = new ResultListDTO<>();

        // ??????
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
     * ??????????????????
     *
     * @return ????????????
     */
    @ApiOperation(value = "?????? ?????? ?????? ??????")
    @GetMapping("/tree")
    public ResponseEntity<?> getMenuTree(@SearchParam MenuSearchDTO search) {

        // ??????
        MenuNodeDTO menuNodeDTO = menuService.findMenuTree(search);

        // ????????? ??????
        ResultDTO<MenuNodeDTO> resultDto = new ResultDTO<>(menuNodeDTO);

        tpsLogger.success();

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * ???????????? ??????
     *
     * @param request ??????
     * @param menuSeq ?????? ???????????? (??????)
     * @return ????????????
     * @throws NoDataException ?????? ????????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @GetMapping("/{menuSeq}")
    public ResponseEntity<?> getMenu(HttpServletRequest request,
            @ApiParam("?????? ????????????") @PathVariable("menuSeq") @Min(value = 0, message = "{tps.menu.error.min.menuSeq}") Long menuSeq)
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
     * ?????? ?????? ????????? ??????
     *
     * @param menuId ???????????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ??????")
    @GetMapping("/{menuId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @ApiParam("?????? ID") @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId) {

        boolean duplicated = menuService.isDuplicatedId(menuId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param menuDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @PostMapping
    public ResponseEntity<?> postMenu(HttpServletRequest request, @Valid MenuDTO menuDTO)
            throws InvalidDataException, Exception {

        // MenuDTO -> Menu ??????
        Menu menu = modelMapper.map(menuDTO, Menu.class);

        try {
            // insert
            if (!menuService.isDuplicatedId(menuDTO.getMenuId())) {
                Menu returnValue = menuService.insertMenu(menu);

                // ????????????
                MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
                ResultDTO<MenuDTO> resultDto = new ResultDTO<>(dto, messageByLocale.get("tps.menu.success.insert", request));
                menuConfigService.addMenuRoute(dto.getMenuUrl());
                // ?????? ????????? ?????? ?????? ??????
                tpsLogger.success();

                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                // ?????? ????????? ???????????? ?????? ?????? ?????? ??????
                tpsLogger.fail(messageByLocale.get("tps.menu.error.duplicated.menuId", request));

                return new ResponseEntity<>(MapBuilder
                        .getInstance()
                        .add("message", messageByLocale.get("tps.menu.error.duplicated.menuId", request))
                        .getMultiValueMap(), HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("[FAIL TO INSERT MENU]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e.toString());
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param menuSeq ?????? ????????????
     * @param menuDTO ????????? ????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ??????")
    @PutMapping("/{menuSeq}")
    public ResponseEntity<?> putMenu(HttpServletRequest request,
            @ApiParam("?????? ????????????") @PathVariable("menuSeq") @Min(value = 0, message = "{tps.menu.error.min.menuSeq}") Long menuSeq,
            @Valid MenuDTO menuDTO)
            throws Exception {


        // MenuDTO -> Menu ??????
        String infoMessage = messageByLocale.get("tps.menu.error.no-data", request);
        Menu newMenu = modelMapper.map(menuDTO, Menu.class);

        // ????????? ????????? ??????
        Menu orgMenu = menuService
                .findMenuBySeq(menuSeq)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            newMenu.setMenuSeq(menuSeq);
            // update
            Menu returnValue = menuService.updateMenu(newMenu);


            // ????????????
            MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
            ResultDTO<MenuDTO> resultDto = new ResultDTO<>(dto, messageByLocale.get("tps.menu.success.update", request));

            // menu url??? ?????? ???????????? route ?????? ??????
            if (McpString.isNotEmpty(orgMenu.getMenuUrl()) && !orgMenu
                    .getMenuUrl()
                    .equals(dto.getMenuUrl())) {
                menuConfigService.changeMenuRoute(orgMenu.getMenuUrl(), dto.getMenuUrl());
            }

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }

    /**
     * ?????? ??????
     *
     * @param request ??????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @PutMapping("/{parentMenuId}/change-order-children")
    public ResponseEntity<?> putMenuOrder(HttpServletRequest request, @ApiParam("?????? ?????? ID") @PathVariable("parentMenuId")
    @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.pattern.parentMenuId}") String parentMenuId,
            @RequestBody List<@Valid MenuOrderDTO> menuOrders)
            throws Exception {

        // ????????? ??????
        String noContentMessage = messageByLocale.get("tps.menu.error.no-data", request);



        Menu parentMenu = parentMenuId.equals(MenuService.ROOT_MENU_ID)
                ? new Menu()
                : menuService
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
                            // ?????? ?????? ????????? depth??? ????????? depth??? +1?????? ????????????.
                            menu.setDepth(parentMenu.getDepth() + 1);
                            menuService.updateMenu(menu);
                        }));
            }
            if (menuList != null) {
                menuList.sort(Comparator.comparingInt(Menu::getMenuOrder));
            }

            // ????????????
            List<MenuDTO> resultList = modelMapper.map(menuList, MenuDTO.TYPE);
            ResultDTO<List<MenuDTO>> resultDto = new ResultDTO<>(resultList, messageByLocale.get("tps.menu.success.change-menuOrder", request));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }


    /**
     * ?????? ????????? ?????? ?????? ??????
     *
     * @param request          ??????
     * @param menuAuthBatchDTO ??????????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ?????? ??????")
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

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }


    /**
     * ?????? ????????? ????????? ?????? ??????
     *
     * @param request          ??????
     * @param menuAuthBatchDTO ??????????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ??????")
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

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU AUTH]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }

    /**
     * ?????? ????????? ????????? ?????? ??????
     *
     * @param request      ??????
     * @param menuAuthSeqs ?????? ?????? ????????? ??????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ?????? ??????")
    @PutMapping("/auths")
    public ResponseEntity<?> deleteMemberMenuAuth(HttpServletRequest request, @ApiParam("?????? ????????????") List<Long> menuAuthSeqs)
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

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success();

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU AUTH]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.auth.error.save", request), e);
        }
    }


    /**
     * ?????? ?????? ??????
     *
     * @param menuId             ?????????
     * @param menuAuthType       ?????? ??????
     * @param menuAuthSimpleDTOs ?????? ?????? ??????
     * @return ?????? ?????? ???
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
     * ?????? ?????? ?????? ??????
     *
     * @param request ??????
     * @param menuId  ?????? ?????? ?????? ??????ID
     * @return ????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ?????? ?????? ??????")
    @GetMapping("/{menuId}/exist-auth")
    public ResponseEntity<?> existAuth(HttpServletRequest request,
            @ApiParam("?????? ID") @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId)
            throws InvalidDataException, NoDataException, Exception {


        // ?????? ????????? ??????
        String noContentMessage = messageByLocale.get("tps.menu.error.no-data", request);
        menuService
                .findMenuById(menuId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            boolean exists = menuService.isUsedGroupOrMember(menuId);
            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, exists ? messageByLocale.get("tps.menu.error.delete.related", request) : null);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO SELECT MENU] menuId: {} {}", menuId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.common.error", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param menuId  ?????? ??? ??????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ?????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "?????? ??????")
    @DeleteMapping("/{menuId}")
    public ResponseEntity<?> deleteMenu(HttpServletRequest request,
            @ApiParam("?????? ID") @PathVariable("menuId") @Pattern(regexp = "[0-9]{2,8}$", message = "{tps.menu.error.length.menuId}") String menuId)
            throws InvalidDataException, NoDataException, Exception {


        // ?????? ????????? ??????
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

            // ??????
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
                // ?????? ????????? ?????? ?????? ??????
                tpsLogger.success(message);
            } else {
                tpsLogger.fail(message);
            }

            // ????????????
            ResultMapDTO resultMapDTO = new ResultMapDTO(MapBuilder
                    .getInstance()
                    .add("success", success)
                    .add("parentMenu", parentMenu)
                    .getMap(), message);

            return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU] menuId: {} {}", menuId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(e);
            throw new Exception(messageByLocale.get("tps.menu.error.delete", request), e);
        }
    }



}
