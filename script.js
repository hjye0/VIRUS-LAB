/* =========================================
   V•LAB — INTERACTIVE WEBSITE
   JavaScript
========================================= */

// 01. 부드러운 스크롤 등장 효과

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

// 메뉴를 클릭하면 해당 위치로 이동
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(
      link.getAttribute("href")
    );

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});


// 02. 바이러스의 두 얼굴

function changeSide(type) {
  const panel = document.getElementById("sidePanel");
  const title = document.getElementById("sideTitle");
  const text = document.getElementById("sideText");

  panel.style.opacity = "0.3";

  setTimeout(() => {
    panel.className = "side-panel " + type;

    if (type === "danger") {
      title.textContent = "인류를 위협한 바이러스";

      text.textContent =
        "바이러스는 인플루엔자, 천연두, 코로나19 등 " +
        "다양한 감염병을 일으켜 왔습니다. " +
        "환경 변화와 인간 활동은 새로운 감염병의 " +
        "발생 위험에도 영향을 미칩니다.";

    } else {
      title.textContent = "지구를 지탱하는 숨겨진 역할";

      text.textContent =
        "일부 바이러스는 세균 개체 수를 조절하고 " +
        "해양 영양분 순환에 관여합니다. " +
        "또한 생물의 진화에 영향을 주었으며 " +
        "의학적 치료에도 활용됩니다.";
    }

    panel.style.opacity = "1";
  }, 200);
}


// 03. 바이러스 연구소 데이터

const labs = [
  {
    title: "LAB 01 — 박테리오파지 연구실",
    description:
      "박테리오파지는 세균을 감염시키는 바이러스입니다. " +
      "일부 파지는 세균 내부에서 증식한 뒤 " +
      "세균을 파괴하여 개체 수 조절에 기여합니다.",
    keyword: "박테리오파지",
    type: "bacteria"
  },
  {
    title: "LAB 02 — 해양 생태계 연구실",
    description:
      "해양 바이러스는 미생물의 개체 수와 " +
      "영양분 순환에 영향을 줍니다. " +
      "이러한 과정은 해양 먹이망과 연결됩니다.",
    keyword: "해양 바이러스",
    type: "ocean"
  },
  {
    title: "LAB 03 — 진화 연구실",
    description:
      "일부 바이러스의 유전정보는 " +
      "숙주의 유전체에 삽입되어 후손에게 전달됩니다. " +
      "바이러스 유래 유전자는 포유류의 " +
      "태반 형성에도 관여합니다.",
    keyword: "내인성 레트로바이러스",
    type: "evolution"
  },
  {
    title: "LAB 04 — 치료 연구실",
    description:
      "바이러스는 유전자 치료의 운반체나 " +
      "암세포를 표적으로 하는 치료에 " +
      "활용될 수 있습니다.",
    keyword: "바이러스 벡터",
    type: "medicine"
  }
];


// 04. 연구실 열기

