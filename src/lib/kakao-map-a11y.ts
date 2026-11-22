// 카카오 지도 SDK는 로고를 이름 없는 링크로 넣는다. 스크린리더가 읽을 수 있게 이름을 붙이고, 이후 SDK가 추가하는 링크도 따라간다.
export function labelKakaoMapLinks(container: HTMLElement) {
  const label = () => {
    container.querySelectorAll<HTMLAnchorElement>("a").forEach(anchor => {
      if (!anchor.textContent?.trim() && !anchor.getAttribute("aria-label")) anchor.setAttribute("aria-label", anchor.href.includes("kakao") ? "카카오맵" : "지도 제공처 링크");
    });
  };
  label();
  if (container.dataset.a11yObserved) return;
  container.dataset.a11yObserved = "true";
  new MutationObserver(label).observe(container, { childList: true, subtree: true });
}
