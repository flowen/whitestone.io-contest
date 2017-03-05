import {
  Object3D,
  BufferGeometry,
  BufferAttribute,
  DoubleSide,
  Face3,
  Geometry,
  Math as tMath,
  MeshStandardMaterial,
  Mesh,
  ShapeUtils,
  Vector3
} from 'three';

export default class CustomG extends Object3D {
  constructor() {
	super();

	const geometry = new Geometry();

	// var dist = window.innerWidth;
	var dist = 10;
	
	for(var i = 0; i < 360; i++) {
		var x1 = Math.sin(tMath.radToDeg(i)) * dist;
		var x2 = Math.sin(tMath.radToDeg(i)) * dist;
		var x3 = Math.sin(tMath.radToDeg(i)) * dist;

		var y1 = Math.cos(tMath.radToDeg(i)) * dist;
		var y2 = Math.cos(tMath.radToDeg(i)) * dist;
		var y3 = Math.cos(tMath.radToDeg(i)) * dist;

		var z1 = Math.cos(tMath.radToDeg(i)) * dist;
		var z2 = Math.cos(tMath.radToDeg(i)) * dist;
		var z3 = Math.sin(tMath.radToDeg(i)) * dist;

		for (var j = 0; j < 7; ++j) {
			// var v1 = new Vector3(x1, y2, z3);
			// var v2 = new Vector3(x2, y1, z2);
			// var v3 = new Vector3(x3, y3, z1);

			var v1 = new Vector3(x1 * j, y2 * j, z3 * (3*j) * Math.PI);
			var v2 = new Vector3(x3 * j, y1 * j, z2 * (3*j) * Math.TWO_PI);
			var v3 = new Vector3(x2 * j, y3 * j, z2 * (3*j) * Math.TWO_PI);

			geometry.vertices.push(v1);
			geometry.vertices.push(v2);
			geometry.vertices.push(v3);

			geometry.faces.push( new Face3( i, i+1, i+2 ) );
		}
	}

	/* other triangulate methods: */
	//earcut doesn't work???
	// var triangles = earcut(geometry.vertices, [], []);
	// var triangles = ShapeUtils.triangulate(geometry.vertices, []);
	// push face for each triangle
	// for (var i = 0; i < triangles.length; i++) {
	// 	geometry.faces.push( new Face3( triangles[i][0], triangles[i][1], triangles[i][2] ) );
	// }

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	/* use buffers:
		
		var verticesA = new Float32Array(201);
		for (var i = 0; i < 201; i++) {
		  verticesA[i] = Math.randFloat(-1, 1);
		}

		var vertices = new Float32Array(verticesA);

		itemSize = 3 because there are 3 values (components) per vertex
		geometry.addAttribute( 'position', new BufferAttribute( vertices, 3 ) );
	*/

	const material = new MeshStandardMaterial( { 
		// color: 0xff0000, 
		// wireframe: true,
		roughness: 0.18, 
		metalness: 0.6,
		side: DoubleSide
	});
	const mesh = new Mesh( geometry, material );

	this.add(mesh);
  }
}