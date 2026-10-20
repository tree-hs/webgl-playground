# learn_webGl

Three.js / WebGL / GLSL을 처음 배우면서, Awwwards 스타일의 "이미지 텍스처 + 마우스 인터랙션 + 셰이더" 효과를 단계별로 만드는 학습 프로젝트.

## 학습자

- Three.js, WebGL, GLSL을 전혀 모르는 상태에서 시작했다. 3D 모델링은 하지 않는다.
- 한국어로 대화한다.
- Windows + PowerShell. 실행 정책 때문에 `npm` 대신 `npm.cmd`를 써야 할 수 있다.

## 진행 방식 (반드시 지킬 것)

각 단계는 이 순서로 진행한다.

1. **개념 (짧게)**: 이번에 배울 것 하나만, 비유와 그림(표, ASCII)으로.
2. **최소 코드**: 그 개념만 담긴 가장 짧은 코드를 `lessons/NN-이름/`에 만든다. 실무용 장치(dispose, PixelRatio 제한 등)는 마지막 정리 단계까지 미룬다.
3. **직접 실험**: "이 숫자 바꿔 보기", "이 줄 지워 보기" 같은 작은 과제. 결과와 "왜"를 학습자가 답하게 한다.
4. **직접 작성 → 리뷰**: 기능 하나를 학습자가 직접 쓴다. 막히면 정답 대신 힌트부터, 빈칸 채우기 틀 순서로 돕는다. 다 쓰면 코드를 읽고 리뷰한다.

규칙:
- 한 단계에 새 개념은 하나만.
- 학습자가 과제를 하기 전에 다음 단계 코드를 먼저 주지 않는다.
- 리뷰할 때 주석 내용(코드와 안 맞는 주석 등)은 지적하지 않는다. 동작과 개념 이해에 집중한다.
- 자주 쓰는 비유: 셰이더 = "픽셀마다 화가 한 명, 모두 같은 지시서, 각자 자기 위치(vUv)만 앎". 움직임 = 플립북. sin 공식 = "가운데 + 폭 × sin(시간)".
- 학습자가 요청하면 그 단계에서 설명한 내용을 해당 레슨 파일에 주석으로 정리해 준다.

## 구조

- `lessons/NN-이름/` — 단계별 레슨 (각자 `index.html` + `main.js`). 루트 `index.html`이 목록.
- `reference/step1-complete/` — 처음에 만든 실무형 코드. 마지막 정리 단계에서 "완성본" 비교용 정답지.
- `public/images/` — `logo.jpg`(1:1, 학습자 이미지), `sample.svg`(4:5), `wide.svg`(16:9), `tall.svg`(9:16).

## 로드맵과 진도

| 단계 | 폴더 | 내용 | 상태 |
|---|---|---|---|
| 0 | `00-first-scene` | 씬·카메라·메시·렌더러, fov vs position.z | 완료 |
| 1 | `01-texture` | TextureLoader, 콜백, colorSpace, 이미지 비율 | 완료 |
| 2 | `02-render-loop` | requestAnimationFrame, 시간 기반 움직임, sin 숨쉬기 | 완료 |
| 3 | `03-mouse` | mousemove, 좌표 −1~1 변환, 기울이기 | 완료 |
| 4 | `04-lerp` | Lerp (목표 vs 현재 분리), 위치 따라오기 | 완료 |
| 5-1 | `05-shader-basics` | ShaderMaterial, gl_FragColor, vUv, 좌우 색 나누기 | 완료 |
| 5-2 | `05b-shader-texture` | uniform, texture2D, uv 비틀기, 흑백 | 완료 |
| 6 | `06-distortion` | uniform 매 프레임 갱신(uTime), sin 물결 왜곡 | **진행 중**: 실험 1~5와 직접 작성(마우스 거리로 물결 세기 uStrength 조절, Math.abs 사용) 남음 |
| 7 | — | 실무 정리: 리사이즈, PixelRatio 제한, dispose, 구조화. reference와 비교 | 예정 |

새 세션을 시작하면 이 표와 `lessons/` 폴더를 보고 어디까지 했는지 확인한 뒤 이어서 진행한다. 단계를 마치면 이 표의 상태를 갱신한다.

## 실행

```bash
npm.cmd install
npm.cmd run dev
```

`http://localhost:5173`에서 레슨 목록이 열린다.

## Git

- 원격: GitHub `tree-hs/webgl-playground` (public), 브랜치 `master`.
- 학습자가 "커밋해 줘"라고 하면 커밋하고 push까지 한다. 로컬에만 남기고 싶으면 학습자가 따로 말한다.
