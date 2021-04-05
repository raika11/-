package jmnet.moka.web.wms.mvc.member.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import jmnet.moka.common.utils.MapBuilder;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.mail.mvc.dto.SmtpSendDTO;
import jmnet.moka.core.mail.mvc.service.SmtpService;
import jmnet.moka.core.tps.common.code.MemberRequestCode;
import jmnet.moka.core.tps.common.code.MemberStatusCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.member.dto.MemberDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberGroupSaveDTO;
import jmnet.moka.core.tps.mvc.member.dto.MemberRequestDTO;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.entity.MemberSms;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import jmnet.moka.core.tps.mvc.member.vo.SmtpApplyVO;
import jmnet.moka.web.wms.config.security.exception.GroupWareException;
import jmnet.moka.web.wms.config.security.exception.PasswordNotMatchedException;
import jmnet.moka.web.wms.config.security.exception.UnauthrizedErrorCode;
import jmnet.moka.web.wms.config.security.groupware.GroupWareUserInfo;
import jmnet.moka.web.wms.config.security.groupware.SoapWebServiceGatewaySupport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.wms.mvc.member.controller
 * ClassName : GroupWareMemberRestController
 * Created : 2020-12-11 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-11 17:30
 */
@Slf4j
@RestController
@RequestMapping("/api/member-join")
@Api(tags = {"회원 가입 API"})
public class MemberJoinRestController extends AbstractCommonController {

    public final SoapWebServiceGatewaySupport groupWareAuthClient;

    private final MemberService memberService;

    private final PasswordEncoder passwordEncoder;


    private final SmtpService smtpService;

    public MemberJoinRestController(SoapWebServiceGatewaySupport groupWareAuthClient, MemberService memberService, PasswordEncoder passwordEncoder,
            SmtpService smtpService) {
        this.groupWareAuthClient = groupWareAuthClient;
        this.memberService = memberService;
        this.passwordEncoder = passwordEncoder;
        this.smtpService = smtpService;
    }

    @Value("${general.receive-address}")
    private String fromEmailAddress;

    @Value("${request.send-address}")
    private String[] toEmailAddress;

