package jmnet.moka.common.proxy.file;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;

/**
 * 
 * <pre>
 * 파일내용을 byte[]로 캐싱하는 맵을 관리한다.
 * 2019. 8. 20. kspark 최초생성
 * </pre>
 * @since 2019. 8. 20. 오후 1:27:41
 * @author kspark
 */
public class FileProxy {
	private HashMap<String, FileProxyItem> fileCacheMap;
	private int defaultCacheTime;
	private int defaultGCTime;
	
	public FileProxy(int defaultCacheTime, int defaultGCTime) {
		this.defaultCacheTime = defaultCacheTime;
		this.defaultGCTime = defaultGCTime; 
		this.fileCacheMap = new HashMap<String, FileProxyItem>(128);
	}

	public int getDefaultGCTime() {
		return this.defaultGCTime;
	}
	
	/**
	 * <pre>
	 * 캐싱할 파일을 추가한다.
	 * </pre>
	 * @param key 키
	 * @param path 파일경로
	 * @param cacheTime 캐시시간
	 */
	public void add(String key, String path, int cacheTime) {
		FileProxyItem fileCacheItem =  new FileProxyItem(path, cacheTime*1000);
		this.fileCacheMap.put(key, fileCacheItem);
	}
	
	public void add(String key, String path) {
		add(key, path, this.defaultCacheTime);
	}
	
	/**
	 * <pre>
	 * 캐싱된 파일을 제외한다.
	 * </pre>
	 * @param key 키
	 */
	public void remove(String key) {
		this.fileCacheMap.remove(key);
	}
	
	/**
	 * <pre>
	 * 캐싱내용을 byte[]로 반환한다.
	 * </pre>
	 * @param key 키
	 * @return byte[]
	 * @throws IOException IO 예외
	 */
	public byte[] getBytes(String key) throws IOException {
		return this.fileCacheMap.get(key).getByteArray();
	}
	
	/**
	 * <pre>
	 * 캐싱내용을 UTF-8 인코딩으로 읽어 String을 반환한다.
	 * </pre>
	 * @param key 키
	 * @return 텍스트
	 * @throws UnsupportedEncodingException 인코딩예외
	 * @throws IOException IO예외
	 */
	public String getString(String key) throws UnsupportedEncodingException, IOException {
		return getString(key, "UTF-8");
	}
	
	/**
	 * <pre>
	 * 캐싱내용을 지정된 인코딩으로 읽어 String을 반환한다.
	 * </pre>
	 * @param key 키
	 * @param encoding 인코딩
	 * @return 텍스트
	 * @throws UnsupportedEncodingException 인코딩예외
	 * @throws IOException IO예외
	 */
	public String getString(String key, String encoding) throws UnsupportedEncodingException, IOException {
		return new String(getBytes(key),encoding);
	}
}
