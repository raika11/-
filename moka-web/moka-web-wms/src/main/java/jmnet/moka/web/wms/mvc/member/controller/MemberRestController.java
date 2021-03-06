package jmnet.moka.web.wms.mvc.member.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.dto.LoginLogDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberGroupSaveDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSaveDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberUpdateDTO;
import jmnet.moka.core.tps.mvc.member.entity.LoginLog;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.menu.dto.MenuAuthSimpleDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuNodeDTO;
import jmnet.moka.core.tps.mvc.menu.dto.MenuSearchDTO;
import jmnet.moka.core.tps.mvc.menu.entity.MenuAuth;
import jmnet.moka.core.tps.mvc.menu.service.MenuService;
import jmnet.moka.web.wms.config.security.exception.PasswordNotMatchedException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@Slf4j
@RequestMapping("/api/members")
@Api(tags = {"????????? API"})
public class MemberRestController extends AbstractCommonController {

    private final MenuService menuService;

    private final MemberService memberService;

    private final PasswordEncoder passwordEncoder;


    public MemberRestController(MemberService memberService, MenuService menuService, ModelMapper modelMapper, MessageByLocale messageByLocale,
            TpsLogger tpsLogger, PasswordEncoder passwordEncoder) {
        this.memberService = memberService;
        this.menuService = menuService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Member????????????
     *
     * @param search ????????????
     * @return Member??????
     */
    @ApiOperation(value = "Member ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getMemberList(@SearchParam MemberSearchDTO search) {

        ResultListDTO<MemberDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<MemberInfo> returnValue = memberService.findAllMember(search);

        // ????????? ??????
        List<MemberDTO> memberDtoList = modelMapper.map(returnValue.getContent(), MemberDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<MemberDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member ????????? ?????? ?????? ??????
     *
     * @param search ????????????
     * @return Member??????
     */
    @ApiOperation(value = "Member ????????? ?????? ?????? ??????")
    @GetMapping("/{memberId}/login-historys")
    public ResponseEntity<?> getMemberLoginHistoryList(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @SearchParam SearchDTO search) {

        ResultListDTO<LoginLogDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        Page<LoginLog> returnValue = memberService.findAllLoginLog(memberId, search);

        // ????????? ??????
        List<LoginLogDTO> loginLogDtoList = modelMapper.map(returnValue.getContent(), LoginLogDTO.TYPE);
        AtomicLong index = new AtomicLong(1);
        loginLogDtoList.forEach(loginLogDTO -> {
            loginLogDTO.setSeqNo(index.getAndAdd(1));
        });
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(loginLogDtoList);


        ResultDTO<ResultListDTO<LoginLogDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member?????? ??????
     *
     * @param memberId Member????????? (??????)
     * @return Member??????
     * @throws NoDataException Member ????????? ??????
     */
    @ApiOperation(value = "Member ??????")
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMember(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(message));

        MemberDTO dto = modelMapper.map(member, MemberDTO.class);


        tpsLogger.success(ActionType.SELECT);

        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member ?????? ????????? ??????
     *
     * @param memberId Member?????????
     * @return ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ?????? ??????")
    @GetMapping("/{memberId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId) {

        boolean duplicated = memberService.isDuplicatedId(memberId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param memberDTO ????????? Member??????
     * @return ????????? Member??????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "Member ??????")
    @PostMapping
    public ResponseEntity<?> postMember(@Valid MemberSaveDTO memberDTO)
            throws InvalidDataException, Exception {

        // MemberDTO -> Member ??????
        MemberInfo member = modelMapper.map(memberDTO, MemberInfo.class);
        if (McpString.isNotEmpty(member.getMemberId())) { // ?????? ????????? ?????? ?????? ?????? ??????
            if (memberService.isDuplicatedId(member.getMemberId())) {
                throw new InvalidDataException(msg("tps.member.error.duplicated.memberId"));
            }
        }

        try {

            member.setPassword(passwordEncoder.encode(member.getPassword()));
            List<MemberGroupSaveDTO> groupSaveDTOs = memberDTO.getMemberGroups();
            // SMS ????????? ?????? ?????? ??????
            String smsAuth = "4885";
            Date smsExp = McpDate.minutePlus(McpDate.now(), 3);
            member.setSmsAuth(smsAuth);
            member.setSmsExp(smsExp);
            member.setStatus(MemberStatusCode.Y);

            // insert
            MemberInfo returnValue = memberService.insertMember(member);
            if (returnValue != null && groupSaveDTOs != null) {
                groupSaveDTOs.forEach(group -> {
                    GroupMember groupMember = GroupMember
                            .builder()
                            .groupCd(group.getGroupCd())
                            .memberId(member.getMemberId())
                            //.usedYn(group.getUsedYn())
                            .build();
                    memberService.insertGroupMember(groupMember);
                });

            }

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.insert"));

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT MEMBER]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.member.error.save"), e);
        }
    }

    /**
     * ??????
     *
     * @param memberId  Member?????????
     * @param memberDTO ????????? Member??????
     * @return ????????? Member??????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "Member ??????")
    @PutMapping("/{memberId}")
    public ResponseEntity<?> putMember(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @Valid MemberUpdateDTO memberDTO)
            throws Exception {

        // MemberDTO -> Member ??????
        String infoMessage = msg("tps.common.error.no-data");
        MemberInfo newMember = modelMapper.map(memberDTO, MemberInfo.class);
        newMember.setMemberId(memberId);
        // ????????? ????????? ??????
        MemberInfo orgMember = memberService
                .findMemberById(newMember.getMemberId())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            orgMember.setStatus(memberDTO.getStatus());
            orgMember.setExpireDt(memberDTO.getExpireDt());
            orgMember.setRemark(memberDTO.getRemark());

            // update
            MemberInfo returnValue = memberService.updateMember(orgMember);


            // ????????????
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.update"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.member.error.update"), e);
        }
    }

    /**
     * Member ?????? ?????????
     *
     * @param memberId MemberID
     * @return ????????? ??????
     * @throws NoDataException ??????????????? ????????????
     */
    @ApiOperation(value = "Member ?????? ?????????")
    @GetMapping("/{memberId}/activation")
    public ResponseEntity<?> putFouceUnlock(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws NoDataException {

        String noDataMsg = msg("tps.common.error.no-data");

        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));
        member.setErrCnt(0);
        member.setStatus(MemberStatusCode.Y);
        member.setPasswordModDt(McpDate.now());
        memberService.updateMember(member);

        MemberDTO memberDTO = modelMapper.map(member, MemberDTO.class);

        // ????????????
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, msg("tps.member.success.activation"));
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param memberId ?????? ??? Member????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? Member ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "Member ??????")
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws InvalidDataException, NoDataException, Exception {


        // Member ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data");
        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // ??????
            memberService.deleteMember(member);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.member.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MEMBER] memberId: {} {}", memberId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.member.error.delete"), e);
        }
    }

    /**
     * ???????????? ??????
     *
     * @param memberId    Member?????????
     * @param password    ?????? ????????????
     * @param newPassword ????????? ????????????
     * @return ????????? Member??????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "Member ??????")
    @PutMapping("/{memberId}/change-password")
    public ResponseEntity<?> putChangePassword(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @ApiParam("????????????") @RequestParam("password")
                    //@Pattern(regexp = "^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*)$", message = "{tps.member.error.pattern.password}")
                    String password, @ApiParam("?????? ????????????") @RequestParam("newPassword")
    @Pattern(regexp = "^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*)$", message = "{tps.member.error.pattern.password}") String newPassword,
            @ApiParam("?????? ????????????") @RequestParam("confirmPassword")
            @Pattern(regexp = "^((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)|((?=.{8,15}$)(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*)$", message = "{tps.member.error.pattern.password}") String confirmPassword)
            throws Exception {

        String infoMessage = msg("tps.common.error.no-data");

        // ????????? ????????? ??????
        MemberInfo orgMember = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(infoMessage));
        String chk = "";
        try {
            // ?????? ???????????? ?????? ?????? ??????
            boolean same = passwordEncoder.matches(password, orgMember.getPassword());
            if (!same) {
                chk = "old";
                throw new PasswordNotMatchedException(msg("tps.member.error.new.old.not.password"));
            }

            if (password.equals(newPassword)) {
                chk = "new";
                throw new PasswordNotMatchedException(msg("tps.member.error.same.password"));
            }
            // ?????? ??????????????? ???????????? ?????? ??????
            throwPasswordCheck(newPassword, confirmPassword);

            String SHA256_Password = passwordEncoder.encode(newPassword);
            orgMember.setExpireDt(McpDate.datePlus(McpDate.now(), 30));
            orgMember.setErrCnt(0);
            orgMember.setPasswordModDt(McpDate.now());
            orgMember.setPassword(SHA256_Password);

            // ????????????
            MemberInfo returnValue = memberService.updateMember(orgMember);

            // ????????????
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.change-password"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);

            if (chk.equals("old")) {
                throw new PasswordNotMatchedException(msg("tps.member.error.new.old.not.password"));
            } else if (chk.equals("new")) {
                throw new PasswordNotMatchedException(msg("tps.member.error.same.password"));
            } else {
                throw new Exception(e);
            }
        }
    }

    /**
     * ???????????? ??????
     *
     * @param password        ???????????? ?????????
     * @param confirmPassword ???????????? ?????? ?????????
     * @throws PasswordNotMatchedException ??????????????? ???????????? ?????? ?????????
     */
    private void throwPasswordCheck(String password, String confirmPassword)
            throws PasswordNotMatchedException {

        // ??????????????? ???????????? ?????? ??????
        boolean same = password.equals(confirmPassword);
        if (!same) {
            throw new PasswordNotMatchedException(msg("wms.login.error.PasswordNotMatchedException"));
        }
    }


    /**
     * Member ?????? ?????? ??????
     *
     * @return ????????????
     */
    @ApiOperation(value = "Member ?????? ?????? ??????")
    @GetMapping("/menus")
    public ResponseEntity<?> getUserMenuTree(@NotNull Principal principal) {
        // ??????
        MenuSearchDTO searchDTO = MenuSearchDTO
                .builder()
                .memberId(principal.getName())
                .build();
        MenuNodeDTO menuNodeDTO = menuService.findServiceMenuTree(searchDTO);

        // ????????? ??????
        ResultDTO<MenuNodeDTO> resultDto = new ResultDTO<>(menuNodeDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ?????? ????????? ????????? ?????? ??????
     *
     * @param request   ??????
     * @param menuAuths ??????????????????
     * @return ????????? ????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "?????? ????????? ????????? ?????? ??????")
    @PutMapping("/{memberId}/menu-auths")
    public ResponseEntity<?> putMemberMenuAuth(HttpServletRequest request,
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @RequestBody List<@Valid MenuAuthSimpleDTO> menuAuths)
            throws Exception {

        try {
            menuService.saveMenuAuth(memberId, MenuAuthTypeCode.MEMBER, menuAuths
                    .stream()
                    .map(menuAuthSimpleDTO -> modelMapper.map(menuAuthSimpleDTO, MenuAuth.class))
                    .collect(Collectors.toList()), false);

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.member.success.update.menu-auth"));

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



}
