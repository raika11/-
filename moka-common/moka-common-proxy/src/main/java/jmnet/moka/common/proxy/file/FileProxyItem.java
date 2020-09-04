package jmnet.moka.common.proxy.file;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * <pre>
 * 파일내용을 byte[]로 캐싱한다.
 * 2019. 8. 20. kspark 최초생성
 * </pre>
 * @since 2019. 8. 20. 오후 1:27:41
 * @author kspark
 */
public class FileProxyItem {
	private static final Logger logger = LoggerFactory.getLogger(FileProxyItem.class);
	private long lastModified;
	private long lastCached;
	private File file;
	private byte[] byteArray;
	private int cacheTime;
	
	/**
	 * 생성자
	 * @param path 파일경로
	 * @param cacheTime 캐시시간, 초(sec)
	 */
	public FileProxyItem(String path, int cacheTime) {
		this.file = new File(path);
		this.cacheTime = cacheTime;
	}	
	
	/**
	 * <pre>
	 * 파일 내용을 byte[]로 반환한다.
	 * </pre>
	 * @return 파일내용
	 * @throws IOException IO예외
	 */
	public byte[] getByteArray() throws IOException {
		if ( this.byteArray == null || this.lastCached + cacheTime < System.currentTimeMillis() ) {
			synchronized(this) {
				// 대기중이 였던 thread는 통과하게 한다.
				if ( this.byteArray == null || this.lastCached + cacheTime < System.currentTimeMillis() ) {
					this.load();
				}
			}
		} else {
			logger.debug("File {} : CACHED", file.getAbsolutePath());
		}
		return byteArray;
	}
	
	/**
	 * <pre>
	 * 텍스트 파일 내용을 가져온다.
	 * </pre>
	 * @param encoding 인코딩
	 * @return 텍스트파일
	 * @throws UnsupportedEncodingException 인코딩예외
	 * @throws IOException IO예외
	 */
	public String getString(String encoding) throws UnsupportedEncodingException, IOException {
		return new String(getByteArray(), encoding);
	}
	
	/**
	 * <pre>
	 * 파일명을 반환한다.
	 * </pre>
	 * @return 파일명
	 */
	public String getFileName() {
		return this.file.getName();
	}

	/**
	 * <pre>
	 * 파일을 반환한다.
	 * </pre>
	 * @return 파일
	 */
	public File getFile() {
		return this.file;
	}
	
	/**
	 * <pre>
	 * 파일이 로딩되어 있지 않거나, 변경된 경우 로딩한다.
	 * 변경되지 않은 경우에는 cache된 시간만 변경한다.
	 * </pre>
	 * @throws IOException IO예외
	 */
	private void load() throws IOException {
		long lastFileModified = this.file.lastModified();
		// 파일이 변경됐을 경우 다시 로드함
		// file의 lastModified()가 0이면 file이 없는 경우임, read시 FileNotFound Exception 발생
		if ( lastFileModified == 0 || lastFileModified !=  this.lastModified) {
			this.lastModified = lastFileModified; 
			this.byteArray = Files.readAllBytes(this.file.toPath());
			logger.debug("File {} : LOAD", file.getAbsolutePath());
		} else {
			logger.debug("File {} : UNCHANGED", file.getAbsolutePath());
		}
		this.lastCached = System.currentTimeMillis();
	}

}
