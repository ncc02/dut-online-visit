
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js';

let renderer, scene, camera, cubeCamera;

let lightProbe;

init();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 30 );

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512 );

    cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

    // controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enablePan = false;

    // probe
    lightProbe = new THREE.LightProbe();
    scene.add( lightProbe );

    // envmap
    const genCubeUrls = function ( prefix, postfix ) {

        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];

    };

    const urls = genCubeUrls( 'textures/cube/pisa/congtruong/', '.png' );
    new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
        scene.background = cubeTexture;
        cubeCamera.update(renderer, scene);
        lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
        render();
    });
    let Next = '';
    const imageSetSelector = document.getElementById('imageSetSelector');
    imageSetSelector.addEventListener('change', updateImageSet);
    function updateImageSet() {
        Next = '';
        const selectedSet = imageSetSelector.value;
        const urls = genCubeUrls(`${selectedSet}`, '.png');
        new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
            scene.background = cubeTexture;
            cubeCamera.update(renderer, scene);
            lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
            render();
        });   
    }

    const imageSetSelectorBTN = document.getElementById('imageSetSelectorBTN');
    imageSetSelectorBTN.addEventListener('click', updateImageSetBTN);
    
    function updateImageSetBTN() {
        const selectedSet = imageSetSelector.value;
        Next = Next + 'next/'
        
        console.log(Next);
        const urls = genCubeUrls(`${selectedSet}${Next}`, '.png');
        console.log(`${selectedSet}+${Next}`);
        new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
            scene.background = cubeTexture;
            cubeCamera.update(renderer, scene);
            lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
            render();
        });

        
    }

    const imageSetSelectorBTN2 = document.getElementById('imageSetSelectorBTN2');
    imageSetSelectorBTN2.addEventListener('click', updateImageSetBTN2);
    
    function updateImageSetBTN2() {
        const selectedSet = imageSetSelector.value;
        if (Next.startsWith('next/')) {
            Next = Next.slice(5); // Xóa 5 ký tự đầu tiên ('next/')
        }
        
        console.log(Next);
        const urls = genCubeUrls(`${selectedSet}${Next}`, '.png');
        console.log(`${selectedSet}+${Next}`);
        new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
            scene.background = cubeTexture;
            cubeCamera.update(renderer, scene);
            lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
            render();
        });

        
    }
    // listener
    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();

}

function render() {

    renderer.render( scene, camera );

}