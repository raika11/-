package jmnet.moka.core.tps.mvc.member.controller;

import io.swagger.annotations.ApiOperation;
import java.security.Principal;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNode;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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

    private final ActionLogger actionLogger;


    public MemberRestController(MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale,
            ActionLogger actionLogger) {
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.actionLogger = actionLogger;
    }



    /**
     * 서비스 메뉴 목록 조회
     *
     * @param request 요청
     * @param search  검색 조건
     * @return 메뉴목록
     */
    @ApiOperation(value = "서비스 메뉴 트리 조회")
    @GetMapping("/{memberId}/menus")
    public ResponseEntity<?> getMenuTree(HttpServletRequest request, @SearchParam MenuSearchDTO search,
            @NotNull Principal principal, @RequestAttribute Long processStartTime) {

        // 조회
        MenuNode menuNode = menuService.findServiceMenuTree(search);

        // 리턴값 설정
        ResultDTO<MenuNode> resultDto = new ResultDTO<MenuNode>(menuNode);

        actionLogger.success(principal.getName(), ActionType.SELECT, System.currentTimeMillis() - processStartTime);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    

}
