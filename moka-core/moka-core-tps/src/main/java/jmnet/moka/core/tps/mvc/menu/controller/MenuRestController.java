package jmnet.moka.core.tps.mvc.menu.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.menu.dto.MenuDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.entity.Menu;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
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
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Validated
@Slf4j
@RequestMapping("/api/menus")
public class MenuRestController {

    private final MenuService menuService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final ActionLogger actionLogger;


    public MenuRestController(MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale, ActionLogger actionLogger) {
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.actionLogger = actionLogger;
    }

    /**
     * 메뉴목록조회
     *
     * @param request 요청
     * @param search  검색조건
     * @return 메뉴목록
     */
    @ApiOperation(value = "메뉴 목록 조회")
    @GetMapping
    public ResponseEntity<?> getMenuList(HttpServletRequest request, @SearchParam SearchDTO search, @NotNull Principal principal,
            @RequestAttribute Long processStartTime) {

        // 조회
        Page<Menu> returnValue = menuService.findAllMenu(search);

        // 리턴값 설정
        ResultListDTO<MenuDTO> resultListMessage = new ResultListDTO<MenuDTO>();
        List<MenuDTO> menuDtoList = modelMapper.map(returnValue.getContent(), MenuDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(menuDtoList);

        ResultDTO<ResultListDTO<MenuDTO>> resultDto = new ResultDTO<ResultListDTO<MenuDTO>>(resultListMessage);

        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 메뉴목록조회
     *
     * @param request 요청
     * @return 메뉴목록
     */
    @ApiOperation(value = "메뉴 목록 트리 조회")
    @GetMapping("/tree")
    public ResponseEntity<?> getMenuTree(HttpServletRequest request, @NotNull Principal principal, @RequestAttribute Long processStartTime) {

        // 조회
        MenuNode menuNode = menuService.findMenuTree();

        // 리턴값 설정
        ResultDTO<MenuNode> resultDto = new ResultDTO<MenuNode>(menuNode);

        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * 메뉴정보 조회
     *
     * @param request 요청
     * @param menuId  메뉴아이디 (필수)
     * @return 메뉴정보
     * @throws NoDataException      메뉴 정보가 없음
     * @throws InvalidDataException 메뉴 아이디 형식오류
     */
    @ApiOperation(value = "메뉴 조회")
    @GetMapping("/{menuId}")
    public ResponseEntity<?> getMenu(HttpServletRequest request,
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.menu.error.invalid.menuId}") String menuId,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws NoDataException, InvalidDataException {

        String message = messageByLocale.get("tps.menu.error.noContent", request);
        Menu menu = menuService.findMenuById(menuId)
                               .orElseThrow(() -> new NoDataException(message));

        MenuDTO dto = modelMapper.map(menu, MenuDTO.class);

        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        ResultDTO<MenuDTO> resultDto = new ResultDTO<MenuDTO>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 메뉴 중복 아이디 체크
     *
     * @param request HTTP 요청
     * @param menuId  메뉴아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{menuId}/exists")
    public ResponseEntity<?> duplicateCheckId(HttpServletRequest request,
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{4}$", message = "{tps.menu.error.invalid.menuId}") String menuId) {

        boolean duplicated = menuService.isDuplicatedId(menuId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<Boolean>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param request   요청
     * @param menuDTO   등록할 메뉴정보
     * @param principal 로그인사용자 세션
     * @return 등록된 메뉴정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "메뉴 등록")
    @PostMapping
    public ResponseEntity<?> postMenu(HttpServletRequest request, @Valid MenuDTO menuDTO, @NotNull Principal principal,
            @RequestAttribute Long processStartTime)
            throws InvalidDataException, Exception {

        // MenuDTO -> Menu 변환
        Menu menu = modelMapper.map(menuDTO, Menu.class);
        //        menu.setRegDt(McpDate.now());
        menu.setRegId(principal.getName());

        try {
            // insert
            if (!menuService.isDuplicatedId(menuDTO.getMenuId())) {
                Menu returnValue = menuService.insertMenu(menu);

                // 결과리턴
                MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
                ResultDTO<MenuDTO> resultDto = new ResultDTO<MenuDTO>(dto);

                // 액션 로그에 성공 로그 출력
                actionLogger.success(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime);

                return new ResponseEntity<>(resultDto, HttpStatus.OK);
            } else {
                // 중복 아이디 발생으로 인해 실패 로그 출력
                actionLogger.fail(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime,
                                  messageByLocale.get("tps.menu.error.duplicated.menuId", request));

                return new ResponseEntity<>(MapBuilder.getInstance()
                                                      .add("message", messageByLocale.get("tps.menu.error.duplicated.menuId", request))
                                                      .getMultiValueMap(), HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("[FAIL TO INSERT MENU]", e);
            // 액션 로그에 오류 내용 출력
            actionLogger.error(principal.getName(), ActionType.INSERT, System.currentTimeMillis() - processStartTime, e.toString());
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request   요청
     * @param menuId    메뉴아이디
     * @param menuDTO   수정할 메뉴정보
     * @param principal 로그인사용자세션
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "메뉴 수정")
    @PutMapping("/{menuId}")
    public ResponseEntity<?> putMenu(HttpServletRequest request,
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{8}$", message = "{tps.menu.error.invalid.menuId}") String menuId, @Valid MenuDTO menuDTO,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws Exception {


        // MenuDTO -> Menu 변환
        String infoMessage = messageByLocale.get("tps.menu.error.noContent", request);
        Menu newMenu = modelMapper.map(menuDTO, Menu.class);

        // 오리진 데이터 조회
        Menu orgMenu = menuService.findMenuById(newMenu.getMenuId())
                                  .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            // update
            Menu returnValue = menuService.updateMenu(newMenu);


            // 결과리턴
            MenuDTO dto = modelMapper.map(returnValue, MenuDTO.class);
            ResultDTO<MenuDTO> resultDto = new ResultDTO<MenuDTO>(dto);

            // 액션 로그에 성공 로그 출력
            actionLogger.success(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MENU]", e);
            // 액션 로그에 에러 로그 출력
            actionLogger.error(principal.getName(), ActionType.UPDATE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.menu.error.save", request), e);
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
            @PathVariable("menuId") @Pattern(regexp = "[0-9]{8}$", message = "{tps.menu.error.invalid.menuId}") String menuId,
            @NotNull Principal principal, @RequestAttribute Long processStartTime)
            throws InvalidDataException, NoDataException, Exception {


        // 메뉴 데이터 조회
        String noContentMessage = messageByLocale.get("tps.menu.error.noContent", request);
        Menu menu = menuService.findMenuById(menuId)
                               .orElseThrow(() -> new NoDataException(noContentMessage));
        boolean success = false;
        try {
            // 삭제
            if (!menuService.isUsedGroupOrMember(menuId)) {
                menuService.deleteMenu(menu);
                success = true;
                // 액션 로그에 성공 로그 출력
                actionLogger.success(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime);
            } else {
                actionLogger.fail(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime,
                                  messageByLocale.get("tps.menu.error.delete.related", request));
            }

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<Boolean>(success);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MENU] menuId: {}) {}", menuId, e.getMessage());
            // 액션 로그에 에러 로그 출력
            actionLogger.error(principal.getName(), ActionType.DELETE, System.currentTimeMillis() - processStartTime, e);
            throw new Exception(messageByLocale.get("tps.menu.error.delete", request), e);
        }
    }


}
