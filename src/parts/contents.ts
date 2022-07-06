
import { Func } from "../core/func";
import { MyDisplay } from "../core/myDisplay";
import { Point } from "../libs/point";
import { Text } from "./text";
import { Visual } from "./visual";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _pos:Point = new Point();
  private _v:Visual;

  constructor(opt:any) {
    super(opt)

    this._v = new Visual({
      el:this.getEl()
    })

    const textB = '健康診断よかった';
    const textA = '本当は太ってた。';

    let txt = '<p>';
    let arrA = Array.from(textA);
    let arrB = Array.from(textB);
    for(let i = 0; i < Math.max(arrA.length, arrB.length); i++) {
      txt += '<span class="a">' + arrA[i % arrA.length] + '</span>';
      txt += '<span class="b">' + arrB[i % arrB.length] + '</span>';
    }
    txt += '</p>';
    (document.querySelector('.l-text') as HTMLElement).innerHTML = txt;

    // 後のテキストだと動かす
    document.querySelectorAll('.l-text .a').forEach((val) => {
      new Text({
        el:val
      })
    })
  }


  protected _update(): void {
    super._update();

    const sw = Func.instance.sw();
    // const sh = Func.instance.sh();

    // モニターサイズと位置
    const displayInfo: {x:number, y:number, width:number, height:number} = {
      width:window.screen.width,
      height:window.screen.height,
      x:window.screenX,
      y:window.screenY,
    }

    const ease = 0.1;
    this._pos.x += (displayInfo.x - this._pos.x) * ease;
    this._pos.y += (displayInfo.y - this._pos.y) * ease;

    // メインモニターからはみ出たら表示してくるように
    const w = (this._pos.x + sw) - displayInfo.width
    this._v.baseX = (sw - w) - sw * 0.5;
    this._v.baseWidth = w;
  }
}