import './style.css'
import Experience from './webgl/Experience.js'

// 자신의 이미지를 쓰려면 public/images/ 에 넣고 이 경로만 바꾸면 된다.
// 예: '/images/hero.jpg'
const IMAGE_URL = '/images/sample.svg'

const experience = new Experience({
  canvas: document.querySelector('canvas.webgl'),
  imageUrl: IMAGE_URL,
})

// Vite HMR로 모듈이 교체될 때 이전 WebGL 리소스를 해제한다 (메모리 누수 방지)
if (import.meta.hot) {
  import.meta.hot.dispose(() => experience.dispose())
}
