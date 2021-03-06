package jmnet.moka.web.wms.mvc.member.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
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
@Api(tags = {"?????? ?????? API"})
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
     * ???????????? ????????? ?????? ??????
     *
     * @param groupWareUserId ?????? ?????? ????????? (??????)
     * @return Member??????
     * @throws MokaException ??????????????? ????????? ????????? ??????
     */
    @ApiOperation(value = "???????????? ????????? ?????? ??????")
    @GetMapping("/groupware-users/{groupWareUserId}")
    public ResponseEntity<?> getGroupWareMember(@ApiParam("???????????? ????????? ID") @PathVariable("groupWareUserId")
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
     * Member ?????? ?????? ??????
     *
     * @param memberDTO ????????? Member??????
     * @return ????????? Member??????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "Member ?????? ?????? ??????")
    @PostMapping("/register-request")
    public ResponseEntity<?> postRegisterRequest(@Valid MemberRequestDTO memberDTO)
            throws InvalidDataException, Exception {

        // MemberDTO -> Member ??????
        MemberInfo member = modelMapper.map(memberDTO, MemberInfo.class);
        if (McpString.isNotEmpty(member.getMemberId())) { // ?????? ????????? ?????? ?????? ?????? ??????
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

            String toDay = McpDate.dateStr(McpDate.now(), "yyyy-MM-dd hh:mm");

            member.setRemark("?? " + toDay + " " + memberDTO.getRequestReason());
            MemberInfo returnValue = processUserSave(member, memberDTO.getMemberGroups(), MemberRequestCode.NEW_SMS.getNextStatus());

            MemberDTO dto = modelMapper.map(returnValue, MemberDTO.class);
            ResultDTO<MemberDTO> resultDto = new ResultDTO<>(dto, msg(MemberRequestCode.NEW_SMS.getMessageKey()));

            // ??????????????? ?????? Email ??????
            String[] mailTo = toEmailAddress;
            String remark = member.getRemark();
            String memberId = member.getMemberId();
            String memberNm = member.getMemberNm();

            sendEmail(mailTo, memberId, memberNm, "N", remark);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT MEMBER]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.member.error.save"), e);
        }
    }

    /**
     * Member SMS ???????????? ??????
     *
     * @param memberId MemberID
     * @return ????????? ??????
     * @throws NoDataException ??????????????? ????????????
     */
    @ApiOperation(value = "Member SMS ???????????? ??????")
    @GetMapping("/{memberId}/sms-request")
    public ResponseEntity<?> putSmsRequest(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId)
            throws Exception {
        try {
            Optional<MemberInfo> member = memberService.findById(memberId);

            if (!McpString.isEmpty(member)) {
                if (MemberStatusCode.D == member
                        .get()
                        .getStatus()) {
                    throw new InvalidDataException(msg("wms.login.error.StopUsingException"));
                }
            }
        } catch (NoSuchElementException e) {
            log.debug("No such element");
        }



        //        String noDataMsg = msg("tps.common.error.no-data");
        //
        //        MemberInfo member = memberService
        //                .findMemberById(memberId)
        //                .orElseThrow(() -> new NoDataException(noDataMsg));

        // ??????????????? ???????????? ?????? ??????
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
        // SMS ????????? ?????? ?????? ??????
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
        remark += "?? " + memberRequestDTO.getRequestReason();
        member.setRemark(remark);
         */

        memberService.insertMemberSms(memberSms);

        MemberDTO memberDTO = modelMapper.map(memberSms, MemberDTO.class);

        String smsInfoMsg = msg("wms.login.info.sms-sand");

        // ????????????
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, smsInfoMsg);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    private MemberInfo processUserSave(MemberInfo member, List<MemberGroupSaveDTO> groupSaveDTOs, MemberStatusCode statusCode) {

        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // SMS ????????? ?????? ?????? ??????
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

        // ?????? ????????? ?????? ?????? ??????
        tpsLogger.success(ActionType.INSERT);

        return returnValue;
    }

    /**
     * Member Member SMS ??????????????? ?????? ?????? ??? ????????? ?????? ?????? ??????
     *
     * @param memberId         MemberID
     * @param memberRequestDTO ?????? ?????? ?????? ??????
     * @return ????????? ??????
     * @throws NoDataException ??????????????? ????????????
     */
    @ApiOperation(value = "Member SMS ??????????????? ?????? ?????? ??? ????????? ?????? ?????? ??????")
    @GetMapping({"/{memberId}/approval-request", "/{memberId}/unlock-request"})
    public ResponseEntity<?> putStatusChange(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @Valid MemberRequestDTO memberRequestDTO)
            throws Exception {

        // ????????????
        String noDataMsg = msg("tps.common.error.no-data");
        String successMsg;

        MemberInfo member = memberService
                .findMemberById(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));

        MemberSms memberSms = memberService
                .findFirstByMemberIdOrderByRegDtDesc(memberId)
                .orElseThrow(() -> new NoDataException(noDataMsg));

        MemberDTO memberDTO = modelMapper.map(member, MemberDTO.class);

        if (MemberStatusCode.N == member.getStatus()) {
            throw new InvalidDataException(msg("wms.login.error.NewApprovalException"));
        } else if (MemberStatusCode.D == member.getStatus()) {
            throw new InvalidDataException(msg("wms.login.error.StopUsingException"));
        } else if (MemberStatusCode.R == member.getStatus() || MemberStatusCode.P == member.getStatus()) {

            if (memberRequestDTO.getRequestType() == MemberRequestCode.UNLOCK_SMS
                    || memberRequestDTO.getRequestType() == MemberRequestCode.NEW_SMS) {// SMS ??????????????? ???????????? ?????? ?????? ?????? ?????? ??????
                if (McpString.isEmpty(memberSms.getSmsAuth())) {
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

            String toDay = McpDate.dateStr(McpDate.now(), "yyyy-MM-dd hh:mm");

            String remark = McpString.defaultValue(member.getRemark());

            if (McpString.isNotEmpty(remark)) {
                remark += "\n";
            }
            remark += "?? " + toDay + " " + memberRequestDTO.getRequestReason();
            member.setRemark(remark);

            // ?????? ??????
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

            if (successMsg != null) {

                if (memberRequestDTO.getRequestType() == MemberRequestCode.UNLOCK_REQUEST) {

                    // ??????????????? ?????? Email ??????
                    String[] mailTo = toEmailAddress;
                    String memberNm = member.getMemberNm();
                    String requestReason = memberRequestDTO.getRequestReason();
                    sendEmail(mailTo, memberId, memberNm, "R", requestReason);
                }
            }

        } else {
            throw new InvalidDataException(msg("wms.login.error.NotStopUsingException"));
        }


        // ????????????
        ResultDTO<MemberDTO> resultDto = new ResultDTO<>(memberDTO, successMsg);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ??????
     *
     * @param password        ???????????? ?????????
     * @param confirmPassword ???????????? ?????? ?????????
     * @param orgMember       ?????? ????????? ??????
     * @throws PasswordNotMatchedException ??????????????? ???????????? ?????? ?????????
     */
    private void throwPasswordCheck(String password, String confirmPassword, MemberInfo orgMember)
            throws PasswordNotMatchedException {

        // ??????????????? ???????????? ?????? ??????
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
            title = "[???????????? Back Office] ?????? ?????? - " + memberNm + "(" + memberId + "}";
        } else if (status.equals("R")) {
            title = "[???????????? Back Office] ?????? ?????? ?????? - " + memberNm + "(" + memberId + "}";
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
     * ???????????? ??????
     *
     * @param smsAuth ???????????? (??????)
     * @return ???????????? ??????
     */
    @ApiOperation(value = "???????????? ??????")
    @GetMapping("/{memberId}/{smsAuth}/exists")
    public ResponseEntity<?> smsAuthCheck(
            @ApiParam("????????? ID") @PathVariable("memberId") @Size(min = 1, max = 30, message = "{tps.member.error.pattern.memberId}") String memberId,
            @ApiParam("????????????") @PathVariable("smsAuth") @Size(min = 1, max = 6, message = "{tps.member.error.pattern.smsAuth}") String smsAuth)
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
