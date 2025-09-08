import { OBJLoader } from "./OBJLoader.js"
import { OrbitControls } from "./OrbitControls.js"
import * as THREE from "./three.module.js"

const setUpThree = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // init
  const camera = new THREE.PerspectiveCamera(100, width / height, 0.01, 10000);
  const dis = 5;
  camera.position.z = dis;
  camera.position.x = 1.5;
  camera.position.y = 0;
  

  camera.lookAt(1.5, 0, 0);

  const scene = new THREE.Scene();
  // const clock = new THREE.Clock()
  scene.background = new THREE.Color(0xffc0cb);

  // 创建六种不同颜色的canvas纹理
  function createColorTexture(color, text) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // 填充背景色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);

    // 添加文字
    ctx.fillStyle = "#6806cb";
    ctx.font = "bold 66px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 128);
    // 添加边框
    ctx.strokeStyle = "#FF0000FF";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, 256, 256);


    return new THREE.CanvasTexture(canvas);
  }
  // 加载6张不同的纹理图片
  const textureLoader = new THREE.TextureLoader();
  const textures = [
    createColorTexture("#DB5989FF", "喜"), // 红色 - 右面
    createColorTexture("#DB5989FF", "你"), // 绿色 - 左面
    createColorTexture("#EE0D42FF", "爱"), // 蓝色 - 上面
    createColorTexture("#EE0D42FF", "你"), // 黄色 - 下面
    createColorTexture("#DB5989FF", "我"), // 紫色 - 前面 我
    createColorTexture("#DB5989FF", "欢"), // 青色 - 后面
  ];

  // 为每个纹理创建材质

  // boxGroup
  const boxGroup = new THREE.Group();
  const boxMaterial = textures.map(
    (texture) => new THREE.MeshBasicMaterial({ map: texture })
  );
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxGroup.add(boxMesh);
  scene.add(boxGroup);
  boxGroup.position.set(3, 0, 0);

  // heartGroup
  const heartGroup = new THREE.Group();
  scene.add(heartGroup);
  const circleGeometry = new THREE.CircleGeometry(1, 128);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    side: THREE.DoubleSide,
  });
  const circle = new THREE.Mesh(circleGeometry, material);
  heartGroup.add(circle);
  heartGroup.position.set(0, 0, 0);

  new OBJLoader().load("/heart_2.obj", (obj) => {
    const heart = obj.children[0];
    heart.geometry.rotateX(-Math.PI * 0.5);
    heart.geometry.scale(0.04, 0.04, 0.04);
    heart.geometry.translate(0, -0.4, 0);
    heartGroup.add(heart);

    heart.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
  });

  // 创建一个点光源
  const pointLight = new THREE.PointLight(0xffffff, 1, 100000);
  pointLight.position.set(100, 100, 100);
  scene.add(pointLight);

  // 创建一个环境光源
  const ambientIntensity = 0.2;
  const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity); // 弱白光
  scene.add(ambientLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.autoClear = false;
  renderer.setAnimationLoop(animation);

  const controls = new OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);

  controls.addEventListener("change", () => renderer.render(scene, camera));

  function render() {
    controls.update();
    renderer.clear();
    renderer.render(scene, camera);
  }

  let flagMode = 0
  function animation (time) {
    // console.log(time)
    // boxGroup.rotation.x = time / 2000;
    // boxGroup.rotation.y = time / 1000;
    boxGroup.rotation.y -= 0.02;
    heartGroup.rotation.y += 0.02;
    if (boxGroup.rotation.y <= -Math.PI * 2) { 
      boxGroup.rotation.y = 0
    }
    if (heartGroup.rotation.y >= Math.PI * 2) {
      heartGroup.rotation.y = 0;
    }
    render();
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
  });
  animation(10);
};

setUpThree();
