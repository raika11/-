// 스타일 관련 상수
// px 단위는 제외하고 number로 기입 (사용하는 곳에서 px을 붙인다)

// 카드 컴포넌트 기본 높이
export const CARD_DEFAULT_HEIGHT = 817;

// 카드 접혔을 때 넓이
export const CARD_FOLDING_WIDTH = 32;

// AgGrid의 rowHeight (1줄, 2줄, 3줄)
export const GRID_ROW_HEIGHT = [38, 54, 54];

// AgGrid의 lineHeight (1줄, 2줄, 3줄)
export const GRID_LINE_HEIGHT = [GRID_ROW_HEIGHT[0] - 2, GRID_ROW_HEIGHT[1] - 2, GRID_ROW_HEIGHT[2] - 2];

// AgGrid에서 한 row에 여러 줄의 텍스트를 노출할 때 lineHeight
export const GRID_MULTI_LINE_HEIGHT = 18;

// AgGrid -webkit-box 생성
export const WEBKIT_BOX = (lineClamp) => ({
    display: '-webkit-box',
    overflow: 'hidden',
    paddingTop: '3px',
    '-webkit-line-clamp': lineClamp,
    '-webkit-box-orient': 'vertical',
    lineHeight: `${GRID_MULTI_LINE_HEIGHT}px`,
});
