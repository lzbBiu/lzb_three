import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const fov = 75;
let camera, scene, controls, renderer, light, mixer = null;
var clock = new Three.Clock();
var loader = new GLTFLoader();

var meshArr = [];

var animations = [];

var currMeshIndex = 0;

var flag = false;

export class Render {
    constructor(container) {
        renderer = new Three.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = Three.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
    }

    init() {
        scene = new Three.Scene();
        this.combinationModelData().then(() => {
            this.createCamera();
            this.createControls();
            this.createPlatform();
            this.createLight();

            this.loadModel(0);
            this.animate();
        });

    }

    loadGlb() {
        const promise1 = new Promise((resolve) => {
            loader.load('./1.glb', (gltf) => {
                resolve(gltf);
            })
        });

        const promise2 = new Promise((resolve) => {
            loader.load('./2.glb', (gltf) => {
                resolve(gltf);
            })
        });

        const promise3 = new Promise((resolve) => {
            loader.load('./3.glb', (gltf) => {
                resolve(gltf);
            })
        });

        return Promise.all([promise1, promise2, promise3]);
    }

    combinationModelData() {
        return this.loadGlb().then(arr => {
            arr.forEach((item, index) => {
                item.scene.name = index;
                item.animations[0].name = index;

                meshArr.push(item.scene);
                animations.push(item.animations[0]);
            });

            console.log('meshArr', meshArr);
            console.log('animations', animations);
        })
    }

    createCamera() {
        camera = new Three.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set(0, 40, 100);
        camera.lookAt(new Three.Vector3(0, 0, 0));
        scene.add( camera );
    }

    createControls() {
        controls = new OrbitControls( camera, renderer.domElement );
        // controls.rotateSpeed = 5;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        // controls.dynamicDampingFactor = 0.3;

        controls.addEventListener( 'change', this.render );
    }

    loadModel(meshIndex) {
        this.delModel();
        this.createModel(Number(meshIndex));
        this.playAnimation(Number(meshIndex));
        flag = true;
    }

    delModel() {
        flag && scene.remove(meshArr[Number(currMeshIndex)]);
    }

    createModel(index) {
        currMeshIndex = Number(index);
        var mesh = meshArr[Number(index)];
        
        mesh.scale.set(10, 10, 10);
        mesh.position.set(0, 0, 0);
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });

        scene.add(mesh);
    }

    playAnimation(index) {
        var mesh = meshArr[Number(currMeshIndex)];
        
        mesh.scale.set(10, 10, 10);
        mesh.position.set(0, 0, 0);
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });

        mixer = new Three.AnimationMixer(mesh);

        var AnimationAction = mixer.clipAction(animations[Number(index)]);

        AnimationAction.play();
    }

    createPlatform() {
        var planeGeometry = new Three.PlaneGeometry(100, 100);
        var planeMaterial = new Three.MeshStandardMaterial({color: 0xaaaaaa});

        var plane = new Three.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0);
        plane.rotateX( -Math.PI / 2);

        plane.receiveShadow = true;
        scene.add(plane);

    }

    createLight() {
        scene.add(new Three.AmbientLight(0xffffff));

        light =  new Three.PointLight( 0xffffff );
        light.position.set(0, 30, 0);

        light.castShadow = true;

        scene.add(light);

        var light1 =  new Three.PointLight( 0xffffff );
        light1.position.set(-30, 0, 30);

        scene.add(light1);

        var light2 =  new Three.PointLight( 0xffffff );
        light2.position.set(30, 0, -30);

        scene.add(light2);
    }

    render() {
        renderer.render(scene, camera);
        if (mixer !== null) {
            // clock.getDelta(); //方法获得两帧的时间间隔
            // 更新混合器相关的时间
            mixer.update(clock.getDelta());
        }
    }

    animate() {
        this.render();

        controls.update();

        requestAnimationFrame(() => {
            this.animate();
        });

    }

}