package jmnet.moka.core.common.template.helper;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.FileVisitResult;
import java.nio.file.FileVisitor;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Deprecated
public class TemplateFileVisitor implements FileVisitor<Path> {
    //	private static final Logger logger = LoggerFactory.getLogger(TemplateFileVisitor.class);
	private String targetItemType;
    //	private String itemType;
    //	private String id;
	private List<Map<String,Object>> itemList;
	private int depth = 0;
	
	public TemplateFileVisitor(String targetItemType, String itemType, String id) {
		this.targetItemType = targetItemType;
        //		this.itemType = itemType;
        //		this.id = id;
		this.itemList = new ArrayList<Map<String,Object>>(16);
	}

	public List<Map<String,Object>> getItemList() {
		return this.itemList;
	}
	
	@Override
	public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
		if ( targetItemType.equals(dir.toFile().getName()) == false && depth == 0 ) {
			this.depth++;
			return FileVisitResult.SKIP_SUBTREE;
		}
		this.depth++;
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws UnsupportedEncodingException, IOException  {
        //		if (file.toFile().getName().startsWith(".")) {
        //			return FileVisitResult.CONTINUE;
        //		}
        //		logger.debug("Item File {}: Check",file.toFile().getAbsolutePath());
        //		HashMap<String,Object> itemInfoMap = ResourceMapper.readJson(file.toFile(), new TypeReference<HashMap<String,Object>>(){});
        //		if ( itemInfoMap.containsKey(MspConstants.PAGE_ID)) {
        //			String templateText = (String)itemInfoMap.get(MspConstants.PAGE_CONTENT);
        //			try {
        //				List<ParsedItemDTO> pageItemList = TemplateParserHelper.getItemList(templateText);
        //				for ( ParsedItemDTO templateItemDTO : pageItemList ) {
        //					if ( templateItemDTO.getNodeName().equals(itemType) &&  templateItemDTO.getId().equals(id)) {
        //						itemList.add(itemInfoMap);
        //						logger.debug("Item File {}: Match",file.toFile().getAbsolutePath());
        //						break;
        //					}
        //				}
        //			} catch (TemplateParseException e) {
        //				logger.error("File:{} {}",file.toFile().getAbsolutePath(), e.getMessage(),e);
        //			}
        //		} else if (itemInfoMap.containsKey(MspConstants.COMPONENT_ID)) {
        //			if ( itemType.equals(MspConstants.ITEM_TEMPLATE) && 
        //					String.valueOf(itemInfoMap.get(MspConstants.COMPONENT_TEMPLATE_ID)).equals(id)) {
        //				itemList.add(itemInfoMap);
        //				logger.debug("Item File {}: Match", file.toFile().getAbsolutePath());
        //			} 
        //		} else if (itemInfoMap.containsKey(MspConstants.CONTAINER_ID)) {
        //			String templateText = (String)itemInfoMap.get(MspConstants.CONTAINER_CONTENT);
        //			try {
        //				List<ParsedItemDTO> pageItemList = TemplateParserHelper.getItemList(templateText);
        //				for ( ParsedItemDTO templateItemDTO : pageItemList ) {
        //					if ( templateItemDTO.getNodeName().equals(itemType) &&  templateItemDTO.getId().equals(id)) {
        //						itemList.add(itemInfoMap);
        //						logger.debug("Item File {}: Match", file.toFile().getAbsolutePath());
        //						break;
        //					}
        //				}
        //			} catch (TemplateParseException e) {
        //				logger.error("File:{} {}",file.toFile().getAbsolutePath(), e.getMessage(),e);
        //			}
        //		} else {
        //			logger.debug("Item File {}: Unknown Item Type  ",file.getFileName());
        //		}
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
		return FileVisitResult.CONTINUE;
	}

}
