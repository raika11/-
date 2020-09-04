package jmnet.moka.common.template.parse;

import static jmnet.moka.common.template.Constants.ITEM_PAGE;
import static org.junit.Assert.assertNotNull;
import java.io.File;
import java.io.IOException;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.FileTemplateLoader;
import jmnet.moka.common.template.loader.TemplateLoader;
import jmnet.moka.common.template.parse.TemplateParser;
import jmnet.moka.common.template.parse.TemplateSerializer;
import jmnet.moka.common.template.parse.model.TemplateRoot;

public class TemplateSerializerTest {

	private static final Logger logger = LoggerFactory.getLogger(TemplateParser.class);
	private String templatePath;
	
	@Before
	public void setUp() throws IOException {
		
		// test/resources/samples의 경로를 찾는다.
        //		ClassLoader classLoader = TemplateMergerTest.class.getClassLoader();
//		File file = new File(classLoader.getResource("samples").getFile());
        File file = new File("src/test/resources/samples");
        //		File file = new File("C:\\GitHub\\ResearchInstitute\\MCP_prototype\\mcp-core\\mcp-core-template\\src\\test\\resources\\samples");
		
		this.templatePath = file.getAbsolutePath();
        logger.debug("setup completed");
	}
	

	@Test	
    public void serialize() throws TemplateParseException, TemplateLoadException {
		TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
		String templateText = templateLoader.getItem(ITEM_PAGE, "0001");
		TemplateRoot templateRoot = TemplateParser.parse(ITEM_PAGE, "0001", templateText);
        String source = TemplateSerializer.serialize(templateRoot);
        assertNotNull(source);
	}

    @Test
    public void chageChildTemplateAndserialze()
            throws TemplateParseException, TemplateLoadException {
        TemplateLoader<String> templateLoader = new FileTemplateLoader(this.templatePath);
        String templateText = templateLoader.getItem(ITEM_PAGE, "0001");
        String changed = TemplateSerializer.changeChildTemplate(templateText, "mte:tp", "0004",
                "0055",
                "변경된 템플릿");
        System.out.print(changed);
        assertNotNull(changed);
    }

	
}
