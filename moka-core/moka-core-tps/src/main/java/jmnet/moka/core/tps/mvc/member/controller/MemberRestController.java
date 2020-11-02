package jmnet.moka.core.tps.mvc.member.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/members")
public class MemberRestController {

    private final MenuService menuService;

    private final ModelMapper modelMapper;

    private final MessageByLocale messageByLocale;

    private final TpsLogger tpsLogger;


    public MemberRestController(MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 사용자 메뉴 트리 조회
     *
     * @param request 요청
     * @return 메뉴목록
     */
    @ApiOperation(value = "사용자 메뉴 트리 조회")
    @GetMapping("/menus")
    public ResponseEntity<?> getUserMenuTree(HttpServletRequest request, @NotNull Principal principal) {
        // 조회
        MenuSearchDTO searchDTO = MenuSearchDTO
                .builder()
                .memberId(principal.getName())
                .build();
        MenuNode menuNode = menuService.findServiceMenuTree(searchDTO);

        // 리턴값 설정
        ResultDTO<MenuNode> resultDto = new ResultDTO<MenuNode>(menuNode);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
