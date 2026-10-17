import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// ★ 새로 배우는 부분 ★
// 1. 마우스 위치를 담아둘 상자 (처음엔 화면 가운데 = 0, 0)
const mouse = { x: 0, y: 0 }

// 2. 마우스가 움직일 때마다 브라우저가 이 함수를 불러준다
window.addEventListener('mousemove', (event) => {
  // event.clientX, clientY: 화면 왼쪽 위 모서리 기준 마우스 위치 (픽셀)
  // → 화면 가운데가 0, 왼쪽 끝 -1, 오른쪽 끝 1 이 되도록 바꾼다
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1) // 위쪽이 + 가 되도록 뒤집기
})

const loader = new THREE.TextureLoader()
loader.load('/images/logo.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace
  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  function tick() {
    // 3. 렌더 루프 안에서 "지금" 마우스 위치를 읽는다
    //console.log(mouse.x.toFixed(2), mouse.y.toFixed(2)) 
    mesh.rotation.x = -mouse.y * 0.3; // 마우스 y 위치로 이미지 기울이기
    mesh.rotation.y = mouse.x * 0.3; // 마우스 x 위치로 이미지 기울이기
    // 여기에 직접 작성 ✍️ — 마우스 위치로 이미지 기울이기
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
