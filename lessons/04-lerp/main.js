import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// 마우스 실제 위치 (= 목표)
const mouse = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
})

// ★ 새로 배우는 부분 ★
// 이미지가 "지금" 쓰고 있는 위치. 마우스를 바로 쓰지 않고, 이 값이 마우스를 천천히 쫓아간다
const current = { x: 0, y: 0 }

// 매 프레임 남은 거리의 몇 %만큼 갈지 (0 ~ 1)
const ease = 0.08

const loader = new THREE.TextureLoader()

loader.load('/images/logo.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace

  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })

  // 같은 모양·재질로 판 두 개를 만들어 왼쪽, 오른쪽에 둔다
  const left = new THREE.Mesh(geometry, material)
  left.position.x = -1
  scene.add(left)

  const right = new THREE.Mesh(geometry, material)
  right.position.x = 1
  scene.add(right)

  function tick() {
    // 왼쪽: 3단계 방식 — 마우스 값을 바로 사용
    left.rotation.x = -mouse.y * 0.3
    left.rotation.y = mouse.x * 0.3

    // 오른쪽: Lerp — current가 mouse 쪽으로 "남은 거리 × ease"만큼만 다가간다
    current.x += (mouse.x - current.x) * ease
    current.y += (mouse.y - current.y) * ease

    right.rotation.x = -current.y * 0.3
    right.rotation.y = current.x * 0.3

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
})
