import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { gsap } from "gsap";

function isMobileDevice() {
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  return mobileQuery.matches;
}

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

let started = false;

//Input
const input = document.getElementById("input");

//tips
const tips = document.getElementById("tips");

//tip items
const tipItems = document.getElementById("items");

//Button
const button = document.getElementById("start");
button.addEventListener("click", () => {
  const fontLoader = new FontLoader();

  let textGeometry;

  fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
    const geometryText = input.value === "" ? "Empty" : input.value;
    textGeometry = new TextGeometry(geometryText, {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    //   textMaterial.wireframe = true;
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 20, 45),
        boxMaterial
      );

      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      donut.scale.set(scale, scale, scale);

      scene.add(donut);
    }
  });

  document.getElementById("main").style.visibility = "hidden";
  tips.style.visibility = "visible";

  started = true;
});

tips.addEventListener("click", () => {
  const itemStyle = window.getComputedStyle(tipItems);

  const display = itemStyle.display;

  const menuTimeline = gsap.timeline();

  if (display === "none") {
    menuTimeline.to(tips, {
      height: "94px",
      duration: 0.3,
      onComplete: () => {
        // After the animation is complete, set the lower inner div to display: none
        tipItems.style.display = "block";
      },
    });
    menuTimeline.to(tipItems, {
      opacity: 1,
      duration: 0.3,
    });
  } else {
    gsap.to(tipItems, {
      opacity: 0,
      duration: 0.1,
      onComplete: () => {
        // After the animation is complete, set the lower inner div to display: none
        tipItems.style.display = "none";
        gsap.to(tips, {
          height: "30px",
          duration: 0.3,
        });
      },
    });
  }
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const tempScene = new THREE.Scene();

// //Axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load("textures/matcaps/1.png");

/**
 * Fonts
 */

/**
 * Intro animationn
 */

const boxMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 20, 45),
  boxMaterial
);
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 20, 45),
  boxMaterial
);
sphere1.position.x = -2;
sphere2.position.x = 2;
tempScene.add(sphere1, sphere2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 || e.which === 13) {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 2;
if (isMobileDevice()) {
  camera.position.z = 3.5;
}

// camera.lookAt(textGeometry.position);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  //animate camera
  // if (started) {
  //   camera.position.x = Math.sin(elapsedTime / 10) * 1.5;
  //   camera.position.z = Math.cos(elapsedTime / 10) * 1.5;
  // }

  // Render
  if (!started) {
    renderer.render(tempScene, camera);
  } else {
    renderer.render(scene, camera);
  }

  //animate spheres
  if (!started) {
    sphere1.position.x = Math.sin(elapsedTime) * 1.5;
    sphere1.position.y = Math.cos(elapsedTime);
    sphere2.position.x = -(Math.sin(elapsedTime) * 1.5);
    sphere2.position.y = -Math.cos(elapsedTime);
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
