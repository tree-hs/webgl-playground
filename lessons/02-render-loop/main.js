import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

const loader = new THREE.TextureLoader()

loader.load('/images/logo.jpg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace

  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // ★ 새로 배우는 부분 ★
  // 한 장 찍고 끝내는 대신, "조금 바꾸고 → 찍고"를 계속 반복한다 (= 플립북)
  function tick(time) {
    // time: 페이지가 열린 뒤 흐른 시간 (밀리초, 1000 = 1초)
    //console.log(time);
    
    //시간 바꾸기
    const seconds = time / 1000 // 밀리초 → 초
    //console.log(seconds)

    
    // 1. 조금 바꾸고
    //mesh.rotation.y += 0.01
    mesh.rotation.y = seconds
    mesh.scale.set(Math.sin(seconds) + 1.5, Math.sin(seconds) + 1.5, 1)

    // 2. 찍고
    renderer.render(scene, camera)

    // 3. "다음 화면 그릴 때 tick을 또 불러줘" 하고 예약
    requestAnimationFrame(tick)
    //requestAnimationFrame 브라우저에서 제공해준ㄴ 함수
  }

  requestAnimationFrame(tick) // 첫 번째 tick 예약 → 이후로는 tick이 스스로 계속 예약
})
