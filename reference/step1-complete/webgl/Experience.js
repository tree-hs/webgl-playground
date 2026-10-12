import * as THREE from 'three'
import ImagePlane from './ImagePlane.js'

// 카메라와 평면(z=0) 사이 거리. 이 값으로 FOV를 역산해서
// "월드 1 unit = CSS 1px"이 되도록 맞춘다 → DOM 레이아웃과 좌표를 그대로 공유 가능.
const CAMERA_DISTANCE = 600

// 고해상도 화면에서 GPU 부담이 폭증하지 않도록 픽셀 비율 상한을 둔다.
const MAX_PIXEL_RATIO = 2

export default class Experience {
  constructor({ canvas, imageUrl }) {
    this.canvas = canvas
    this.sizes = this.readSizes()

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      this.computeFov(this.sizes.height),
      this.sizes.width / this.sizes.height,
      10,
      CAMERA_DISTANCE * 2,
    )
    this.camera.position.z = CAMERA_DISTANCE

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0) // 배경은 CSS가 담당
    this.renderer.setPixelRatio(this.sizes.pixelRatio)
    this.renderer.setSize(this.sizes.width, this.sizes.height)

    this.imagePlane = new ImagePlane({ url: imageUrl, sizes: this.sizes })
    this.scene.add(this.imagePlane.mesh)

    this.onResize = this.onResize.bind(this)
    window.addEventListener('resize', this.onResize)

    this.clock = new THREE.Clock()
    this.tick = this.tick.bind(this)
    this.renderer.setAnimationLoop(this.tick)
  }

  readSizes() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
    }
  }

  // 화면 높이(px)가 정확히 시야에 들어오는 수직 FOV(도)
  computeFov(height) {
    return 2 * Math.atan(height / 2 / CAMERA_DISTANCE) * (180 / Math.PI)
  }

  onResize() {
    this.sizes = this.readSizes()

    this.camera.fov = this.computeFov(this.sizes.height)
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(this.sizes.pixelRatio)
    this.renderer.setSize(this.sizes.width, this.sizes.height)

    this.imagePlane.resize(this.sizes)
  }

  tick() {
    const elapsed = this.clock.getElapsedTime()
    this.imagePlane.update(elapsed) // Step 2부터 마우스 인터랙션이 여기 들어온다
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    window.removeEventListener('resize', this.onResize)

    this.scene.remove(this.imagePlane.mesh)
    this.imagePlane.dispose()

    this.renderer.dispose()
  }
}
