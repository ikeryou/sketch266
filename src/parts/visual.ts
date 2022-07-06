import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector3 } from 'three/src/math/Vector3';
import { CatmullRomCurve3 } from 'three/src/extras/curves/CatmullRomCurve3';
import { Util } from "../libs/util";
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry';
import { Shape } from 'three/src/extras/core/Shape';

export class Visual extends Canvas {

  private _con:Object3D;
  private _mesh:Mesh;

  public baseX:number = 0;
  public baseY:number = 0;
  public baseWidth:number = 10;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    this._mesh = new Mesh(
      this._makeGeo(),
      new MeshBasicMaterial({
        color:0xDB6E7A,
      }),
    );
    this._con.add(this._mesh);

    this._resize();
  }


  protected _update(): void {
    super._update();

    this._mesh.geometry.dispose();
    this._mesh.geometry = this._makeGeo();

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    const bgColor = new Color(0x0F3A58)
    this.renderer.setClearColor(bgColor, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }


  // ---------------------------------
  //
  // ---------------------------------
  private _makeGeo():ShapeGeometry {
    const arr:Array<Vector3> = []

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();
    const radius = sw * 0.05;

    // XとYを逆に
    let startX = sh * -0.6;
    let endX = sh * 0.6;
    let startY = this.baseX;

    let ang = 0;
    let i = startX;
    const interval = sh * 0.05;
    while(i < endX) {
      const radian = Util.instance.radian(this._c * 3 + ang);
      arr.push(new Vector3(startY + Math.sin(radian) * radius, i, 0));
      i += interval;
      ang += 7;
    }

    arr.push(new Vector3(sw, endX, 0));
    arr.push(new Vector3(sw, startX, 0));

    const curve = new CatmullRomCurve3(arr, true);
    const points = curve.getPoints(50);

    const shape = new Shape()
    points.forEach((val,i) => {
      if(i == 0) {
        shape.moveTo(val.x, val.y);
      } else {
        shape.lineTo(val.x, val.y)
      }
    });

    return new ShapeGeometry(shape);
  }
}
