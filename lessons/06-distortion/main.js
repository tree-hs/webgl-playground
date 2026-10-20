import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// 3·4단계에서 만든 마우스 + Lerp (직접 작성 과제에서 사용)
const mouse = { x: 0, y: 0 }
const current = { x: 0, y: 0 }
const ease = 0.08

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
})

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ★ 새로 배우는 부분 ★
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime; // 자바스크립트가 매 프레임 넣어주는 "지금 시간(초)"

  varying vec2 vUv;

  void main() {
    // vUv는 GPU가 준 값이라 직접 못 바꾼다 → 복사본(uv)을 만들어서 비튼다
    vec2 uv = vUv;

    // 물결: 높이(uv.y)에 따라 가로 위치(uv.x)를 sin으로 살짝 밀어준다
    //   sin( 높이 * 촘촘함 + 시간 ) * 세기
    uv.x += sin(uv.y * 10.0 + uTime) * 0.02;

    // 비튼 위치(uv)에서 사진 색을 가져온다
    gl_FragColor = texture2D(uTexture, uv);
  }
`

const loader = new THREE.TextureLoader()

loader.load('/images/logo.jpg', (texture) => {
  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio * 2, 2)

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: texture },
      uTime: { value: 0 },
    },
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function tick(time) {
    current.x += (mouse.x - current.x) * ease
    current.y += (mouse.y - current.y) * ease

    // 매 프레임 셰이더에게 "지금 시간"을 보내준다
    material.uniforms.uTime.value = time / 1000

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
})
