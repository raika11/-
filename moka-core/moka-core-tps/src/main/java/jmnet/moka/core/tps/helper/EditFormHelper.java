package jmnet.moka.core.tps.helper;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpFile;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.tps.mvc.editform.code.EditFieldTypeCode;
import jmnet.moka.core.tps.mvc.editform.dto.ChannelFormatDTO;
import jmnet.moka.core.tps.mvc.editform.dto.FieldDTO;
import jmnet.moka.core.tps.mvc.editform.dto.FieldGroupDTO;
import jmnet.moka.core.tps.mvc.editform.dto.OptionDTO;
import jmnet.moka.core.tps.mvc.editform.dto.PartDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

/**
 * <pre>
 * xml을 불러와 Edit Form 객체로 전환한다.
 * Project : moka
 * Package : jmnet.moka.core.tps.helper
 * ClassName : EditFormHelper
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 09:16
 */
@Slf4j
public class EditFormHelper {

    private final Map<String, ChannelFormatDTO> editFormMap;

    private final XmlMapper xmlMapper;

    @Value("${tps.edit.form.xml.file.path}")
    private String xmlFilePath;

    public EditFormHelper(XmlMapper xmlMapper) {
        this.xmlMapper = xmlMapper;
        editFormMap = new HashMap<>();
    }

    /**
     * 파일을 읽어, ChannelFormatDTO로 변환한다.
     *
     * @param site      사이트
     * @param channelId 채널명
     * @return ChannelFormatDTO
     * @throws MokaException 오류 처리
     */
    public ChannelFormatDTO mapping(String site, String channelId)
            throws MokaException {
        String formatKey = site + "/" + channelId;
        File file = McpFile.getFile(String.format(xmlFilePath, site, channelId));
        if (!file.exists()) {
            throw new MokaException(new FileNotFoundException(file.getAbsolutePath()));
        }
        ChannelFormatDTO editFormDTO = editFormMap.get(formatKey);
        if (editFormDTO == null || !editFormDTO
                .getLastModified()
                .equals(file.lastModified())) {
            synchronized (EditFormHelper.class) {
                try {
                    editFormDTO = xmlMapper.readValue(file, ChannelFormatDTO.class);
                    editFormDTO.setFormId(formatKey);
                    refineFieldGroup(editFormDTO);
                } catch (IOException e) {
                    throw new MokaException(e.getMessage());
                }
                editFormMap.put(formatKey, editFormDTO);
            }
        }

        return editFormMap.get(formatKey);
    }

    public ChannelFormatDTO mapping(String site, String fileName, byte[] contents)
            throws MokaException {
        String formId = site + "/" + fileName;
        ChannelFormatDTO editFormDTO;
        try {
            editFormDTO = xmlMapper.readValue(contents, ChannelFormatDTO.class);
            editFormDTO.setFormId(formId);
            refineFieldGroup(editFormDTO);
        } catch (IOException e) {
            throw new MokaException(e.getMessage());
        }

        return editFormDTO;
    }

    /**
     * field 목록의 그룹별로 묶는다.
     *
     * @param editFormDTO ChannelFormatDTO
     */
    public void refineFieldGroup(ChannelFormatDTO editFormDTO) {

        editFormDTO
                .getParts()
                .forEach(editFormItemDTO -> {
                    SortedMap<Integer, List<FieldDTO>> groupMap = new TreeMap<>();
                    editFormItemDTO.setFieldGroups(new ArrayList<>());
                    Integer currentGroupNumber = 1;
                    for (FieldDTO fieldDTO : editFormItemDTO.getFields()) {
                        refineOptions(fieldDTO);
                        if (McpString.isEmpty(fieldDTO.getGroup())) {
                            fieldDTO.setGroup(currentGroupNumber);
                        }
                        currentGroupNumber = fieldDTO.getGroup();
                        List<FieldDTO> groupInnerFields = groupMap.getOrDefault(currentGroupNumber, new ArrayList<>());
                        groupInnerFields.add(fieldDTO);
                        groupMap.put(currentGroupNumber, groupInnerFields);
                    }
                    editFormItemDTO.setFields(null);
                    for (Entry<Integer, List<FieldDTO>> entry : groupMap.entrySet()) {
                        Integer group = entry.getKey();
                        List<FieldDTO> fieldDTOs = entry.getValue();
                        fieldDTOs.sort((o1, o2) -> {
                            if (!o1
                                    .getType()
                                    .equals(o2.getType())) {
                                return 1;
                            } else {
                                return o1.getSequence() - o2.getSequence();
                            }
                        });

                        fieldDTOs.forEach(fieldDTO -> {
                            if (McpString.isEmpty(fieldDTO.getName())) {
                                fieldDTO.setName(fieldDTO.getType() + fieldDTO.getSequence());
                            }
                        });

                        FieldGroupDTO fieldGroupDTO = FieldGroupDTO
                                .builder()
                                .fields(fieldDTOs)
                                .group(group)
                                .build();
                        editFormItemDTO
                                .getFieldGroups()
                                .add(fieldGroupDTO);
                    }

                });

    }

    /**
     * widget 타입이 SELECT일때 value 문자열을 option 목록으로 차환
     *
     * @param fieldDTO FieldDTO
     */
    public void refineOptions(FieldDTO fieldDTO) {

        EditFieldTypeCode fieldType = EditFieldTypeCode.getType(fieldDTO.getType());
        if (fieldType == EditFieldTypeCode.SELECT) {
            String[] values = fieldDTO
                    .getValue()
                    .split("\\^");
            Set<OptionDTO> options = Arrays
                    .stream(values)
                    .map(OptionDTO::new)
                    .collect(Collectors.toSet());
            fieldDTO.setOptions(options);
        }

    }

    /**
     * channel별 영역 정보를 불러온다.
     *
     * @param channelId 채널명
     * @param partId    파트 ID
     * @return PartDTO
     * @throws MokaException 공통 에러 처리
     */
    public PartDTO getPart(String site, String channelId, String partId)
            throws MokaException {
        ChannelFormatDTO editFormDTO = getChannelFormat(site, channelId);
        return editFormDTO
                .getParts()
                .stream()
                .filter(part -> part
                        .getItemId()
                        .equals(partId))
                .findFirst()
                .orElseThrow(() -> new MokaException(EditFormHelper.class.getName()));

    }

    /**
     * channel정보를 불러온다.
     *
     * @param channelId 채널명
     * @return ChannelFormatDTO
     */
    public ChannelFormatDTO getChannelFormat(String site, String channelId)
            throws MokaException {
        return mapping(site, channelId);
    }


}
