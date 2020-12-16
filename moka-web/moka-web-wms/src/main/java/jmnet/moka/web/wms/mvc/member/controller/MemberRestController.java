package jmnet.moka.web.wms.mvc.member.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.nio.file.attribute.UserPrincipalNotFoundException;
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
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.code.MenuAuthTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.exception.InvalidDataException;
import jmnet.moka.core.tps.exception.NoDataException;
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
@Api(tags = {"사용자 API"})
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
     * Member목록조회
     *
     * @param search 검색조건
     * @return Member목록
     */
    @ApiOperation(value = "Member 목록 조회")
    @GetMapping
    public ResponseEntity<?> getMemberList(@SearchParam MemberSearchDTO search) {

        ResultListDTO<MemberDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<MemberInfo> returnValue = memberService.findAllMember(search);

        // 리턴값 설정
        List<MemberDTO> memberDtoList = modelMapper.map(returnValue.getContent(), MemberDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(memberDtoList);


        ResultDTO<ResultListDTO<MemberDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * Member 로그인 이력 목록 조회
     *
     * @param search 검색조건
     * @return Member목록
     */
    @ApiOperation(value = "Member 로그인 이력 목록 조회")
    @GetMapping("/{memberId}/login-historys")
    public ResponseEntity<?> getMemberLoginHistoryList(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @SearchParam SearchDTO search) {

        ResultListDTO<LoginLogDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<LoginLog> returnValue = memberService.findAllLoginLog(memberId, search);

        // 리턴값 설정
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
     * Member정보 조회
     *
     * @param memberId Member아이디 (필수)
     * @return Member정보
     * @throws NoDataException Member 정보가 없음
     */
    @ApiOperation(value = "Member 조회")
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMember(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
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
     * Member 중복 아이디 체크
     *
     * @param memberId Member아이디
     * @return 중복 여부
     */
    @ApiOperation(value = "동일 아이디 존재 여부")
    @GetMapping("/{memberId}/exists")
    public ResponseEntity<?> duplicateCheckId(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId) {

        boolean duplicated = memberService.isDuplicatedId(memberId);
        ResultDTO<Boolean> resultDTO = new ResultDTO<>(duplicated);
        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param memberDTO 등록할 Member정보
     * @return 등록된 Member정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "Member 등록")
    @PostMapping
    public ResponseEntity<?> postMember(@Valid MemberSaveDTO memberDTO)
            throws InvalidDataException, Exception {

        // MemberDTO -> Member 변환
        MemberInfo member = modelMapper.map(memberDTO, MemberInfo.class);
        if (McpString.isNotEmpty(member.getMemberId())) { // 자동 발번이 아닌 경우 중복 체크
            if (memberService.isDuplicatedId(member.getMemberId())) {
                throw new InvalidDataException(msg("tps.member.error.duplicated.memberId"));
            }
        }

        try {

            member.setPassword(passwordEncoder.encode(member.getPassword()));
            List<MemberGroupSaveDTO> groupSaveDTOs = memberDTO.getMemberGroups();
            // SMS 서버에 문자 발송 요청
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
                            .usedYn(group.getUsedYn())
                            .build();
                    memberService.insertGroupMember(groupMember);
                });

            }

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.insert"));

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT MEMBER]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.member.error.save"), e);
        }
    }

    /**
     * 수정
     *
     * @param memberId  Member아이디
     * @param memberDTO 수정할 Member정보
     * @return 수정된 Member정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "Member 수정")
    @PutMapping("/{memberId}")
    public ResponseEntity<?> putMember(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @Valid MemberUpdateDTO memberDTO)
            throws Exception {

        // MemberDTO -> Member 변환
        String infoMessage = msg("tps.common.error.no-data");
        MemberInfo newMember = modelMapper.map(memberDTO, MemberInfo.class);
        newMember.setMemberId(memberId);
        // 오리진 데이터 조회
        MemberInfo orgMember = memberService
                .findMemberById(newMember.getMemberId())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            orgMember.setStatus(memberDTO.getStatus());
            orgMember.setExpireDt(memberDTO.getExpireDt());
            orgMember.setRemark(memberDTO.getRemark());

            // update
            MemberInfo returnValue = memberService.updateMember(orgMember);


            // 결과리턴
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.update"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.member.error.update"), e);
        }
    }

    /**
     * Member 상태 활성화
     *
     * @param memberId MemberID
     * @return 사용자 정보
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "Member 상태 활성화")
    @GetMapping("/{memberId}/activation")
    public ResponseEntity<?> putFouceUnlock(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
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

        // 결과리턴
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, msg("tps.member.success.activation"));
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param memberId 삭제 할 Member아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 Member 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "Member 삭제")
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws InvalidDataException, NoDataException, Exception {


        // Member 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data");
        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        try {
            // 삭제
            memberService.deleteMember(member);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.member.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE MEMBER] memberId: {} {}", memberId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.member.error.delete"), e);
        }
    }

    /**
     * 비밀번호 변경
     *
     * @param memberId    Member아이디
     * @param password    현재 비밀번호
     * @param newPassword 수정할 비밀번호
     * @return 수정된 Member정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "Member 수정")
    @PutMapping("/{memberId}/change-password")
    public ResponseEntity<?> putChangePassword(
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @RequestParam("password")
            @Pattern(regexp = "^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*$", message = "{tps.member.error.pattern.password}") String password,
            @RequestParam("newPassword")
            @Pattern(regexp = "^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\\W).*$", message = "{tps.member.error.pattern.password}") String newPassword)
            throws Exception {

        String infoMessage = msg("tps.common.error.no-data");
        String passwordSameMessage = msg("tps.member.error.same.password");

        // 오리진 데이터 조회
        MemberInfo orgMember = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(infoMessage));

        try {
            if (password.equals(newPassword)) {
                throw new MokaException(passwordSameMessage);
            }

            // 현재 패스워드 일치 여부 확인
            boolean same = passwordEncoder.matches(password, orgMember.getPassword());


            if (!same) {
                throw new UserPrincipalNotFoundException(memberId);
            }

            String bcryptPassword = passwordEncoder.encode(newPassword);
            orgMember.setExpireDt(McpDate.datePlus(McpDate.now(), 30));
            orgMember.setErrCnt(0);
            orgMember.setPasswordModDt(McpDate.now());
            orgMember.setPassword(bcryptPassword);

            // 결과리턴
            MemberInfo returnValue = memberService.updateMember(orgMember);

            // 결과리턴
            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg("tps.member.success.change-password"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE MEMBER]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(e);
        }
    }



    /**
     * Member 메뉴 트리 조회
     *
     * @return 메뉴목록
     */
    @ApiOperation(value = "Member 메뉴 트리 조회")
    @GetMapping("/menus")
    public ResponseEntity<?> getUserMenuTree(@NotNull Principal principal) {
        // 조회
        MenuSearchDTO searchDTO = MenuSearchDTO
                .builder()
                .memberId(principal.getName())
                .build();
        MenuNodeDTO menuNodeDTO = menuService.findServiceMenuTree(searchDTO);

        // 리턴값 설정
        ResultDTO<MenuNodeDTO> resultDto = new ResultDTO<>(menuNodeDTO);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 여러 메뉴의 그룹 권한 수정
     *
     * @param request   요청
     * @param menuAuths 메뉴권한목록
     * @return 수정된 메뉴정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "여러 메뉴의 그룹 권한 수정")
    @PutMapping("/{memberId}/menu-auths")
    public ResponseEntity<?> putMemberMenuAuth(HttpServletRequest request,
            @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @RequestBody List<@Valid MenuAuthSimpleDTO> menuAuths)
            throws Exception {

        try {
            menuService.saveMenuAuth(memberId, MenuAuthTypeCode.MEMBER, menuAuths
                    .stream()
                    .map(menuAuthSimpleDTO -> modelMapper.map(menuAuthSimpleDTO, MenuAuth.class))
                    .collect(Collectors.toList()));

            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.member.success.update.menu-auth"));

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



}