function openLab(index) {
  const lab = labs[index];
  const output = document.getElementById("labOutput");

  document.querySelectorAll(".lab-card").forEach(
    (card, i) => {
      card.classList.toggle("selected", i === index);
    }
  );

  output.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = lab.title;

  const description = document.createElement("p");
  description.textContent = lab.description;

  const simulator = document.createElement("div");
  simulator.className = "simulator";

  output.append(title, description, simulator);

  // 연구실별 개별 실험
  if (lab.type === "bacteria") {
    createBacteriaLab(simulator);
  }

  if (lab.type === "ocean") {
    createOceanLab(simulator);
  }

  if (lab.type === "evolution") {
    createEvolutionLab(simulator);
  }

  if (lab.type === "medicine") {
    createMedicineLab(simulator);
  }

  const searchButton = document.createElement("button");
  searchButton.textContent = "관련 자료 검색하기 ↗";

  searchButton.addEventListener("click", () => {
    document.getElementById("searchInput").value =
      lab.keyword;

    document.getElementById("search").scrollIntoView({
      behavior: "smooth"
    });

    searchWiki();
  });

  output.appendChild(searchButton);

  output.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// 공통 실험 화면 생성
function createExperiment(container, config) {
  const heading = document.createElement("h4");
  heading.textContent = config.title;

  const explanation = document.createElement("p");
  explanation.textContent = config.explanation;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.value = "50";
  slider.setAttribute("aria-label", config.label);

  const bar = document.createElement("div");
  bar.className = "sim-bar";

  const fill = document.createElement("div");
  fill.className = "sim-fill";
  bar.appendChild(fill);

  const result = document.createElement("p");

  const notice = document.createElement("p");
  notice.style.fontSize = "12px";
  notice.textContent =
    "※ 과학 개념을 설명하기 위한 교육용 모형이며 " +
    "실제 실험 결과나 정량적 예측은 아닙니다.";

  function update() {
    const value = Number(slider.value);

    fill.style.width = value + "%";
    result.textContent = config.update(value);
  }

  slider.addEventListener("input", update);

  container.append(
    heading,
    explanation,
    slider,
    bar,
    result,
    notice
  );

  update();
}


// LAB 01 — 세균 조절
function createBacteriaLab(container) {
  createExperiment(container, {
    title: "박테리오파지와 세균",
    explanation:
      "슬라이더를 움직여 파지의 감염 활동 수준을 " +
      "가상으로 변경해 보세요.",
    label: "가상의 파지 감염 활동",
    update(value) {
      if (value < 30) {
        return "감염 활동이 낮은 상태: 세균에 미치는 영향이 제한적입니다.";
      }
      if (value < 70) {
        return "감염 활동이 증가한 상태: 일부 세균이 감염될 수 있습니다.";
      }
      return "감염 활동이 높은 상태: 감수성 있는 세균 집단에 더 큰 영향을 줄 수 있습니다.";
    }
  });
}


// LAB 02 — 해양 생태계
function createOceanLab(container) {
  createExperiment(container, {
    title: "해양 영양분 순환",
    explanation:
      "바이러스에 의한 미생물 분해 활동을 " +
      "가상으로 조절해 보세요.",
    label: "가상의 미생물 분해 활동",
    update(value) {
      if (value < 30) {
        return "미생물 분해 활동이 낮은 상태입니다.";
      }
      if (value < 70) {
        return "미생물의 유기물이 주변 환경으로 방출되는 과정을 살펴봅니다.";
      }
      return "방출된 유기물이 다른 미생물의 영양분으로 이용될 수 있습니다.";
    }
  });
}


// LAB 03 — 진화
function createEvolutionLab(container) {
  const title = document.createElement("h4");
  title.textContent = "바이러스 유래 유전자의 흔적";

  const text = document.createElement("p");
  text.textContent =
    "버튼을 누르면 바이러스 유래 유전정보가 " +
    "숙주의 유전체에 남아 진화에 기여할 수 있는 " +
    "과정을 단계별로 살펴볼 수 있습니다.";

  const steps = [
    "1단계: 바이러스가 숙주 세포에 유전정보를 전달합니다.",
    "2단계: 일부 바이러스 유전정보가 숙주의 DNA에 삽입됩니다.",
    "3단계: 생식계열에 남은 유전정보는 후손에게 전달될 수 있습니다.",
    "4단계: 일부 유전자는 오랜 진화 과정에서 새로운 기능에 활용됩니다."
  ];

  let step = 0;

  const result = document.createElement("p");
  result.textContent = steps[step];

  const button = document.createElement("button");
  button.textContent = "다음 단계 →";

  button.onclick = () => {
    step = (step + 1) % steps.length;
    result.textContent = steps[step];

    if (step === steps.length - 1) {
      button.textContent = "처음부터 다시 ↺";
    } else {
      button.textContent = "다음 단계 →";
    }
  };

  container.append(title, text, result, button);
}


// LAB 04 — 치료
function createMedicineLab(container) {
  const title = document.createElement("h4");
  title.textContent = "바이러스의 의료적 활용";

  const text = document.createElement("p");
  text.textContent =
    "어떤 치료 분야를 탐구할지 선택해 보세요.";

  const result = document.createElement("p");

  const geneButton = document.createElement("button");
  geneButton.textContent = "유전자 치료";

  const cancerButton = document.createElement("button");
  cancerButton.textContent = "항암바이러스 치료";

  geneButton.onclick = () => {
    result.textContent =
      "유전자 치료에서는 특정 바이러스의 " +
      "세포 전달 능력을 활용하여 치료에 필요한 " +
      "유전정보를 전달할 수 있습니다.";
  };

  cancerButton.onclick = () => {
    result.textContent =
      "항암바이러스 치료에서는 특정 바이러스를 " +
      "활용해 암세포를 표적으로 삼고 " +
      "면역반응을 유도하기도 합니다.";
  };

  container.append(
    title,
    text,
    geneButton,
    cancerButton,
    result
  );
}


// 05. 위키백과 실제 검색

async function searchWiki() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const query = input.value.trim();

  if (!query) {
    results.textContent = "검색어를 입력해 주세요.";
    return;
  }

  results.textContent = "자료를 검색하고 있습니다...";

  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: "6",
    format: "json",
    origin: "*"
  });

  try {
    const response = await fetch(
      "https://ko.wikipedia.org/w/api.php?" +
      params.toString()
    );

    if (!response.ok) {
      throw new Error("검색 요청 실패");
    }

    const data = await response.json();
    const items = data.query?.search || [];

    results.replaceChildren();

    if (items.length === 0) {
      results.textContent =
        "검색 결과가 없습니다. 다른 검색어를 입력해 보세요.";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "result-item";

      const link = document.createElement("a");
      link.textContent = item.title;
      link.href =
        "https://ko.wikipedia.org/?curid=" + item.pageid;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const summary = document.createElement("p");

      // 검색 결과의 HTML 태그를 제거
      const temporary = document.createElement("div");
      temporary.innerHTML = item.snippet || "";
      summary.textContent = temporary.textContent;

      card.append(link, summary);
      results.appendChild(card);
    });

  } catch (error) {
    results.textContent =
      "검색에 실패했습니다. 인터넷 연결을 확인하거나 " +
      "Google 또는 Naver 검색을 이용해 주세요.";
  }
}


// Enter 키로 검색
document.getElementById("searchInput")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchWiki();
    }
  });


// 06. 네이버와 구글 실제 검색

function externalSearch(engine) {
  const query = document
    .getElementById("searchInput")
    .value.trim();

  if (!query) {
    alert("검색어를 입력해 주세요.");
    return;
  }

  const encoded = encodeURIComponent(query);

  const url = engine === "google"
    ? "https://www.google.com/search?q=" + encoded
    : "https://search.naver.com/search.naver?query=" + encoded;

  window.open(url, "_blank", "noopener,noreferrer");
}


// 07. 탐험 후 응답

function answer(type) {
  const output = document.getElementById("answerText");

  if (type === "yes") {
    output.textContent =
      "바이러스의 다양한 역할을 발견했군요! " +
      "우리가 알고 있는 정보가 전부는 아닐 수 있습니다.";
  } else {
    output.textContent =
      "궁금증은 새로운 탐구의 시작입니다. " +
      "연구소와 검색 기능을 통해 더 알아보세요.";
  }
}