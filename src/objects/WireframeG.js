import {
  Color,
  Object3D,
  Math as tMath,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3
} from 'three';

var spheres = [];
var color = new Color(0, 0, 0);

class WireframeG extends Object3D {
  constructor(totalSize, sphereSize) {
	super();
	
	var sphereMaterial = new MeshBasicMaterial({
		wireframeLinewidth: 1,
		wireframe: true,
		transparent: true, 
		opacity: .075
	});
		

	for (var x = -totalSize/2; x < totalSize+sphereSize; x=x+sphereSize) {
		for (var y = -totalSize/2; y < totalSize+sphereSize; y=y+sphereSize) {
			for (var z = -totalSize/2; z < totalSize+sphereSize; z=z+sphereSize) {
				var sphereGeometry = new SphereGeometry(sphereSize, 5, 5);
				var sphere = new Mesh(sphereGeometry, sphereMaterial);
				sphere.position.x = x + Math.random() * 50;
				sphere.position.y = y + Math.random() * 50;
				sphere.position.z = z + Math.random() * 50;

				spheres.push(sphere);	
				this.add(sphere);
			}
		}
	}

  }


  updateColor(lowAvg, midAvg, highAvg) {
  	var r = Map(lowAvg, 0, 1, 0, 125);
  	var g = Map(midAvg, 0, 1, 125, 255);
  	// var b = Map(highAvg, 0, 1, 50, 2);
  	
  	for (var i = 0; i < spheres.length; i++) {
  		color.r = r;
  		color.g = g;
  		color.b = 0;
  		spheres[i].material.color.set( color );
  	}
  }
}

export default WireframeG;