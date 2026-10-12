import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// ★ 새로 배우는 부분 ★
// 1. 이미지를 불러오는 도구
const loader = new THREE.TextureLoader()

// 2. 이미지 불러오기 — 이미지는 "나중에" 도착한다.
//    그래서 도착했을 때 실행할 함수(콜백)를 같이 넘겨준다.
loader.load('/images/tall.svg', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace // 이미지 원래 색 그대로 보이게
  /*
  console.log(texture.image.width, texture.image.height)
  const geometry = new THREE.PlaneGeometry(1.78, 1)
  console.log(texture.image.width, texture.image.height)
  */
  //const ratio = 1500 / 1200
  const ratio = texture.image.width / texture.image.height
  const geometry = new THREE.PlaneGeometry(ratio, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture }) // color 대신 map에 이미지!
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // 이미지가 도착한 "다음에" 찍어야 화면에 나온다
  renderer.render(scene, camera)
})