    /**
     * 그룹웨어 사용자 정보 조회
     *
     * @param groupWareUserId 그룹 웨어 아이디 (필수)
     * @return Member정보
     * @throws MokaException 그룹웨어에 사용자 정보가 없음
     */
    @ApiOperation(value = "그룹웨어 사용자 정보 조회")
    @GetMapping("/groupware-users/{groupWareUserId}")
    public ResponseEntity<?> getGroupWareMember(@ApiParam("그룹웨어 사용자 ID") @PathVariable("groupWareUserId")
    @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String groupWareUserId)
            throws MokaException, NoDataException, InvalidDataException {

        try {
            GroupWareUserInfo groupWareUserInfo = groupWareAuthClient.getUserInfo(groupWareUserId);
            groupWareUserInfo.setUserId(groupWareUserId);

            groupWareUserInfo.setExistMokaUserId(memberService.isDuplicatedId(groupWareUserId));

            tpsLogger.success(ActionType.SELECT);

            Map<String, Object> result = MapBuilder
                    .getInstance()
                    .getMap();

            result.put("NEW_REQUEST", MemberRequestCode.NEW_REQUEST.getCode());
            result.put("NEW_SMS", MemberRequestCode.NEW_SMS.getCode());
            result.put("UNLOCK_REQUEST", MemberRequestCode.UNLOCK_REQUEST.getCode());
            result.put("UNLOCK_SMS", MemberRequestCode.UNLOCK_SMS.getCode());

            result.put("groupWareUser", groupWareUserInfo);

            ResultMapDTO resultDTO = new ResultMapDTO(result);

            MemberInfo member = memberService
                    .findMemberById(groupWareUserId)
                    .orElseThrow();
            if (!McpString.isEmpty(member.getMemberId())) {
                if (MemberStatusCode.D == member.getStatus()) {
                    throw new InvalidDataException(msg("wms.login.error.StopUsingException"));
                }
            }

            return new ResponseEntity<>(resultDTO, HttpStatus.OK);

        } catch (GroupWareException ex) {
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_ERROR) {
                throw new MokaException(msg("wms.login.error.GroupwareUserNotFoundException"));
            }
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_AUTHNUMBER_PARSING_ERROR) {
                throw new MokaException(msg("wms.login.error.groupware-authnumber"));
            }
            if (ex.getErrorCode() == UnauthrizedErrorCode.GROUPWARE_USER_PARSING_ERROR) {
                throw new MokaException(msg("wms.login.error.groupware-userinfo"));
            }
            throw new MokaException(msg("wms.login.error.groupware"));
        }


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
            @ApiParam("사용자 ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws NoDataException, InvalidDataException {

        String message = msg("tps.common.error.no-data");
        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(message));

        MemberDTO dto = modelMapper.map(member, MemberDTO.class);

        tpsLogger.success(ActionType.SELECT);

        Map<String, Object> result = MapBuilder
                .getInstance()
                .getMap();

        result.put("NEW_REQUEST", MemberRequestCode.NEW_REQUEST.getCode());
        result.put("NEW_SMS", MemberRequestCode.NEW_SMS.getCode());
        result.put("UNLOCK_REQUEST", MemberRequestCode.UNLOCK_REQUEST.getCode());
        result.put("UNLOCK_SMS", MemberRequestCode.UNLOCK_SMS.getCode());

        result.put("member", dto);

        if (MemberStatusCode.D == member.getStatus()) {
            throw new InvalidDataException(msg("wms.login.error.StopUsingException"));
        }

        ResultMapDTO resultDTO = new ResultMapDTO(result);

        return new ResponseEntity<>(resultDTO, HttpStatus.OK);
    }

    /**
     * Member 신규 등록 요청
     *
     * @param memberDTO 등록할 Member정보
     * @return 등록된 Member정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "Member 신규 등록 요청")
    @PostMapping("/register-request")
    public ResponseEntity<?> postRegisterRequest(@Valid MemberRequestDTO memberDTO)
            throws InvalidDataException, Exception {

        // MemberDTO -> Member 변환
        MemberInfo member = modelMapper.map(memberDTO, MemberInfo.class);
        if (McpString.isNotEmpty(member.getMemberId())) { // 자동 발번이 아닌 경우 중복 체크
            if (memberService.isDuplicatedId(member.getMemberId())) {
                throw new InvalidDataException(msg("tps.member.error.duplicated.memberId"));
            }
        }

        try {

            // String passwordSameMessage = msg("tps.member.error.same.password");
            String passwordSameMessage = msg("tps.member.error.PasswordNotMatchedException");

            if (!memberDTO
                    .getPassword()
                    .equals(memberDTO.getConfirmPassword())) {
                throw new MokaException(passwordSameMessage);
            }

            member.setRemark(memberDTO.getRequestReason());
            MemberInfo returnValue = processUserSave(member, memberDTO.getMemberGroups(), MemberRequestCode.NEW_SMS.getNextStatus());

            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg(MemberRequestCode.NEW_SMS.getMessageKey()));

            // 담당자에게 요청 Email 발송
            String[] mailTo = toEmailAddress;
            String remark = member.getRemark();
            String memberId = member.getMemberId();
            String memberNm = member.getMemberNm();

            sendEmail(mailTo, memberId, memberNm, "N", remark);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT MEMBER]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.member.error.save"), e);
        }
    }

    /**
     * Member SMS 인증문자 요청
     *
     * @param memberId MemberID
     * @return 사용자 정보
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "Member SMS 인증문자 요청")
    @GetMapping("/{memberId}/sms-request")
    public ResponseEntity<?> putSmsRequest(
            @ApiParam("사용자 ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws Exception {

        //        String noDataMsg = msg("tps.common.error.no-data");
        //
        //        MemberInfo member = memberService
        //                .findMemberById(memberId)
        //                .orElseThrow(() -> new NoDataException(noDataMsg));

        // 비밀번호와 비밀번호 확인 비교
        /*
        if (!McpString.isEmpty(memberRequestDTO.getPassword())) {
            boolean same = memberRequestDTO
                    .getPassword()
                    .equals(memberRequestDTO.getConfirmPassword());
            if (!same) {
                throw new PasswordNotMatchedException(msg("wms.login.error.PasswordNotMatchedException"));
            }
        }
        */
        /*
        same = passwordEncoder.matches(memberRequestDTO.getPassword(), member.getPassword());
        if (!same) {
            throw new PasswordNotMatchedException(msg("wms.login.error.PasswordUnMatchedException"));
        }
        */
        MemberSms memberSms = new MemberSms();
        // SMS 서버에 문자 발송 요청
        String smsAuth = "4885";
        Date smsExp = McpDate.minutePlus(McpDate.now(), 3);
        Date regDt = McpDate.now();

        memberSms.setMemberId(memberId);
        memberSms.setSmsAuth(smsAuth);
        memberSms.setSmsExp(smsExp);
        memberSms.setRegDt(regDt);
        /*
        String remark = McpString.defaultValue(member.getRemark());
        if (McpString.isNotEmpty(remark)) {
            remark += "\n";
        }
        remark += "· " + memberRequestDTO.getRequestReason();
        member.setRemark(remark);
         */

        memberService.insertMemberSms(memberSms);

        MemberDTO memberDTO = modelMapper.map(memberSms, MemberDTO.class);

        String smsInfoMsg = msg("wms.login.info.sms-sand");

        // 결과리턴
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, smsInfoMsg);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    private MemberInfo processUserSave(MemberInfo member, List<MemberGroupSaveDTO> groupSaveDTOs, MemberStatusCode statusCode) {

        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // SMS 서버에 문자 발송 요청
        String smsAuth = "4885";
        Date smsExp = McpDate.minutePlus(McpDate.now(), 3);
        member.setSmsAuth(smsAuth);
        member.setSmsExp(smsExp);
        member.setStatus(statusCode);

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

        // 액션 로그에 성공 로그 출력
        tpsLogger.success(ActionType.INSERT);

        return returnValue;
    }

    /**
     * Member Member SMS 인증문자로 잠금 해제 및 관리자 잠금 해제 요청
     *
     * @param memberId         MemberID
     * @param memberRequestDTO 잠김 해제 요청 정보
     * @return 사용자 정보
     * @throws NoDataException 데이터없음 예외처리
     */
    @ApiOperation(value = "Member SMS 인증문자로 잠금 해제 및 관리자 잠금 해제 요청")
    @GetMapping({"/{memberId}/approval-request", "/{memberId}/unlock-request"})
    public ResponseEntity<?> putStatusChange(
            @ApiParam("사용자 ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @Valid MemberRequestDTO memberRequestDTO)
            throws Exception {

        // 결과리턴
        String noDataMsg = msg("tps.common.error.no-data");
        String successMsg;

        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));

        //throwPasswordCheck(memberRequestDTO.getPassword(), memberRequestDTO.getConfirmPassword(), member);

        if (MemberStatusCode.D == member.getStatus()) {
            throw new InvalidDataException(msg("wms.login.error.StopUsingException"));
        }

        if (memberRequestDTO.getRequestType() == MemberRequestCode.UNLOCK_SMS
                || memberRequestDTO.getRequestType() == MemberRequestCode.NEW_SMS) {// SMS 인증문자로 잠김해제 요청 또는 신규 등록 신청
            if (McpString.isEmpty(member.getSmsAuth())) {
                throw new InvalidDataException(msg("wms.login.error.notempty.smsAuth"));
            }
            //            if (!member
            //                    .getSmsAuth()
            //                    .equals(memberRequestDTO.getSmsAuth())) {
            //                throw new SmsAuthNumberBadCredentialsException(msg("wms.login.error.sms-unmatched"));
            //            }

            //            if (McpDate.term(member.getSmsExp()) < 0) {
            //                throw new SmsAuthNumberExpiredException(msg("wms.login.error.unlock-sms-expired"));
            //            }
        }

        String remark = McpString.defaultValue(member.getRemark());
        if (McpString.isNotEmpty(remark)) {
            remark += "\n";
        }
        remark += "· " + memberRequestDTO.getRequestReason();
        member.setRemark(remark);

        // 잠금 해제
        member.setPassword(passwordEncoder.encode(memberRequestDTO.getPassword()));
        member.setPasswordModDt(McpDate.now());
        member.setErrCnt(0);

        member.setStatus(memberRequestDTO
                .getRequestType()
                .getNextStatus());
        memberService.updateMember(member);
        successMsg = msg(memberRequestDTO
                .getRequestType()
                .getMessageKey());

        MemberDTO memberDTO = modelMapper.map(member, MemberDTO.class);

        if (successMsg != null) {

            if (memberRequestDTO.getRequestType() == MemberRequestCode.UNLOCK_REQUEST) {

                // 담당자에게 요청 Email 발송
                String[] mailTo = toEmailAddress;
                String memberNm = member.getMemberNm();
                String requestReason = memberRequestDTO.getRequestReason();
                sendEmail(mailTo, memberId, memberNm, "R", requestReason);
            }
        }

        // 결과리턴
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, successMsg);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 비밀번호 확인
     *
     * @param password        비밀번호 입력값
     * @param confirmPassword 비밀번호 확인 입력값
     * @param orgMember       기존 사용자 정보
     * @throws PasswordNotMatchedException 비밀번호와 비밀번호 확인 불일치
     */
    private void throwPasswordCheck(String password, String confirmPassword, MemberInfo orgMember)
            throws PasswordNotMatchedException {

        // 비밀번호와 비밀번호 확인 비교
        boolean same = password.equals(confirmPassword);
        if (!same) {
            throw new PasswordNotMatchedException(msg("wms.login.error.PasswordNotMatchedException"));
        }
        /*
        same = passwordEncoder.matches(password, orgMember.getPassword());
        if (!same) {
            throw new UserPrincipalNotFoundException(orgMember.getMemberId());
        }
         */
    }

    private void sendEmail(String[] to, String memberId, String memberNm, String status, String requestReason)
            throws Exception {

        String title = "";

        if (status.equals("N")) {
            title = "[중앙일보 Back Office] 계정 신청 - " + memberNm + "(" + memberId + "}";
        } else if (status.equals("R")) {
            title = "[중앙일보 Back Office] 잠김 해제 신청 - " + memberNm + "(" + memberId + "}";
        }

        SmtpApplyVO smtpApplyVO = new SmtpApplyVO();
        smtpApplyVO.setMemberId(memberId);
        smtpApplyVO.setMemberNm(memberNm);
        smtpApplyVO.setRequestReason(requestReason);

        smtpService.send(SmtpSendDTO
                .builder()
                .from(fromEmailAddress)
                .to(to)
                .templateName(getReqestTemplateName(status))
                .context(smtpApplyVO)
                .title(title)
                .build());
    }

    private String getReqestTemplateName(String status) {

        String requestTemplateName = "";

        if (status.equals("N")) {
            requestTemplateName = "admin-mail-authorize-use";
        }
        if (status.equals("R")) {
            requestTemplateName = "admin-mail-unlocked";
        }
        return requestTemplateName;
    }

    /**
     * 인증번호 확인
     *
     * @param smsAuth 인증번호 (필수)
     * @return 인증번호 확인
     */
    @ApiOperation(value = "인증번호 확인")
    @GetMapping("/{memberId}/{smsAuth}/exists")
    public ResponseEntity<?> smsAuthCheck(
            @ApiParam("사용자 ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @ApiParam("인증번호") @PathVariable("smsAuth") @Size(min = 1, max = 6, message = "{tps.member.error.pattern.smsAuth}") String smsAuth)
            throws NoDataException {

        String noDataMsg = msg("tps.common.error.no-data");

        MemberSms memberSms = memberService
                .findFirstByMemberIdOrderByRegDtDesc(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));

        boolean same = smsAuth.equals(memberSms.getSmsAuth());
        if (!same) {
            throw new PasswordNotMatchedException(msg("tps.member.error.sms-unmatched"));
        }

        ResultDTO<Boolean> resultDto = new ResultDTO<>(same, msg("tps.member.success.sms-matched"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
