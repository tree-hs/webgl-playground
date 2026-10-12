import * as THREE from 'three'

// 평면이 화면에서 차지할 최대 비율 (가로, 세로)
const MAX_VIEWPORT_RATIO = { width: 0.55, height: 0.72 }

// 정점 분할 수. Step 1에서는 의미가 없지만, 이후 셰이더로 표면을 휘게 만들 때
// 정점이 충분해야 매끄럽게 구부러진다.
const SEGMENTS = 32

export default class ImagePlane {
  constructor({ url, sizes }) {
    this.sizes = sizes
    this.imageAspect = 1 // 텍스처 로드 전 기본값

    // 1×1 크기 평면을 만들고, 실제 픽셀 크기는 mesh.scale로 조절한다.
    // → 리사이즈 때 geometry를 새로 만들 필요가 없다.
    this.geometry = new THREE.PlaneGeometry(1, 1, SEGMENTS, SEGMENTS)
    this.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.loadTexture(url)
  }

  loadTexture(url) {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        if (this.disposed) {
          texture.dispose()
          return
        }

        texture.colorSpace = THREE.SRGBColorSpace // 색이 탁해지지 않게
        texture.minFilter = THREE.LinearFilter
        texture.generateMipmaps = false // 정면에서 보는 평면이라 밉맵 불필요 → 메모리 절약

        this.texture = texture
        this.imageAspect = texture.image.width / texture.image.height

        this.material.map = texture
        this.material.needsUpdate = true
        this.resize(this.sizes)
        this.fadeInStart = performance.now()
      },
      undefined,
      (error) => console.error(`[ImagePlane] 이미지를 불러오지 못했어요: ${url}`, error),
    )
  }

  // 이미지 비율을 유지한 채, 화면의 MAX_VIEWPORT_RATIO 안에 "contain" 되도록 크기 계산
  resize(sizes) {
    this.sizes = sizes

    const maxWidth = sizes.width * MAX_VIEWPORT_RATIO.width
    const maxHeight = sizes.height * MAX_VIEWPORT_RATIO.height

    let width = maxWidth
    let height = width / this.imageAspect
    if (height > maxHeight) {
      height = maxHeight
      width = height * this.imageAspect
    }

    this.mesh.scale.set(width, height, 1)
  }

  update() {
    // 로드 직후 0.8초 동안 부드럽게 페이드인
    if (this.fadeInStart !== undefined && this.material.opacity < 1) {
      const t = Math.min((performance.now() - this.fadeInStart) / 800, 1)
      this.material.opacity = 1 - Math.pow(1 - t, 3) // easeOutCubic
    }
  }

  dispose() {
    this.disposed = true
    this.geometry.dispose()
    this.material.dispose()
    this.texture?.dispose()
  }
}
