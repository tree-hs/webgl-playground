import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// 버텍스 셰이더: 5-1단계와 완전히 같음
const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ★ 새로 배우는 부분 ★
const fragmentShader = /* glsl */ `
  // uniform = 자바스크립트가 넘겨준 값. 모든 픽셀(화가)이 "똑같은" 값을 받는다.
  //   (varying인 vUv는 픽셀마다 다르고, uniform은 모두 같다)
  // sampler2D = 이미지(텍스처)를 담는 자료형
  uniform sampler2D uTexture;

  varying vec2 vUv;

  void main() {
    // texture2D(이미지, 위치) = "이미지의 그 위치에 있는 색을 가져와"
    // → 각 화가가 자기 위치(vUv)에 해당하는 사진 색을 찾아서 칠한다
    vec4 color = texture2D(uTexture, vUv);

    // ─── 실험: "찾아올 위치"를 비틀면 그림이 바뀐다 (6단계 왜곡의 원리) ───
    // 뒤집기: 아래 화가(y=0)는 1.0 위치(맨 위) 색을, 위 화가(y=1)는 0.0 위치(맨 아래) 색을 가져온다
    //vec4 color = texture2D(uTexture, vec2(vUv.x, 1.0 - vUv.y));
    // 확대: 찾는 위치가 0~0.5로 줄어 → 사진의 왼쪽 아래 1/4만 판 전체에 늘어나 그려진다
    //vec4 color = texture2D(uTexture, vUv * 0.5);
    // 이동: 모두 0.2만큼 오른쪽 색을 가져와 → 사진이 왼쪽으로 밀려 보인다
    //       1.0을 넘는 위치는 사진 맨 끝 줄 색을 반복해서 가져와 → 오른쪽 가장자리가 줄무늬처럼 늘어남
    //vec4 color = texture2D(uTexture, vec2(vUv.x + 0.2, vUv.y));

    gl_FragColor = color;
    // 빨강 성분만 남기기 (color.r = 빨강, color.g = 초록, color.b = 파랑, color.a = 투명도)
    //gl_FragColor = vec4(color.r, 0.0, 0.0, 1.0);

    // ─── 직접 작성: 왼쪽 원본 / 오른쪽 흑백 ───
    // 위에서 모든 픽셀을 원본(color)으로 칠해 두고, 오른쪽 절반만 흑백으로 덮어쓴다.
    if (vUv.x > .5) {
      // ✗ 고정된 색 → 사진을 안 보고 모든 화가가 똑같이 (0,0,0)을 칠함 → 전부 검정
      //gl_FragColor = vec4( 0, 0, 0, .1 );

      // ✓ 내 자리 사진 색의 "밝기"만 남기기
      //   흑백 = 빨강·초록·파랑이 모두 같은 색. 세 성분의 평균을 세 칸에 똑같이 넣는다.
      //   화가마다 가져온 color가 다르니 gray도 다 다르다 → 사진 모양이 그대로 보이는 흑백
      //     흰색 (1.0, 1.0, 1.0) → 1.0 흰색
      //     주황 (1.0, 0.5, 0.0) → 0.5 중간 회색
      //     검정 (0.0, 0.0, 0.0) → 0.0 검정
      float gray = ( color.r + color.g + color.b ) / 3.0;   // 세 성분의 평균
      gl_FragColor = vec4( gray, gray, gray, 1.0 );
    }

    // 셰이더의 기본 패턴: 사진에서 색을 가져온다 → 계산으로 바꾼다 → 칠한다
    //   (흑백, 색 반전 1.0 - color.r, 밝기 조절 color.rgb * 1.5 같은 필터가 전부 이 구조)
  }
`

const loader = new THREE.TextureLoader()

loader.load('/images/logo.jpg', (texture) => {
  // 1단계에서 넣던 texture.colorSpace 줄은 일부러 뺐다 (실험 5)
  //   MeshBasicMaterial은 Three.js가 색 보정을 앞뒤로 해주지만,
  //   ShaderMaterial을 직접 쓰면 마지막 보정이 빠진다 → 이 줄을 넣으면 오히려 어둡고 진해진다
  //texture.colorSpace = THREE.SRGBColorSpace

  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio * 2, 2)

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    // 자바스크립트 → 셰이더로 값 넘기기. 이름(uTexture)이 셰이더 안의 이름과 같아야 한다
    uniforms: {
      uTexture: { value: texture },
    },
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  renderer.render(scene, camera)
})
