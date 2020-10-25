package jmnet.moka.web.wms.mvc.member;

import java.util.List;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.group.entity.Group;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.service.GroupService;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.member.service.MemberService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class MemberTest {

    @Autowired
    private MemberService memberService;

    @Autowired
    private GroupService groupService;

    @Test
    public void memberInsertTest() {

        Member member = Member
                .builder()
                .memberId("ssc_test01")
                .memberNm("관리자")
                .group("J")
                .dept("사회부")
                .email("ssc@ssc.co.kr")
                .companyPhone("02-555-5555")
                .mobilePhone("010-5555-5555")
                .status("Y")
                .build();
        memberService.insertMember(member);
    }

    @Test
    public void memberLoginUpdateTest() {
        memberService.updateMemberLoginInfo("ssc_test01", McpDate.now(), "127.0.0.1");
    }

    @Test
    public void groupInsertTest() {
        Group group = Group
                .builder()
                .groupCd("G01")
                .groupKorNm("그룹1")
                .groupNm("G1")
                .build();

        groupService.insertGroup(group);

        group = Group
                .builder()
                .groupCd("G02")
                .groupKorNm("그룹2")
                .groupNm("G2")
                .build();

        groupService.insertGroup(group);

        if (groupService.isDuplicatedId("G02")) {
            group = Group
                    .builder()
                    .groupCd("G02")
                    .groupKorNm("그룹2")
                    .groupNm("G2")
                    .build();
            groupService.updateGroup(group);
        }

        group = Group
                .builder()
                .groupKorNm("그룹5")
                .groupNm("G5")
                .build();
        groupService.insertGroup(group);
    }

    @Test
    public void groupDeleteTest() {
        List<Group> groups = groupService.findAllGroup();
        groups.forEach(group -> {
            if (!groupService.hasMembers(group.getGroupCd())) {
                groupService.deleteGroup(group);
            }
        });

    }

    @Test
    public void groupMemberInsertTest() {
        List<Group> groups = groupService.findAllGroup();
        groups.forEach(group -> {
            GroupMember groupMember = GroupMember
                    .builder()
                    .groupCd(group.getGroupCd())
                    .memberId("ssc_test01")
                    .usedYn(MokaConstants.YES)
                    .build();
            memberService.insertGroupMember(groupMember);
        });
    }

    @Test
    @Transactional
    @Rollback(false)
    public void memberDeleteTest() {
        memberService.deleteMemberById("ssc_test01");
    }
}
