const INFINITY_SCROLL_GAP = 0;

export const bindEvent = (state, window, fn) => {
  console.log("스크롤 이벤트");
  if (
    state.isFinish ||
    state.isLoading ||
    parseInt(window.innerHeight + window.scrollY) + INFINITY_SCROLL_GAP <=
      window.document.documentElement.scrollHeight
  ) {
    return;
  }
  console.log("데이터 가져오기");
  fn();
};
