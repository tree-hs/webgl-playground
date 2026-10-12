import * as THREE from 'three'

// 1. 세트장: 물체를 올려놓을 빈 공간
const scene = new THREE.Scene()

// 2. 카메라: 세트장을 어디서, 얼마나 넓게 볼지
//    (시야각 75도, 화면 비율, 가장 가까이 보이는 거리, 가장 멀리 보이는 거리)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 3 // 카메라를 화면 쪽(앞)으로 3만큼 뒤로 뺀다

// 3. 물체 = 모양(Geometry) + 재질(Material)
const geometry = new THREE.BoxGeometry(1, 1, 1) // 가로 1, 세로 1, 높이 1짜리 큐브
const geometry2 = new THREE.BoxGeometry(2, 1, 2)
const material = new THREE.MeshBasicMaterial({ color: 'tomato' }) // 조명 없이 색만 칠하는 재질
const material2 = new THREE.MeshBasicMaterial({ color: 'deepskyblue' }) // 조명 없이 색만 칠하는 재질
const mesh = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh.rotation.y = 0.5
mesh2.position.x = 2
scene.add(mesh) // 세트장에 올려놓기
scene.add(mesh2) // 세트장에 올려놓기

// 4. 렌더러: 카메라가 본 장면을 <canvas>에 그려주는 기계
const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// 5. 찰칵! 딱 한 번 그린다
renderer.render(scene, camera)
