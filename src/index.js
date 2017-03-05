import {
	WebGLRenderer,
	Scene,
	PerspectiveCamera,
	PointLight,
	Math as tMath,
	Vector3
} from 'three';

//node.js
import loop from 'raf-loop';
import WAGNER from '@superguigui/wagner';
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass';
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';
import Noise from '@superguigui/wagner/src/passes/noise/noise';
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';
import DOFPass from '@superguigui/wagner/src/passes/dof/DOFPass';
import resize from 'brindille-resize';
// import earcut from 'earcut';

// audio analyser and averager
import audioPlayer from 'web-audio-player';
import createAnalyser from 'web-audio-analyser';
import average from 'analyser-frequency-average';
import createAudioContext from 'ios-safe-audio-context';

//three.js
import Torus from './objects/Torus';
import CustomG from './objects/CustomG';
import WireframeG from './objects/WireframeG';
import OrbitControls from './controls/OrbitControls';

//utilities
import Map from './utils/math.map';
import player from './utils/audioplayer';
import { audioUtil, analyser, bands } from './utils/analyser';

import h from './utils/helpers';
import {gui} from './utils/debug';

/* Custom variables */
var time = 0;

/* Custom settings */
const SETTINGS = {
  useComposer: true,
  focalDistance : 35
};

/* Init renderer and canvas */
const container = document.body;
const renderer = new WebGLRenderer({antialias: true, alpha: true});
// renderer.setClearColor(0x48e2dd); // use styles on
container.style.overflow = 'hidden';
container.style.margin = 0;
container.appendChild(renderer.domElement);

/* Composer for special effects */
const composer = new WAGNER.Composer(renderer);
const bloomPass = new BloomPass();
const fxaaPass = new FXAAPass();
const noise = new Noise({
	amount : .1,
	speed : .1
});
const vignette = new VignettePass({
	boost : 1,
	reduction : 1
});
const dof = new DOFPass({
	focalDistance : .0001,
	aperture : .1,
	tBias : .1,
	blurAmount : .1
});

/* Main scene and camera */
const scene = new Scene();
const camera = new PerspectiveCamera(50, resize.width / resize.height, 0.1, 1000);
const controls = new OrbitControls(camera, {
	element: renderer.domElement, 
	distance: 200,
	phi: Math.PI * 0.5,
	distanceBounds: [0, 300]
});

/* Lights */
const frontLight = new PointLight(0xffcc66, 1);
const backLight = new PointLight(0xff66e4, 0.5);
scene.add(frontLight, backLight);
frontLight.position.x = 20;
frontLight.position.y = 12;
frontLight.position.z = 70;
backLight.position.x = -20;
backLight.position.z = 65;

/* Actual content of the scene */
// const torus = new Torus();
const customG = new CustomG(7);
const wireframeG = new WireframeG(200, 40);

scene.add(customG);
scene.add(wireframeG);

/* Various event listeners */
resize.addListener(onResize);


/* create and launch main loop */
const engine = loop(render);
engine.start();

/* some stuff with gui */
gui.add(SETTINGS, 'useComposer');
gui.add(SETTINGS, 'focalDistance');

/* custom variables */
var t = 0,
tprev = t;

/* -------------------------------------------------------------------------------- */


/**
  Resize canvas
*/
function onResize() {
	camera.aspect = resize.width / resize.height;
	camera.updateProjectionMatrix();
	renderer.setSize(resize.width, resize.height);
	composer.setSize(resize.width, resize.height);
}
/**
  Render loop
*/
function render(dt) {
	controls.update();

	//update frequencies
	var freqs = audioUtil.frequencies();

	// update average of bands
	var subAvg = average(analyser, freqs, bands.sub.from, bands.sub.to);
	var lowAvg = average(analyser, freqs, bands.low.from, bands.low.to);
	var midAvg = average(analyser, freqs, bands.mid.from, bands.mid.to);
	var highAvg = average(analyser, freqs, bands.high.from, bands.high.to);
	// console.log(subAvg, lowAvg, midAvg, highAvg);
	
	// frontLight.position.x += lowAvg;

	/* lights */
	frontLight.intensity = lowAvg * 2.5;
	backLight.intensity = highAvg * 3.5;

	/* object movement */
	tprev = t * .75;
	t = .0025 + lowAvg + tprev;

	customG.rotation.x = Math.sin(Math.PI * 10) + t;
	customG.rotation.y = Math.cos(Math.PI * 7.5) + t;
	customG.rotation.z += .005;

	wireframeG.rotation.x = Math.sin(Math.PI * .5) + t/10;
	wireframeG.rotation.y = Math.cos(Math.PI * .5) + t/10;
	wireframeG.rotation.z -= .0025;
	
	wireframeG.updateColor(lowAvg, midAvg, highAvg);


	/* camera */
	camera.lookAt(customG.position);
	camera.setFocalLength ( SETTINGS.focalDistance );
	// camera.setFocalLength ( Map(lowAvg , 0, 1, 1, 60) );

	// edit composer with sound
	var ns = Map(highAvg,0, 1, .5, .75);
	noise.speed = ns;

	var fd = Map(lowAvg, 0, 1, .0001, 1);
	dof.focalDistance = fd;

	if (SETTINGS.useComposer) {
		composer.reset();
		composer.render(scene, camera);
		composer.pass(bloomPass);
		composer.pass(fxaaPass);
		composer.pass(noise);
		composer.pass(vignette);
		composer.pass(dof);
		composer.toScreen();
	}
	else {
		renderer.render(scene, camera);
	}
}