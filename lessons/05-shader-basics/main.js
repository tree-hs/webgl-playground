import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// ★ 새로 배우는 부분 ★
// 셰이더는 자바스크립트가 아니라 GLSL이라는 별도 언어로 쓴다.
// 그래서 글자(문자열)로 적어서 GPU에게 넘겨준다.
//
// ─── vUv 값은 어디서 오나? (반복문·증감이 코드에 안 보이는 이유) ───
//
// ① 판이 처음부터 "모서리 위치표(uv)"를 갖고 있다
//    PlaneGeometry를 만들면 Three.js가 네 모서리에 위치표를 자동으로 붙여준다.
//      (0,1) ●─────● (1,1)
//            │     │
//      (0,0) ●─────● (1,0)
//    확인: console.log(geometry.attributes.uv.array) → [0,1, 1,1, 0,0, 1,0]
//
// ② 버텍스 셰이더가 그 위치표를 vUv에 담아 넘긴다 (아래 vUv = uv; 줄)
//
// ③ GPU가 모서리 사이 픽셀들의 값을 "자동으로 섞어서" 채운다
//    왼쪽 모서리 0 ●━━━━━━━━━━━━━● 오른쪽 모서리 1
//                0   0.25  0.5  0.75   1
//    → 정확히 가운데 픽셀은 아무도 정의 안 해도 자동으로 0.5
//    → varying = "픽셀마다 달라지는 값"이라는 뜻
//
// ④ GPU가 모든 픽셀마다 프래그먼트 셰이더 main()을 "동시에" 한 번씩 실행하면서
//    매번 그 픽셀의 vUv를 넣어준다. 자바스크립트로 치면 이런 반복문을 GPU가 몰래 돈다:
//      for (모든 픽셀) { vUv = 이 픽셀 위치; main(); }
//    그래서 우리는 "픽셀 하나를 칠하는 방법"만 쓰면 된다.

// 1. 버텍스 셰이더: 판의 "꼭짓점"마다 실행 → 화면 어디에 놓을지 정한다
//    (지금은 손대지 않는 기본 코드. 6단계에서 이걸로 판을 휘게 만든다)
const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv; // 이 꼭짓점의 판 위 위치를 프래그먼트 셰이더에게 전달
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// 2. 프래그먼트 셰이더: 화면의 "픽셀"마다 실행 → 무슨 색으로 칠할지 정한다
//    ★ 이번 단계에서 고칠 곳은 여기뿐 ★
const fragmentShader = /* glsl */ `
  varying vec2 vUv; // 지금 칠하는 픽셀이 판 위 어디인지 (왼쪽 아래 0,0 ~ 오른쪽 위 1,1)

  void main() {
    //             빨강  초록  파랑  불투명도
    //gl_FragColor = vec4(1.0, 0.4, 0.3, 1.0);
    //gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);

    // 조건문 하나를 모든 픽셀이 "각자 자기 vUv.x로" 검사한다
    //   왼쪽 끝 0.0, 왼쪽 1/4 0.25 → 0.5보다 작음 → 빨강
    //   오른쪽 3/4 0.75, 오른쪽 끝 1.0 → 아님 → 파랑
    // (GLSL에는 console.log가 없다. 값을 확인하고 싶으면 위처럼 색으로 찍어 본다)
    if (vUv.x < .5) {
      gl_FragColor = vec4( 1, 0, 0, 1 );   // 빨강
    } else {
      gl_FragColor = vec4( 0, 0, 1, 1 );   // 파랑
    }
  }
`

const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader }) // MeshBasicMaterial 대신!
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

renderer.render(scene, camera)
