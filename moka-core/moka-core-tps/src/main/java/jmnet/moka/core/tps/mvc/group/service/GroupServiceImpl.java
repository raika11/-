package jmnet.moka.core.tps.mvc.group.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.group.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.group.entity.Group;
import jmnet.moka.core.tps.mvc.group.entity.GroupMember;
import jmnet.moka.core.tps.mvc.group.repository.GroupMemberRepository;
import jmnet.moka.core.tps.mvc.group.repository.GroupRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final String GROUP_CD_PREFIX = "G";

    public GroupServiceImpl(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Override
    public Page<Group> findAllGroup(GroupSearchDTO search) {
        return groupRepository.findAllGroup(search);
    }

    @Override
    public List<Group> findAllGroup() {
        return groupRepository.findAll();
    }

    @Override
    public List<GroupMember> findAllGroupMember(String groupCd) {
        return groupMemberRepository.findAllByGroupCd(groupCd);
    }

    @Override
    public Optional<Group> findGroupById(String groupId) {
        return groupRepository.findById(groupId);
    }

    @Override
    @Transactional
    public Group insertGroup(Group group) {
        if (McpString.isEmpty(group.getGroupCd())) {
            group.setGroupCd(getNewGroupCd());
        }
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public Group updateGroup(Group group) {
        return groupRepository.save(group);
    }

    @Override
    public void deleteGroup(Group group) {
        groupRepository.delete(group);
    }

    @Override
    public void deleteGroupById(String groupId) {
        groupRepository.deleteById(groupId);
    }

    @Override
    public boolean isDuplicatedId(String groupId) {
        Optional<Group> existingGroup = this.findGroupById(groupId);
        return existingGroup.isPresent();
    }

    @Override
    public boolean hasMembers(String groupId) {
        return groupMemberRepository.countByGroupCd(groupId) > 0 ? true : false;
    }

    private String getNewGroupCd() {
        long count = groupRepository.count();

        String newId = String.format("%s%02d", GROUP_CD_PREFIX, count + 1);

        return newId;
    }

}
