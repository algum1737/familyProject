import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 오늘 다 했니?",
  description: "오늘 다 했니 앱의 개인정보 처리방침"
};

const policySections = [
  {
    title: "수집하는 정보",
    body: [
      "오늘 다 했니는 계정 가입을 요구하지 않습니다.",
      "사용자가 앱에 직접 입력한 계획, 완료 상태, 회고 내용은 기기 안의 로컬 저장소에 저장됩니다.",
      "현재 앱은 광고 SDK, 분석 SDK, 외부 서버 동기화 기능을 사용하지 않습니다."
    ]
  },
  {
    title: "정보의 이용 목적",
    body: [
      "입력한 계획과 기록은 오늘 화면, 동기 화면, 회고 흐름을 표시하기 위해 사용됩니다.",
      "알림 권한은 계획 시작 전과 종료 전 로컬 리마인드를 보내기 위해 사용됩니다.",
      "앱은 사용자의 계획 데이터를 판매하거나 광고 목적으로 사용하지 않습니다."
    ]
  },
  {
    title: "저장과 공유",
    body: [
      "현재 버전의 계획 데이터는 기본적으로 사용자의 기기 안에 저장됩니다.",
      "현재 앱은 사용자가 입력한 계획 데이터를 별도 서버로 전송하지 않습니다.",
      "운영체제 백업, 기기 이전, 앱 삭제 동작은 사용자의 기기와 OS 설정에 따릅니다."
    ]
  },
  {
    title: "권한",
    body: [
      "알림 권한은 사용자가 허용한 경우에만 로컬 알림을 보내는 데 사용됩니다.",
      "인터넷 및 진동 권한은 앱 런타임과 알림 동작을 위해 Android manifest에 포함될 수 있습니다.",
      "향후 계정, 동기화, 분석, 오류 보고 기능을 추가하는 경우 이 방침을 갱신합니다."
    ]
  },
  {
    title: "문의",
    body: [
      "개인정보 처리방침 또는 앱 데이터 처리에 대한 문의는 Play Console에 등록된 개발자 연락처로 접수합니다.",
      "이 문서의 마지막 갱신일은 2026년 5월 13일입니다."
    ]
  }
] as const;

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <article className="legal-document">
        <p className="legal-eyebrow">Privacy Policy</p>
        <h1>개인정보 처리방침</h1>
        <p className="legal-lead">
          오늘 다 했니는 사용자의 하루 계획과 회고를 기기 안에서 관리하는 개인용 계획
          관리 앱입니다. 이 문서는 현재 앱 버전 기준의 데이터 처리 방식을 설명합니다.
        </p>

        <div className="legal-meta">
          <span>앱 이름: 오늘 다 했니</span>
          <span>패키지: com.familyproject.todaydidyoufinish</span>
          <span>시행일: 2026년 5월 13일</span>
        </div>

        {policySections.map((section) => (
          <section className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </main>
  );
}
