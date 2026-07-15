import type { SkiResort } from "@/lib/types";

type ResortStory = {
  headline: string;
  summary: string;
  courseNote: string;
  sceneryNote: string;
  bestFor: string[];
};

const stories: Record<string, ResortStory> = {
  konjiam: { headline: "퇴근 후에도 닿는 수도권 스키", summary: "짧은 이동과 야간 운영을 활용해 당일치기 일정으로 설계하기 좋은 리조트예요.", courseNote: "처음 타는 사람부터 속도를 즐기는 사람까지 난이도별 동선을 나눠 계획하기 좋습니다.", sceneryNote: "도심에서 멀리 벗어나지 않고도 산 능선을 따라 야간 라이딩을 즐길 수 있어요.", bestFor: ["수도권 당일치기", "야간 스키", "초보 동행"] },
  jisan: { headline: "가볍게 시작하는 첫 스키 여행", summary: "수도권에서 부담 없이 출발해 짧은 시간권과 렌탈을 조합하기 좋은 스키장이에요.", courseNote: "초급 연습과 단계적인 난이도 전환을 중심으로 일정을 짜기 좋습니다.", sceneryNote: "아담한 산세와 가까운 슬로프 동선 덕분에 일행을 다시 만나기 편해요.", bestFor: ["첫 스키", "반나절 일정", "가족 여행"] },
  vivaldi: { headline: "처음부터 밤까지 즐기는 활기찬 설원", summary: "렌탈과 부대시설 선택지가 많아 처음 준비하는 여행도 비교적 쉽게 완성할 수 있어요.", courseNote: "초급부터 상급까지 선택지가 넓어 실력이 다른 일행이 함께 가기 좋습니다.", sceneryNote: "넓은 베이스와 밤까지 이어지는 슬로프 분위기가 여행의 활기를 더해요.", bestFor: ["친구 여행", "야간 스키", "다양한 난이도"] },
  elysian: { headline: "전철로 시작하는 가장 가벼운 설원", summary: "대중교통 접근성이 좋아 운전 부담 없이 당일 스키를 계획하기 좋은 곳이에요.", courseNote: "완만한 코스를 중심으로 기본기를 익히고 반복 연습하기 좋습니다.", sceneryNote: "북한강과 강촌의 산세를 가까이 두고 라이딩하는 풍경이 인상적이에요.", bestFor: ["대중교통", "초보 연습", "당일치기"] },
  phoenix: { headline: "넓은 설원과 역동적인 라이딩", summary: "숙박형 여행과 보드·프리스타일 경험을 함께 구성하기 좋은 대형 스노우파크예요.", courseNote: "폭넓은 난이도와 프리스타일 환경을 함께 살펴 일행별 코스를 나누기 좋습니다.", sceneryNote: "평창 고원의 열린 시야와 넓은 슬로프가 시원한 활주감을 만들어 줍니다.", bestFor: ["보드 여행", "1박 이상", "넓은 슬로프"] },
  yongpyong: { headline: "긴 코스에서 만나는 대관령의 겨울", summary: "다양한 코스와 리조트 숙박을 묶어 본격적인 스키 여행을 만들기 좋은 곳이에요.", courseNote: "초급부터 긴 상급 코스까지 선택 폭이 넓어 여러 날 실력을 쌓기 좋습니다.", sceneryNote: "대관령 정상부에서 이어지는 설경과 긴 활주가 여행의 목적이 됩니다.", bestFor: ["긴 코스", "숙박 여행", "중·상급자"] },
  high1: { headline: "고원에서 길게 이어지는 설원 여행", summary: "산 정상부의 설경과 긴 슬로프, 여러 콘도를 함께 이용하는 체류형 여행에 어울려요.", courseNote: "긴 활주와 난이도별 코스를 조합해 하루 이상의 일정을 구성하기 좋습니다.", sceneryNote: "고원 능선과 백두대간의 탁 트인 겨울 풍경을 경험할 수 있어요.", bestFor: ["긴 활주", "설경", "2일 이상"] },
  wellihilli: { headline: "라이딩에 집중하는 균형 잡힌 스키장", summary: "슬로프와 숙박 동선이 단순해 일행과 라이딩 자체에 집중하기 좋아요.", courseNote: "기본 연습부터 속도감 있는 코스까지 단계적으로 선택하기 좋습니다.", sceneryNote: "횡성의 산세를 따라 이어지는 차분한 겨울 풍경을 만날 수 있어요.", bestFor: ["연습 여행", "가족·친구", "숙박형"] },
  oakvalley: { headline: "부담 없이 머무는 원주의 겨울", summary: "수도권과 강원권 사이에서 이동 부담을 낮추고 리조트 체류를 함께 즐기기 좋아요.", courseNote: "초보와 가족 단위가 함께 움직이기 쉬운 코스 구성을 먼저 확인해 보세요.", sceneryNote: "완만한 산세와 리조트 단지가 어우러진 편안한 분위기가 장점이에요.", bestFor: ["가족 여행", "초보 동행", "리조트 휴식"] },
  alpensia: { headline: "대관령에서 즐기는 여유로운 겨울", summary: "숙박 시설과 슬로프를 가까이 두고 가족 중심 여행을 설계하기 좋은 리조트예요.", courseNote: "완만한 코스와 중급 코스를 오가며 여유 있게 타기 좋습니다.", sceneryNote: "대관령의 깨끗한 설경과 정돈된 리조트 풍경을 함께 즐길 수 있어요.", bestFor: ["가족 여행", "대관령 설경", "숙박"] },
  o2: { headline: "한적한 고원에서 만나는 깊은 겨울", summary: "복잡한 상권보다 조용한 라이딩과 고원 설경을 선호할 때 고려하기 좋은 곳이에요.", courseNote: "운영 코스와 시간은 방문 전 공식 현황을 반드시 확인하는 것이 좋습니다.", sceneryNote: "태백 고원의 높은 지대에서 탁 트인 겨울 산 풍경을 만날 수 있어요.", bestFor: ["조용한 여행", "고원 설경", "자차 여행"] },
  muju: { headline: "덕유산 설경을 따라 떠나는 남쪽의 스키 여행", summary: "전라·충청권에서 접근해 숙박과 긴 일정을 함께 구성하기 좋은 대표 리조트예요.", courseNote: "넓은 산악 지형에 여러 난이도가 펼쳐져 일행의 실력에 맞춰 동선을 나누기 좋습니다.", sceneryNote: "덕유산 능선과 눈꽃 풍경은 라이딩 자체만큼 강한 여행 이유가 됩니다.", bestFor: ["덕유산 설경", "숙박 여행", "다양한 난이도"] },
  edenvalley: { headline: "남부권에서 가장 가까운 겨울 한 장면", summary: "부산·울산·경남에서 긴 이동 없이 겨울 스포츠를 경험하기 좋은 선택지예요.", courseNote: "당일 운영 코스와 설질을 공식 현황에서 확인한 뒤 짧은 일정으로 계획해 보세요.", sceneryNote: "영남 알프스의 능선을 바라보며 남부권에서 보기 드문 설원 풍경을 즐길 수 있어요.", bestFor: ["부산·울산 출발", "당일치기", "첫 경험"] }
};

export function getResortStory(resort: SkiResort): ResortStory {
  return stories[resort.id] ?? {
    headline: `${resort.region}에서 만나는 겨울 여행`,
    summary: "공식 운영 정보와 주변 준비 옵션을 확인해 나에게 맞는 스키 여행을 만들어 보세요.",
    courseNote: "방문 전 공식 슬로프 운영 현황에서 난이도와 운영 코스를 확인해 주세요.",
    sceneryNote: "리조트가 자리한 산세와 겨울 풍경을 라이딩과 함께 즐길 수 있어요.",
    bestFor: resort.tags.slice(0, 3)
  };
}
