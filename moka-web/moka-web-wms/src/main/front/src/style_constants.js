// 스타일 관련 상수
// px 단위는 제외하고 number로 기입 (사용하는 곳에서 px을 붙인다)

// 카드 컴포넌트 기본 높이
export const CARD_DEFAULT_HEIGHT = 817;

// 카드 접혔을 때 넓이
export const CARD_FOLDING_WIDTH = 32;

// AgGrid의 headerHeight
export const GRID_HEADER_HEIGHT = [34, 46];

// AgGrid의 rowHeight
export const GRID_ROW_HEIGHT = {
    T: [34, 46, 46], // text
    C: [38, 54, 66], // 복합형 (텍스트 + 사진, 버튼, input)
};

// AgGrid의 lineHeight
export const GRID_LINE_HEIGHT = {
    T: GRID_ROW_HEIGHT.T.map((h) => h - 2),
    C: GRID_ROW_HEIGHT.C.map((h) => h - 2),
    M: 18, // multi line일 때
};

// AgGrid -webkit-box 생성
export const WEBKIT_BOX = (lineClamp) => ({
    display: '-webkit-box',
    overflow: 'hidden',
    // '-webkit-line-clamp': lineClamp,
    // '-webkit-box-orient': 'vertical',
    WebkitLineClamp: lineClamp,
    WebkitBoxOrient: 'vertical',
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
});
