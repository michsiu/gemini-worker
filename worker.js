export default {
  async fetch(request) {
    const html = `
<meta charset="utf-8">
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LibLib Chat Images, 第1页, 共82项</title>
    <style>
        .grid-item .img-content {
            width: 100%;
            /* 图片宽度为父元素宽度的 100% */
            height: auto;
            /* 让高度自适应以保持宽高比 */
            border-radius: 10px;
            /* 设置圆角半径为10px */
            box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
            /* 底部投影 */

            cursor: pointer;
            /* 鼠标指针样式为手型 */
        }
        img[data-src]{
            opacity: 0;
            transform: translateY(20px);
            transition: 
                opacity 0.6s ease-out,
                transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        img.loaded {
            animation: gentleDrop 1.2s both;
        }

       @keyframes gentleDrop {
           0% { 
               opacity: 0;
               transform: translateY(-20px) scale(0.5);
           }
          50% {
              opacity: 0.8;
              transform: translateY(5px) scale(1.01);
          }
          100% {
              opacity: 1;
              transform: none;
              }
          }



        .grid-item .hidden-info {
            display: none;
        }

        .grid-item .bottomInfo {
            color: white;
            font-family: siyuanmid;
            font-size: 12px;
            background-color: rgba(0, 0, 0, 0.35);
            width: 94%;
            max-height: 40%;
            overflow: hidden;
            position: absolute;
            bottom: 0;
            text-align: center;
            padding: 0 3% 0 3%;
            border-radius: 0 0 10px 10px;
        }

        .grid-item .topRightInfo {
            color: white;
            font-family: siyuanxlight;
            font-size: 12px;
            background-color: rgba(0, 0, 0, 0.35);
            border-radius: 10px;
            position: absolute;
            right: 3px;
            top: 3px;
            padding: 0 3px 0 3px;
            margin: 0;
        }



        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
            }
        }

        @keyframes zoomIn {
            from {
                transform: scale(0.5);
            }

            to {
                transform: scale(1);
            }
        }

        @keyframes zoomOut {
            from {
                transform: scale(1);
                opacity: 1;
            }

            to {
                transform: scale(0.5) translateY(-300px);
                opacity: 0;
            }
        }

        .image-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            -webkit-backdrop-filter: blur(10px);
            background-color: rgba(0, 0, 0, 0.7);
            /* 半透明背景 */
            z-index: 1000;
            /* 确保覆盖在其他内容之上 */
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;

        }

        .image-overlay.active {
            display: flex;
        }

        .image-overlay.fadeIn {
            animation: fadeIn 0.5s ease forwards;
        }

        .image-overlay.fadeOut {
            animation: fadeOut 0.5s ease forwards;
        }

        /* 应该是这个无意之中解决了infosvg查看信息后的缩放与滑动翻页的动画冲突，这样即使在查看信息的状态下滑动翻页依旧不会有动画冲突，原理未知 */
        .image-overlay #overlayimage-container.active {
            display: flex;
            position: absolute;
            max-height: auto;
            max-width: auto;
            justify-content: center;
            align-items: center;
            transition: transform 0.5s ease;
        }

        .image-overlay #overlayimage-container #overlay-image {
            /* 与容器的限高保持一致，也只能通过这种方式给图片限高；同时解决了信息图标总是偏移的问题,但还是无法解决动画宽度偏移的问题 */
            max-height: 95vh;
            /* 宽度撑满容器 */
            /* 宽度原本想设置成撑满容器的100%,但是在手机上过窄图片转为宽图片会发生图片位移,所以还是改成95vw */
            max-width: 95vw;
            border-radius: 10px;
            transition: transform 0.5s ease;
            /* transform: scale(1); */
        }

        .image-overlay #overlayimage-container #overlay-image.zoomOut {
            animation: zoomOut 0.5s ease forwards;
            /* 应用缩小效果 */
        }

        .image-overlay #overlayimage-container #overlay-image.zoomIn {
            animation: zoomIn 0.5s ease forwards, fadeIn 0.3s ease forwards;
        }

        .image-overlay #overlayimage-container #overlay-infosvg {
            width: 7%;
            position: absolute;
            top: 7px;
            left: 7px;
            cursor: pointer;
            z-index: 1;
        }

        .image-overlay #overlayimage-container #overlay-infosvg.fadeIn {
            animation: fadeIn 0.5s ease forwards;
        }

        .image-overlay #overlayimage-container #overlay-infosvg.fadeOut {
            animation: fadeOut 0.5s ease forwards;
        }

        @keyframes overlayFadeInOut {
            0% {
                opacity: 1
            }

            50% {
                opacity: 0
            }

            100% {
                opacity: 1
            }
        }

        .image-overlay #overlayimage-container #overlay-infosvg.overlayFadeInOut {
            animation: overlayFadeInOut 0.75s ease forwards;
        }



        @keyframes nextPhotoChange {
            0% {
                opacity: 1;
                transform: scale(1);
            }

            50% {
                opacity: 0;
                transform: scale(0.3) translateY(-300px);
            }

            100% {
                opacity: 1;
                transform: scale(1) translateY(0px);
            }
        }

        @keyframes prevPhotoChange {
            0% {
                opacity: 1;
                transform: scale(1);
            }

            50% {
                opacity: 0;
                transform: scale(0.3) translateY(300px);
            }

            100% {
                opacity: 1;
                transform: scale(1) translateY(0px);
            }
        }


        .nextPhotoChange {
            animation: nextPhotoChange 0.75s ease-in-out forwards;
        }

        .prevPhotoChange {
            animation: prevPhotoChange 0.75s ease-in-out forwards;
        }

        @keyframes colorChange {
            0% {
                background-color: rgb(110, 114, 114, 0.5);
            }

            /* 初始颜色 */
            50% {
                background-color: rgba(184, 188, 188, 0.8);
            }

            /* 中间颜色 */
            100% {
                background-color: rgb(110, 114, 114, 0.5);
            }

            /* 回到初始颜色 */
        }

        .colorChange {
            animation: colorChange 0.5s forwards;
        }


        #overlay-id {
            position: absolute;
            max-width: 80%;
            bottom: 30px;
            z-index: 1;
            cursor: pointer;

            margin-top: 10px;
            margin-bottom: 10px;
            padding: 10px;

            color: #fff;
            font-size: 15px;
            font-family: siyuanmid;

            border-radius: 10px;
            border: 1px solid rgba(198, 202, 202, 0.5);
            background: rgb(110, 114, 114, 0.5);

            transition: 0.5s;

        }


        .fadeIn {
            animation: fadeIn 0.5s ease forwards;
        }

        .fadeOut {
            animation: fadeOut 0.5s ease forwards;
        }





        /* overlay图标点击显示图片信息*/

        /* 显示图片信息文字部分处理 */
        #overlay-info p {
            margin-top: 0;
        }

        #overlay-info {
            color: #fff;
            font-size: 15px;
            font-family: siyuanmid;
            line-height: 1.4;
            border-radius: 10px;
            border: 1px;
            -webkit-backdrop-filter: blur(10px);
            background: rgb(110, 114, 114, 0.5);
            z-index: 2000;

            display: flex;
            align-items: center;
            text-align: left;
            flex-direction: column;

            word-wrap: break-word;
            word-break: break-all;
            overflow: auto;

            padding: 10px;
            position: absolute;

            /* top的数值是100%-（图片容器缩放的一半加上平移的距离）再加上一点点，对应的height是100%-top */
            top: 72%;
            /* 固定宽高度，实现抽卡样式,，但是无法适配不同的设备，可能要用script计算才能实现 */
            height: 35%;
            width: 80%;

            transform: translateY(100px) scale(0);
            transition: 0.5s ease;
        }

        /* @keyframes bottomSlideIn{
        0%{transform:  translateY(100px) scale(0);}
        100%{transform: translateY(0) scale(1);}
    }
    .bottomSlideIn{
        animation: bottomSlideIn 0.5s ease
    }

    @keyframes bottomSlideOut{
        0%{transform: translateY(0) scale(1);}
        100%{transform:  translateY(100px) scale(0);}
        
    }
    .bottomSlideOut{
        animation: bottomSlideOut 0.5s ease
    } */

        .show-text#overlay-info {

            transform: translateY(0) scale(1);
            transition: 0.5s ease;
            /* opacity:1;
        transform: translateY(0) scale(1); */
            /* 和原始状态的transition同理修改 */

        }

        /* 显示图片信息图片部分处理 */
        /* 这个才是解决缩放冲突的关键，container缩放而不是图片缩放，这样就不会和infosvg触发的图片缩放冲突了 */
        #overlayimage-container.show-text {
            transform: translateY(-15%) scale(0.7);
            transition: transform 0.5s ease;
        }


        .show-fulltext#overlay-info {
            /* 固定宽高度 */
            padding: 2.5vw;
            /* 100-padding x 2 - 和屏幕边缘的距离, padding是包括在宽高度里面，同时要和屏幕边缘保持距离 */
            width: 92vw;
            /* 就是要溢出屏幕，形成抽卡样式 */
            height: 110vh;
            top: 2vh;
            transform: translateY(0);
            transition: 0.5s ease;
        }

        @keyframes overlaySlideChange {
            0% {
                opacity: 1;
                transform: translateY(0);
            }

            50% {
                opacity: 0;
                transform: translateY(50px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .overlaySlideChange {
            animation: overlaySlideChange 0.75s forwards;
        }


        .grid-item #infosvg {
            width: 10%;
            position: absolute;
            top: 3px;
            left: 3px;
            z-index: 1;
            cursor: pointer;
        }


        /* 单个图标点击显示图片信息 */
        .info-overlay p {
            margin-top: 0;
        }

        .info-overlay {
            line-height: 1.4;
            -webkit-backdrop-filter: blur(10px);
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            color: #fff;
            font-size: 15px;
            font-family: siyuanmid;

            position: fixed;
            top: 0;
            left: 0;

            display: none;
            justify-content: center;
            align-items: center;
            text-align: left;
            flex-direction: column;
            overflow: auto;
            word-wrap: break-word;
            word-break: break-all;
            animation: fadeIn 0.5s ease forwards;

            height: 100%;
            width: 95vw;
            padding: 2.5vw;
        }

        .info-overlay.active {
            display: flex;
        }

        .info-overlay.fadeOut {
            animation: fadeOut 0.5s ease forwards;
        }
    </style>
</head>

<body>
    <div class="grid-container">

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/31b7a3eaf3e3dbe5049dbb4bf04d90c7066a7be4097ed8750993818d980fe96c.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img1">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97357344</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Ultra-fine 2.5D anime style, vibrant and high-contrast colors, oil-paint texture with a stacked, impasto feel in large color blocks of buildings and the frog, visible brushstroke marks, slight brushstroke texture in the sky. In the center of a sunlit city street stands a massive, bulky frog with blue-orange skin and a mechanical prosthetic limb. In front of the frog is the heroine (2.5D anime style, determined expression, simple attire). The giant frog breathes slowly, its mechanical joints shifting slightly. Tiny dust particles float in the sunlight. The colors are rich and layered, with a mix of palette knife and brush techniques. The camera slowly tilts up from behind the heroine's shoulder, revealing the frog's immense size. Smooth, high-quality imagery.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525386568
<br>
GenerateType:65
<br><br>
97357344
</div>
 <div class="topRightInfo">1</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/c3de35bf14f70f06f3c25867bef81345f0680c1ebff093a8c2af812e8148e002.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img2">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97354328</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>超精细的2.5D动漫风格,鲜艳明亮高对比度的色彩,油画涂质感,建筑和青蛙的大中色块区域颜料堆叠感,明显的笔触痕迹,天空略微有笔触痕迹,阳光明媚的城市街道中央,站着一只皮肤呈蓝橙色,带有机械义肢的巨型笨重青蛙,青蛙前方站着一位女主角(2.5D动漫风格,表情坚定,衣着简洁,),巨蛙缓慢地呼吸着,机械关节微微移动,阳光中漂浮着细小的尘埃颗粒,色彩浓郁且富有层次感,刮刀与画笔混合使用,镜头从女主角的肩后缓慢向上倾斜,展现出青蛙的巨大体型,流畅,高品质的画面,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:525382510
<br>
GenerateType:65
<br><br>
97354328
</div>
 <div class="topRightInfo">2</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9a0e36534b92617443fcc6dcd076201b6371d7321f1ef45c5f18da51c751f300.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img3">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97354101</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>超精细的2.5D动漫风格,鲜艳明亮高对比度的色彩,油画涂质感,建筑和青蛙的大中色块区域颜料堆叠感,明显的笔触痕迹,天空略微有笔触痕迹,阳光明媚的城市街道中央,站着一只皮肤呈蓝橙色,带有机械义肢的巨型笨重青蛙,青蛙前方站着一位女主角(2.5D动漫风格,表情坚定,衣着简洁,),巨蛙缓慢地呼吸着,机械关节微微移动,阳光中漂浮着细小的尘埃颗粒,色彩浓郁且富有层次感,刮刀与画笔混合使用,镜头从女主角的肩后缓慢向上倾斜,展现出青蛙的巨大体型,流畅,高品质的画面,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525382168
<br>
GenerateType:65
<br><br>
97354101
</div>
 <div class="topRightInfo">3</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/ba6423a8eb167a9bab063fad4892cd5da4011cce4d3fcd520754279df4cc3d18.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img4">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97353937</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>超精细的2.5D动漫风格,鲜艳明亮高对比度的色彩,油画涂质感,建筑和青蛙的大中色块区域颜料堆叠感,明显的笔触痕迹,天空略微有笔触痕迹,阳光明媚的城市街道中央,站着一只皮肤呈蓝橙色,带有机械义肢的巨型笨重青蛙,青蛙前方站着一位女主角(2.5D动漫风格,表情坚定,衣着简洁,),巨蛙缓慢地呼吸着,机械关节微微移动,阳光中漂浮着细小的尘埃颗粒,色彩浓郁且富有层次感,刮刀与画笔混合使用,镜头从女主角的肩后缓慢向上倾斜,展现出青蛙的巨大体型,流畅,高品质的画面,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525381920
<br>
GenerateType:65
<br><br>
97353937
</div>
 <div class="topRightInfo">4</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/fb312c0d8ca1fe28d6263768fae6f7f0e011f6f54485ca87d3c642e7c933df8b.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img5">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97344101</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>一位身着华丽汉服的女子,背景是古典中式庭院,
人物与服饰
•她身穿一套橙红色系的传统汉服,外披一件宽大的广袖襦衣,衣料上布满精美的花卉纹样,以金色,黄色,蓝色等色彩织就,显得富丽堂皇•领
口和衣襟处有深红色的镶边装饰,上面绣有繁复的卷草纹•内搭浅
色底,金色花纹的抹胸或中衣•下着红色长
裙,整体配色华贵大气发型与妆饰•梳着
高髻,发间
点缀金色花钿发饰,两侧有流苏步摇垂落,缀满珠玉•额间贴有红色花钿•
耳戴坠饰,妆容精致,唇
色朱红背景环境•左侧有盛开的粉色桃
花/樱花
枝桠,春意盎然•后方可见中式古建筑的飞檐,红柱
与白栏杆,隐约有一池碧水•整体氛围明媚清雅,充满古典诗意整幅
画面色彩浓艳而不失雅致,人物端庄温婉
,呈现出一种盛唐或宫廷贵族的华美气象</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525368492
<br>
GenerateType:65
<br><br>
97344101
</div>
 <div class="topRightInfo">5</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4784efadf6067a7744e2733f14ea71e8826c3afa7d60a376896ff5bc2b862765.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img6">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97322119</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位年轻女子在户外水边的场景,
人物
	•	女子穿着一袭浅绿色无袖旗袍式连衣裙,裙身有淡雅的植物印花图案,领口处还垂落着飘逸的丝带
	•	头发梳成双侧发髻,并用白色花朵发饰点缀,搭配两条垂落的麻花辫,造型清新雅致
	•	她坐在岩石上,身体微微侧倾,一只手撑在身后的石头上,另一只手自然放在腿边,姿态闲适
环境
	•	背景是一汪清澈碧绿的水域,水面下可见石块,呈现出自然的溪流或潭水景观
	•	女子身下是布满青苔和落叶的灰色岩石,显得原生态且富有自然野趣
整体氛围 画面色调清新淡雅,绿衣,碧水,灰石相互映衬,传递出一种温婉恬静,古典自然的东方美学意境,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525337521
<br>
GenerateType:65
<br><br>
97322119
</div>
 <div class="topRightInfo">6</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/5d0293dcb6856bbbbbfcbe0b8f3d21e460543ef5d824d1ebea6795bf49d543ab.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img7">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97322118</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位年轻女子在户外水边的场景,
人物
	•	女子穿着一袭浅绿色无袖旗袍式连衣裙,裙身有淡雅的植物印花图案,领口处还垂落着飘逸的丝带
	•	头发梳成双侧发髻,并用白色花朵发饰点缀,搭配两条垂落的麻花辫,造型清新雅致
	•	她坐在岩石上,身体微微侧倾,一只手撑在身后的石头上,另一只手自然放在腿边,姿态闲适
环境
	•	背景是一汪清澈碧绿的水域,水面下可见石块,呈现出自然的溪流或潭水景观
	•	女子身下是布满青苔和落叶的灰色岩石,显得原生态且富有自然野趣
整体氛围 画面色调清新淡雅,绿衣,碧水,灰石相互映衬,传递出一种温婉恬静,古典自然的东方美学意境,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525337521
<br>
GenerateType:65
<br><br>
97322118
</div>
 <div class="topRightInfo">7</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/b716a6fe8211e7b4856960bd91f6b6bd9943b680c2e497ba25f0edf9c9c038c2.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img8">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">97322116</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位年轻女子在户外水边的场景,
人物
	•	女子穿着一袭浅绿色无袖旗袍式连衣裙,裙身有淡雅的植物印花图案,领口处还垂落着飘逸的丝带
	•	头发梳成双侧发髻,并用白色花朵发饰点缀,搭配两条垂落的麻花辫,造型清新雅致
	•	她坐在岩石上,身体微微侧倾,一只手撑在身后的石头上,另一只手自然放在腿边,姿态闲适
环境
	•	背景是一汪清澈碧绿的水域,水面下可见石块,呈现出自然的溪流或潭水景观
	•	女子身下是布满青苔和落叶的灰色岩石,显得原生态且富有自然野趣
整体氛围 画面色调清新淡雅,绿衣,碧水,灰石相互映衬,传递出一种温婉恬静,古典自然的东方美学意境,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:525337521
<br>
GenerateType:65
<br><br>
97322116
</div>
 <div class="topRightInfo">8</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4544e4fc87e9bbb1c9c7fe6d608818e967d0338ebb048575cc8bb75fc77ec5d0.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img9">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">96881051</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>(masterpiece, 8k, high resolution, ultra-detailed, cinematic lighting, dynamic low-angle perspective) 
(a frustrated male programmer with tousled hair, wide exasperated eyes, steam puffing from ears, gripping his head in comedic despair, slumped at a cluttered desk) + (a stunningly beautiful woman with soft delicate features, warm empathetic eyes, gentle reassuring smile, long flowing dark hair, wearing sleek black silk blouse, high-waisted pencil skirt, sheer black stockings, silver microchip choker, fingerless gloves with glowing circuit patterns, placing comforting hand on programmer's shoulder) 
(dimly lit cyberpunk office, neon blue and deep purple ambient tones, warm orange brass desk lamps, volumetric lighting, chaotic workspace with glowing RGB screens showing "404 Logic Not Found" and "Syntax Error: Emotions Not Supported", tangled cables, scattered coffee mugs, overturned drinks, crumpled algorithm papers, colorful sticky notes, mechanical keyboard, "CodeFuel" can, half-eaten sandwich, programming manuals titled "Why AI Hates You") 
(modern digital illustration style, bold expressive outlines, vibrant saturated colors, dynamic linework, webcomic and indie game art aesthetic, humorous tension, emotional resonance, visual storytelling)</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:2304x1728
<br>
GenerateId:524700275
<br>
GenerateType:65
<br><br>
96881051
</div>
 <div class="topRightInfo">9</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9a581bf87b22977540f9d18bf4989837e159bbdbd7257b52622f8a55e0ba2645.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img10">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">96881050</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>(masterpiece, 8k, high resolution, ultra-detailed, cinematic lighting, dynamic low-angle perspective) 
(a frustrated male programmer with tousled hair, wide exasperated eyes, steam puffing from ears, gripping his head in comedic despair, slumped at a cluttered desk) + (a stunningly beautiful woman with soft delicate features, warm empathetic eyes, gentle reassuring smile, long flowing dark hair, wearing sleek black silk blouse, high-waisted pencil skirt, sheer black stockings, silver microchip choker, fingerless gloves with glowing circuit patterns, placing comforting hand on programmer's shoulder) 
(dimly lit cyberpunk office, neon blue and deep purple ambient tones, warm orange brass desk lamps, volumetric lighting, chaotic workspace with glowing RGB screens showing "404 Logic Not Found" and "Syntax Error: Emotions Not Supported", tangled cables, scattered coffee mugs, overturned drinks, crumpled algorithm papers, colorful sticky notes, mechanical keyboard, "CodeFuel" can, half-eaten sandwich, programming manuals titled "Why AI Hates You") 
(modern digital illustration style, bold expressive outlines, vibrant saturated colors, dynamic linework, webcomic and indie game art aesthetic, humorous tension, emotional resonance, visual storytelling)</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:2304x1728
<br>
GenerateId:524700275
<br>
GenerateType:65
<br><br>
96881050
</div>
 <div class="topRightInfo">10</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/fdb6ef1003cf03f354cea2d9ba0eb439da2b8712968442541986e5db5bc8d692.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img11">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">96881049</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>(masterpiece, 8k, high resolution, ultra-detailed, cinematic lighting, dynamic low-angle perspective) 
(a frustrated male programmer with tousled hair, wide exasperated eyes, steam puffing from ears, gripping his head in comedic despair, slumped at a cluttered desk) + (a stunningly beautiful woman with soft delicate features, warm empathetic eyes, gentle reassuring smile, long flowing dark hair, wearing sleek black silk blouse, high-waisted pencil skirt, sheer black stockings, silver microchip choker, fingerless gloves with glowing circuit patterns, placing comforting hand on programmer's shoulder) 
(dimly lit cyberpunk office, neon blue and deep purple ambient tones, warm orange brass desk lamps, volumetric lighting, chaotic workspace with glowing RGB screens showing "404 Logic Not Found" and "Syntax Error: Emotions Not Supported", tangled cables, scattered coffee mugs, overturned drinks, crumpled algorithm papers, colorful sticky notes, mechanical keyboard, "CodeFuel" can, half-eaten sandwich, programming manuals titled "Why AI Hates You") 
(modern digital illustration style, bold expressive outlines, vibrant saturated colors, dynamic linework, webcomic and indie game art aesthetic, humorous tension, emotional resonance, visual storytelling)</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:2304x1728
<br>
GenerateId:524700275
<br>
GenerateType:65
<br><br>
96881049
</div>
 <div class="topRightInfo">11</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/cab7aa577d98b5f4635aa0c912870e546c9d2ac4c83fc662fd7844a0a9afc4b2.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img12">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">95556554</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>画图 A young girl wearing casual denim cut-off shorts, standing in a sunny outdoor setting, with a playful expression, her hair flowing in a gentle breeze, surrounded by colorful wildflowers, the background featuring a clear blue sky with fluffy white clouds, soft natural lighting, detailed textures on the shorts and skin, realistic proportions, vibrant yet harmonious colors, summer ambiance, artistic yet photorealistic style.,qingshu,a young woman with long,wavy black hair cascading over her shoulders,looking at the viewer,she has fair skin and a slender physique,she is wearing a long,off-the-shoulder,blue lace dress that accentuates her ample breasts and curves,the dress has long sleeves and a v-neckline,and she is accessorized with a gold hoop earring and a small gold necklace,her nails are painted a bright red,she sits on a modern,orange leather bench with a sleek metal frame,the background consists of large,sheer curtains allowing soft,diffused light to filter through,creating a serene and intimate atmosphere,the floor is made of light-colored wood,and the overall ambiance is modern and minimalistic,with a focus on the subject's delicate features and the luxurious setting,the photograph captures a moment of quiet contemplation,emphasizing the beauty and elegance of her attire,O,ultra detailed anime texture,1girl, solo, smile, double bun, blue eyes, hair bun, puffy long sleeves, closed mouth, blue hair, long hair, puffy sleeves, long sleeves, very long hair, bangs, outdoors, autumn leaves, looking at viewer, hand up, tree, day, bow, hairband, blush, pink jacket, jacket, floral print, dress, open clothes, leaf, open jacket, red hairband, red bow,(aesthetics ),masterpiece,best quality,ultra high definition,32K resolution,clear focus,delicate details,high-end texture,fashion photography,film perspective,rich colors,color palette,advertising style,tension composition,masterpiece,mild atmosphere,latest,dynamic Dutch perspective,transparent composition,magazine cover,cover,(masterpiece:1.3), (high resolution:1.2), (8k:1.1), (ultra-detailed:1.2), 
(young girl:1.2), (wearing black pantyhose:1.3), (standing:1.1), (elegant pose:1.2), (expressive eyes:1.1), (soft smile:1.1), (natural makeup:1.1), 
(modern apartment interior:1.2), (soft ambient lighting:1.2), (neutral color tones:1.1), (clean and minimalistic background:1.2), (reflective surfaces:1.1), (subtle shadows:1.1) 9:16</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:522819804
<br>
GenerateType:65
<br><br>
95556554
</div>
 <div class="topRightInfo">12</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/bdf736b5e67681249fb612698972fed7b5355530f6a755c27b6dfd76668b1cc7.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img13">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">95549617</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>A young girl wearing casual denim cut-off shorts, standing in a sunny outdoor setting, with a playful expression, her hair flowing in a gentle breeze, surrounded by colorful wildflowers, the background featuring a clear blue sky with fluffy white clouds, soft natural lighting, detailed textures on the shorts and skin, realistic proportions, vibrant yet harmonious colors, summer ambiance, artistic yet photorealistic style.,qingshu,a young woman with long,wavy black hair cascading over her shoulders,looking at the viewer,she has fair skin and a slender physique,she is wearing a long,off-the-shoulder,blue lace dress that accentuates her ample breasts and curves,the dress has long sleeves and a v-neckline,and she is accessorized with a gold hoop earring and a small gold necklace,her nails are painted a bright red,she sits on a modern,orange leather bench with a sleek metal frame,the background consists of large,sheer curtains allowing soft,diffused light to filter through,creating a serene and intimate atmosphere,the floor is made of light-colored wood,and the overall ambiance is modern and minimalistic,with a focus on the subject's delicate features and the luxurious setting,the photograph captures a moment of quiet contemplation,emphasizing the beauty and elegance of her attire,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:522810046
<br>
GenerateType:65
<br><br>
95549617
</div>
 <div class="topRightInfo">13</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4010f4dafaeb3f6e63a6cb9a0a4bb4dcf7e5403fb5bc9feeaf057c95a4817c7e.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img14">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92657312</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅精美的动漫风格插画,描绘了一位站在开阔山野中的女性,
人物 画面中央是一位年轻女性,侧身站立,面向左侧,她有着浅色的短发,发丝在风中飘动,她身穿一袭深色(黑色或深蓝色)的长裙,搭配浅色衬衫和深色腰带,脚蹬深色靴子,整体风格带有复古或维多利亚时代的优雅气质,她头戴一顶深色宽檐帽,左手扶在帽檐上,似乎在遮挡风或阳光,右手插在腰间,姿态自信而从容,
背景 背景是一片辽阔的秋日山野风光,远处层峦叠嶂的山脉在蓝天下延展,天空中飘着蓬松的白云,蓝天用富有笔触感的画法呈现,充满动感,中景和近景是金黄色的草地与田野,点缀着橙红色的树木,典型的秋季色调,地面有几块岩石,她站在一处略高的地势上,衣摆和披风在风中扬起,增强了画面的动态感,
整体氛围 整幅画采用类似油画的笔触风格,色彩明亮而温暖,蓝天与金黄大地形成鲜明对比,画面传递出一种自由,洒脱又略带忧郁的浪漫气息,仿佛是一位旅人在秋日的高岗上眺望远方,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518771862
<br>
GenerateType:65
<br><br>
92657312
</div>
 <div class="topRightInfo">14</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4fd09bc89e6fc1947601d2b0503b909afa0f1e737fa9f8c3ee3551ddefa6e98f.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img15">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92657223</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片描绘了一位女巫坐在石阶上的场景,整体氛围神秘而浪漫,
人物主体
•一位金发女巫,短发发尾 彩色渐变•戴
着宽大的黑色巫师帽,帽檐有些破损,帽子上装饰着红玫瑰,冬青叶,月亮挂饰和皮带扣•身穿黑
白配色的哥特洛丽塔风格服装:白色蕾丝衬衫,黑色背心,黑色蕾丝长裙•搭配黑色高
跟系带短靴•腰间系着宽皮带
,挂着棕色小包•她单手托腮,姿态慵
懒而优雅环境与氛围•背景是巨大的
哥特式拱形
窗户,窗外夜空挂着弯月,满月的光芒洒入,几只蝙蝠和飞鸟掠过•窗外可见枯树枝,呈现出黄昏
到夜晚过渡时分的紫蓝色天空•石墙由深灰色砖块砌成,左侧壁灯
和台阶上的蜡烛提供暖黄色光源•右侧有一盏点亮的黑色提灯,火光摇曳
细节元素•台阶底部有一只灰白相间的猫正在
打盹,戴
着红色项圈和铃铛•散落的玫瑰花瓣增添了一丝浪漫气息•冷暖色调
的对比(暖黄烛光vs冷蓝夜色)营造出梦
幻的视觉效果整体画面融合了哥特 ,奇 幻与少女风格,细节丰富,光影细
腻,充满童话般的故事感,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:518771674
<br>
GenerateType:65
<br><br>
92657223
</div>
 <div class="topRightInfo">15</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9eaf001959048c2eca3b25a21cea0da04472c8a49f7e39975933157fb3013d01.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img16">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92657195</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片描绘了一位女巫坐在石阶上的场景,整体氛围神秘而浪漫,
人物主体
•一位金发女巫,短发发尾 彩色渐变•戴
着宽大的黑色巫师帽,帽檐有些破损,帽子上装饰着红玫瑰,冬青叶,月亮挂饰和皮带扣•身穿黑
白配色的哥特洛丽塔风格服装:白色蕾丝衬衫,黑色背心,黑色蕾丝长裙•搭配黑色高
跟系带短靴•腰间系着宽皮带
,挂着棕色小包•她单手托腮,姿态慵
懒而优雅环境与氛围•背景是巨大的
哥特式拱形
窗户,窗外夜空挂着弯月,满月的光芒洒入,几只蝙蝠和飞鸟掠过•窗外可见枯树枝,呈现出黄昏
到夜晚过渡时分的紫蓝色天空•石墙由深灰色砖块砌成,左侧壁灯
和台阶上的蜡烛提供暖黄色光源•右侧有一盏点亮的黑色提灯,火光摇曳
细节元素•台阶底部有一只灰白相间的猫正在
打盹,戴
着红色项圈和铃铛•散落的玫瑰花瓣增添了一丝浪漫气息•冷暖色调
的对比(暖黄烛光vs冷蓝夜色)营造出梦
幻的视觉效果整体画面融合了哥特 ,奇 幻与少女风格,细节丰富,光影细
腻,充满童话般的故事感,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518771597
<br>
GenerateType:65
<br><br>
92657195
</div>
 <div class="topRightInfo">16</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/79e9009907ad30621530dd1687f14b30af7dcc0cd51adb7013e9d341e8d7edbb.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img17">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92656923</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅插画,描绘了一位少女骑着复古摩托车的场景:
主体人物
	•	少女:棕色短发,头戴飞行员护目镜,身穿白色泡泡袖衬衫,蓝色背心,浅绿色短裙,脚蹬棕色短靴配浅蓝袜子
	•	她正侧身回头望,姿态充满动感,仿佛即将出发或刚刚停下
交通工具
	•	蓝白配色的复古小型摩托车(类似本田Super Cub风格)
	•	车身细节丰富:黄色轮毂,红色尾灯,各种贴纸和铭牌,略显做旧的质感
	•	后座绑着大型棕色帆布包,侧面还挂着卷起来的毯子或睡袋,透露出旅行/冒险的气息
环境与氛围
	•	晴朗蓝天点缀着蓬松的白云
	•	脚下是青翠的草地,草叶随风轻摆
	•	整体色调明亮清新,充满夏日,自由与探索的浪漫情怀
风格特点
	•	典型的宫崎骏/吉卜力动画美学:手绘质感,柔和光影,对机械与自然的细腻刻画
	•	画面传递出一种怀旧,治愈又充满冒险精神的情绪,仿佛下一秒就要踏上未知的旅程
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:518771195
<br>
GenerateType:65
<br><br>
92656923
</div>
 <div class="topRightInfo">17</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/62947a59b0d45b2e849dd89f2e9a9eae68a9fae8822ee825f9b0764c7d5e4270.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img18">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92656889</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅吉卜力风格的插画,描绘了一位少女骑着复古摩托车的场景:
主体人物
	•	少女:棕色短发,头戴飞行员护目镜,身穿白色泡泡袖衬衫,蓝色背心,浅绿色短裙,脚蹬棕色短靴配浅蓝袜子
	•	她正侧身回头望,姿态充满动感,仿佛即将出发或刚刚停下
交通工具
	•	蓝白配色的复古小型摩托车(类似本田Super Cub风格)
	•	车身细节丰富:黄色轮毂,红色尾灯,各种贴纸和铭牌,略显做旧的质感
	•	后座绑着大型棕色帆布包,侧面还挂着卷起来的毯子或睡袋,透露出旅行/冒险的气息
环境与氛围
	•	晴朗蓝天点缀着蓬松的白云
	•	脚下是青翠的草地,草叶随风轻摆
	•	整体色调明亮清新,充满夏日,自由与探索的浪漫情怀
风格特点
	•	典型的宫崎骏/吉卜力动画美学:手绘质感,柔和光影,对机械与自然的细腻刻画
	•	画面传递出一种怀旧,治愈又充满冒险精神的情绪,仿佛下一秒就要踏上未知的旅程
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:518771122
<br>
GenerateType:65
<br><br>
92656889
</div>
 <div class="topRightInfo">18</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/8853cd8f6256d74f4f40f494370321061ea1fffba29389fede992cd7a789bcca.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img19">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92656839</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅吉卜力风格的插画,描绘了一位少女骑着复古摩托车的场景:
主体人物
	•	少女:棕色短发,头戴飞行员护目镜,身穿白色泡泡袖衬衫,蓝色背心,浅绿色短裙,脚蹬棕色短靴配浅蓝袜子
	•	她正侧身回头望,姿态充满动感,仿佛即将出发或刚刚停下
交通工具
	•	蓝白配色的复古小型摩托车(类似本田Super Cub风格)
	•	车身细节丰富:黄色轮毂,红色尾灯,各种贴纸和铭牌,略显做旧的质感
	•	后座绑着大型棕色帆布包,侧面还挂着卷起来的毯子或睡袋,透露出旅行/冒险的气息
环境与氛围
	•	晴朗蓝天点缀着蓬松的白云
	•	脚下是青翠的草地,草叶随风轻摆
	•	整体色调明亮清新,充满夏日,自由与探索的浪漫情怀
风格特点
	•	典型的宫崎骏/吉卜力动画美学:手绘质感,柔和光影,对机械与自然的细腻刻画
	•	画面传递出一种怀旧,治愈又充满冒险精神的情绪,仿佛下一秒就要踏上未知的旅程
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518771057
<br>
GenerateType:65
<br><br>
92656839
</div>
 <div class="topRightInfo">19</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/19cd0df70513cead3e50bea91efda3b7c9730cafe411335e23a4578b041ae385.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img20">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92656813</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅吉卜力风格的插画,描绘了一位少女骑着复古摩托车的场景:
主体人物
	•	少女:棕色短发,头戴飞行员护目镜,身穿白色泡泡袖衬衫,蓝色背心,浅绿色短裙,脚蹬棕色短靴配浅蓝袜子
	•	她正侧身回头望,姿态充满动感,仿佛即将出发或刚刚停下
交通工具
	•	蓝白配色的复古小型摩托车(类似本田Super Cub风格)
	•	车身细节丰富:黄色轮毂,红色尾灯,各种贴纸和铭牌,略显做旧的质感
	•	后座绑着大型棕色帆布包,侧面还挂着卷起来的毯子或睡袋,透露出旅行/冒险的气息
环境与氛围
	•	晴朗蓝天点缀着蓬松的白云
	•	脚下是青翠的草地,草叶随风轻摆
	•	整体色调明亮清新,充满夏日,自由与探索的浪漫情怀
风格特点
	•	典型的宫崎骏/吉卜力动画美学:手绘质感,柔和光影,对机械与自然的细腻刻画
	•	画面传递出一种怀旧,治愈又充满冒险精神的情绪,仿佛下一秒就要踏上未知的旅程
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518771007
<br>
GenerateType:65
<br><br>
92656813
</div>
 <div class="topRightInfo">20</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/f3d6519e7e878d71ebc5624e4c0c0bf576acfa803c59f2ed778e5a12251e0a76.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img21">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92537710</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>身材高挑,妆容精致的少女,她穿着黑色露肩荷叶边连衣裙,裙摆处有粉色装饰和珍珠链点缀,戴着长款天鹅绒黑色手套,珍珠项链及耳饰,头上佩戴着一个粉色的大蝴蝶结,穿着黑色高跟鞋,手中拿着一把黑色折扇</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1296x3024
<br>
GenerateId:518603592
<br>
GenerateType:65
<br><br>
92537710
</div>
 <div class="topRightInfo">21</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/c555cc42f12a215b76a426f8ff2002e1e6744d2a562511c3bbc92808699de08f.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img22">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92537160</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>身材高挑,妆容精致的少女,她穿着黑色露肩荷叶边连衣裙,裙摆处有粉色装饰和珍珠链点缀,戴着长款天鹅绒黑色手套,珍珠项链及耳饰,头上佩戴着一个粉色的大蝴蝶结,穿着黑色高跟鞋,手中拿着一把黑色折扇</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518602800
<br>
GenerateType:65
<br><br>
92537160
</div>
 <div class="topRightInfo">22</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/6d4b488a18cc9fb5613d4466ccbca3c924f4ca2993d55966c9e3fc44be0d26ea.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img23">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92165098</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是一幅低视角的室内场景插画,画面聚焦于一个人的双腿和一只猫:
主体元素
	•	人物:只能看到从大腿到脚的部分,穿着灰色短裤,白色袜子和棕红色高帮运动鞋,双腿分开站立,姿态像是正要迈步或刚停下
	•	猫:一只橘白相间的猫,背对着镜头,尾巴高高竖起,正从人物腿间穿过或走过
环境背景
	•	一个充满生活气息的工业风/复古风室内空间
	•	可见裸露的管道,书架(堆满书籍),沙发,绿植,书桌,挂钟等家具
	•	整体色调偏暖灰,米白,棕橘,光线柔和,像是阳光从窗外洒入
风格特点
	•	典型的日系动画/插画风格,线条细腻,色彩柔和
	•	低角度构图营造出一种日常,温馨又略带慵懒的氛围,仿佛捕捉到了人与宠物共处的一个平凡瞬间
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:5461x3072
<br>
GenerateId:518066412
<br>
GenerateType:65
<br><br>
92165098
</div>
 <div class="topRightInfo">23</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/3d904a2af933a8fcc35c95a9af9847d33249fc09d2a34e7ed91496cfd9d16ba8.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img24">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92164071</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一个充满活力的室内场景:
主体人物
	•	一位黑发扎成马尾的年轻女孩,正攀爬在金属楼梯的扶手上
	•	她穿着米白色宽松夹克(带有补丁装饰),红色内搭,灰色短裤和棕红色运动鞋
	•	姿态动感:一只手抓着扶手,另一只手向前伸展,一条腿踩在扶手上,身体前倾
猫咪
	•	一只橘白相间的猫坐在楼梯斜面上,背对着女孩,头部转向右侧,似乎在观察什么
场景环境
	•	室内空间,白色墙壁
	•	墙上挂有几幅画作/相框,包括抽象画和黑白照片
	•	右侧有一张白色桌子,桌上放着一个包
	•	整体色调柔和,以白色,米色为主,光线明亮
氛围 画面呈现出一种轻松俏皮的日常感,女孩似乎在追逐或逗弄猫咪,动作充满青春活力,阴影处理细腻,带有日式动画的清新画风,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:5461x3072
<br>
GenerateId:518064954
<br>
GenerateType:65
<br><br>
92164071
</div>
 <div class="topRightInfo">24</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/053471ec057660e23fa7dab483ba172c6bcd7ea8d2cf9dbabc23dfa17eeb4235.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img25">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92163740</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一个充满活力的室内场景:
主体人物
	•	一位黑发扎成马尾的年轻女孩,正攀爬在金属楼梯的扶手上
	•	她穿着米白色宽松夹克(带有补丁装饰),红色内搭,灰色短裤和棕红色运动鞋
	•	姿态动感:一只手抓着扶手,另一只手向前伸展,一条腿踩在扶手上,身体前倾
猫咪
	•	一只橘白相间的猫坐在楼梯斜面上,背对着女孩,头部转向右侧,似乎在观察什么
场景环境
	•	室内空间,白色墙壁
	•	墙上挂有几幅画作/相框,包括抽象画和黑白照片
	•	右侧有一张白色桌子,桌上放着一个包
	•	整体色调柔和,以白色,米色为主,光线明亮
氛围 画面呈现出一种轻松俏皮的日常感,女孩似乎在追逐或逗弄猫咪,动作充满青春活力,阴影处理细腻,带有日式动画的清新画风,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:5461x3072
<br>
GenerateId:518064501
<br>
GenerateType:65
<br><br>
92163740
</div>
 <div class="topRightInfo">25</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/2562c5856de1dad3cf3edeb1a41431777015a43c268bde8c647b0ee9d0d86fcd.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img26">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92163112</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位黑发双马尾的女孩和一只猫坐在床上的场景,整体风格是手绘插画,色调柔和偏暖,
人物
	•	女孩有着黑色的双马尾发型,蓝色大眼睛,表情略带慵懒或平静
	•	穿着宽松的米白色长袖上衣,衣服上有一些图案和补丁细节
	•	下身搭配短裤,脚穿棕色高帮运动鞋,鞋带松散
猫咪
	•	一只白橘相间的短毛猫,坐在女孩右侧
	•	圆脸,大眼睛,正看向画面左侧
环境与物品
	•	背景是一个充满生活气息的房间,床上堆着印有文字的抱枕
	•	周围摆放着许多机械感或工业风的小物件:蓝色和灰色的机械装置,工具,容器等
	•	左下角有一个金属杯子和蓝色盖子的容器
	•	右侧有盆栽植物,茶壶,书籍等杂物
	•	整体环境给人一种"机械宅"或创意工作间的感觉
风格特点
	•	线条带有手绘质感,色彩以米白,浅蓝,灰褐为主
	•	画面细节丰富,营造出温馨而略带杂乱的私人空间氛围
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:5461x3072
<br>
GenerateId:518063613
<br>
GenerateType:65
<br><br>
92163112
</div>
 <div class="topRightInfo">26</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/159a5c6261336e6a7999096ad1669cab013250b3a972e89adb0b6a70b7d3cd42.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img27">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92161695</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>打底裤(Leggings)

打底裤是一种贴身穿的紧身裤,通常用于穿搭或保暖 少女</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2683x6252
<br>
GenerateId:518061685
<br>
GenerateType:65
<br><br>
92161695
</div>
 <div class="topRightInfo">27</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/383c8f8c297ca910cc2b513ed87c0e45a81a6cdcb700cca418b4a34c1cfc5113.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img28">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">92161329</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>打底裤(Leggings)

打底裤是一种贴身穿的紧身裤,通常用于穿搭或保暖 少女</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:518061345
<br>
GenerateType:65
<br><br>
92161329
</div>
 <div class="topRightInfo">28</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/d25b9affd639e9a977f1d6ef36554700c78d76df156c8041aced5f02e121ce25.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img29">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">91829267</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位穿着华丽洛丽塔风格连衣裙的动漫少女,
人物特征:
	•	银白色长发,绿色眼眸,表情开朗活泼,嘴巴微张露出笑容
	•	头上佩戴着绿色丝带蝴蝶结和一个带有几何图案的发饰
服装细节:
	•	主色调为白色与绿色搭配
	•	白色露肩连衣裙,带有大量褶皱荷叶边装饰
	•	胸前,腰部,袖口多处点缀绿色蝴蝶结
	•	腰部有大号绿色缎带蝴蝶结作为视觉焦点
	•	白色泡泡袖,袖口有荷叶边和绿色丝带
鞋子:
	•	绿色漆皮玛丽珍鞋,搭配白色蕾丝袜和绿色蝴蝶结
整体风格:
	•	甜美可爱的偶像/魔法少女风格,色彩清新,细节繁复精致,姿态是伸出手的互动姿势,给人亲切热情的感觉,背景为纯黑色,突出人物形象,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1296x3024
<br>
GenerateId:517595325
<br>
GenerateType:65
<br><br>
91829267
</div>
 <div class="topRightInfo">29</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/c5aa53b7973e4b15cfdc972aca87a8e6f694eb7832be8af045f4d32dfd8cc51e.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img30">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">91829059</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位穿着华丽洛丽塔风格连衣裙的动漫少女,
人物特征:
	•	银白色长发,绿色眼眸,表情开朗活泼,嘴巴微张露出笑容
	•	头上佩戴着绿色丝带蝴蝶结和一个带有几何图案的发饰
服装细节:
	•	主色调为白色与绿色搭配
	•	白色露肩连衣裙,带有大量褶皱荷叶边装饰
	•	胸前,腰部,袖口多处点缀绿色蝴蝶结
	•	腰部有大号绿色缎带蝴蝶结作为视觉焦点
	•	白色泡泡袖,袖口有荷叶边和绿色丝带
鞋子:
	•	绿色漆皮玛丽珍鞋,搭配白色蕾丝袜和绿色蝴蝶结
整体风格:
	•	甜美可爱的偶像/魔法少女风格,色彩清新,细节繁复精致,姿态是伸出手的互动姿势,给人亲切热情的感觉,背景为纯黑色,突出人物形象,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:517595040
<br>
GenerateType:65
<br><br>
91829059
</div>
 <div class="topRightInfo">30</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/059c057c79260c89ef747866b8d7c3619d9b5adc0816e5067c4941117e9143f3.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img31">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">91825432</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这是一张动漫风格的立绘,描绘了一位身穿白色连衣裙的少女,
人物外貌:
	•	淡粉色/橙色的长卷发,发丝蓬松飘逸
	•	琥珀色的眼眸,表情温和略带微笑
	•	头上戴着橙色花朵形状的发饰,搭配丝带
服装细节:
	•	白色为主色调的洛丽塔风格连衣裙
	•	领口和袖口有橙色装饰与褶皱花边
	•	胸前系着橙色蝴蝶结
	•	腰部有大号白色蝴蝶结
	•	裙摆多层设计,带有橙色缎带镶边和星星点缀
	•	白色蕾丝袜/短袜配褶皱花边
	•	橙色玛丽珍鞋,带有交叉绑带
姿势与道具:
	•	左手自然伸展,右手持有一支笔(可能是钢笔或画笔)
	•	站姿优雅,裙摆微微扬起,呈现动态感
整体风格: 画面色调温暖柔和,以白,橙两色为主,风格精致细腻,带有典型的日式美少女游戏/插画特征,黑色背景使人物更加突出,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2683x6252
<br>
GenerateId:517589900
<br>
GenerateType:65
<br><br>
91825432
</div>
 <div class="topRightInfo">31</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/be10f57629b9d85a9908ac9cb86f6874499abf8370af6960b5f963b2aed831d2.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img32">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">91373035</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>复古科幻风格插画,蓝发女性角色,发丝在风中扬,佩戴带有橙黄色护目镜的黑色头饰,身着色彩斑斓的复古科幻服饰,背景是明亮的蓝天,画面色彩高饱和,细节丰富,具有 URI 壁纸插画的复古未来主义质感,风格又美又飒,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:516960427
<br>
GenerateType:65
<br><br>
91373035
</div>
 <div class="topRightInfo">32</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/142b850a443eeea0d03151177e44de0eb43b269fc34ddfb3ac13c9813c7f4209.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img33">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90434412</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位身着异域风格服饰的女性,整体造型带有浓厚的中东或阿拉伯风情,类似迪士尼公主茉莉的装扮风格,
服饰细节
	•	头饰:华丽的金色王冠,镶嵌蓝色宝石,搭配垂落的额饰和珍珠点缀的白色头纱,头纱边缘有金色亮片装饰
	•	发型:乌黑长发编成多条细辫,部分辫子掺有金色丝线
	•	耳饰:金色流苏耳环,造型精致
	•	上衣:浅蓝色抹胸式设计,露出肩颈和腰部,肩部有泡泡袖装饰
	•	下装:同色系的轻薄纱裙,腰部有金色镶宝石的腰封
	•	臂饰:多层金色手镯,镶嵌红,白,蓝等彩色宝石和珍珠
整体氛围
	•	背景为深色,人物从侧后方打光,形成逆光效果,头纱和发丝边缘有柔和的光晕
	•	整体色调以金色和浅蓝为主,华丽而梦幻
	•	风格偏向cosplay或艺术写真
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515609494
<br>
GenerateType:65
<br><br>
90434412
</div>
 <div class="topRightInfo">33</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/e6641a9fb77485e0618510228f9abac1c16f30ff5a2ce3f5e9480b33db940df1.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img34">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90433985</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>高饱和,高曝光,杰作,最佳质量,8K分辨率,真实3d渲染,素描线条,高对比色彩,浓墨重彩,超精细细节,日系写实风,URI DREAM LAB风格,
1个少女,浅棕色微卷长发,发丝飞扬,戴着黄色飞行员头盔+护目镜,橙色冲锋衣,
仰视角度,面部特写,清澈蓝天+白云背景,
真实皮肤纹理,细腻毛孔,通透光影,阳光侧逆光,眼神明亮有高光,
干净线稿,电影级构图,色彩明快,治愈氛围</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515608661
<br>
GenerateType:65
<br><br>
90433985
</div>
 <div class="topRightInfo">34</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/3064800b8f06f4c775bb73b955febad2a27008305f9fda4bdf89a561b9594d42.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img35">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90433306</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>人物全身像构图,美女,大长腿,肤如凝脂,写实风格,皮肤像真人质感,动漫风格五官微似BJD,精致的五官,冷白皮,浪漫主义,全身像,有着绝美面容,冰肌玉骨,空气刘海,发丝根根可见,西域公主,倾国倾城纯欲风,黑色长发编成多股麻花辫,空气刘海,金色镂空造型头饰配蓝色宝石,额链,华丽古风妆容,睫毛根根分明,眼尾处有珠光眼影晕染,唇部为哑光质地,抹胸裙+多层纱幔外衣十纱幔半身裙,头上有短款新疆风格头纱,佩戴多层金色项链和流苏耳环,眼神直视镜头,嘴唇自然闭合,分辦率高达32K,结合全画幅精密对焦技术,确保了每处细节都具备光学级精度,最终呈现出极致清晰的超高清壁纸质感,暖色调,轮廓光,发丝光</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515607964
<br>
GenerateType:65
<br><br>
90433306
</div>
 <div class="topRightInfo">35</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/a5e724976046fa3caa6e1c132a3685e2f3c31852b4a950ba414dd4ca471de5cf.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img36">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90432077</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片是 DeepSeek AI 的拟人化角色设定图,呈现为一位蓝白色调的"鲸鱼少女"形象,
核心视觉元素
角色主体
	•	一位长发及腰的少女,发色为深蓝渐变至浅蓝的波浪长发
	•	双眼被白色蕾丝眼罩遮住,面带羞涩红晕
	•	头上有鲸鱼鳍状的耳饰/发饰,点缀白色小花
	•	身后有一条蓝色鲸鱼尾巴从裙摆后延伸而出
服饰设计
	•	蓝白配色的洛丽塔风格连衣裙,大量蕾丝,蝴蝶结装饰
	•	露肩设计,袖口和裙摆有多层荷叶边
	•	大腿处有蕾丝腿环,同样系着蓝色蝴蝶结
	•	赤足站立,脚下有水渍效果
画面左侧信息栏
项目
内容
名称
DeepSeek(深度求索)
物种
鲸鱼少女 🐳
所属
DeepSeek AI
角色
探索者 / 智能助手
生日
2023.07.17
标语
"探索未知之深海,求索智能之极限"
配色方案:6种蓝紫色调(深海军蓝到淡粉白) 设计元素:鲸尾,DeepSeek Logo,蕾丝纹理,蝴蝶结
画面右侧文字
竖排台词:"我,我才不是让你看到这种样子,请,请不要笑我," 强化害羞,柔弱的人设气质,
整体风格
清新梦幻的水彩/日系插画风格,以"深海"与"探索"为核心意象,将 AI 产品包装为温柔,羞涩,略带神秘感的少女形象,是典型的品牌二次元拟人化(娘化)营销设计,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515605878
<br>
GenerateType:65
<br><br>
90432077
</div>
 <div class="topRightInfo">36</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9b9a5561e9a982497b9c3c6729f2493d5639eb4fd125b9b62b651fd56b0610b5.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img37">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90431899</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这是一张品牌的二次元拟人化形象插画,画面主体是一位动漫少女,整体采用品牌logo配色,充满品牌logo要素,画面左侧有品牌元素:

•品牌文字标识•对
话框写着"HI,I'M{ 品牌名 称},♡"背景 为简
洁的logo配色几何风格,点缀气泡,线条等装饰元素,左下角还有淡色的品牌logo轮廓,整体风格清新可爱,是典型的品牌娘化(拟人化)设计,这个品牌

是星巴克</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:3072x5461
<br>
GenerateId:515605544
<br>
GenerateType:65
<br><br>
90431899
</div>
 <div class="topRightInfo">37</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/46049f7db1b6f4bad1c27d72cc6021b670d61e136212617f4542491fda17afcd.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img38">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90431852</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>塔菲</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1664x2496
<br>
GenerateId:515499170
<br>
GenerateType:65
<br><br>
90431852
</div>
 <div class="topRightInfo">38</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/8153d5057105cf6c163f9503db44086c53bca78fae00d12ff701b2ec3a11cb9a.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img39">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90340591</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>换成真人风格</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515470301
<br>
GenerateType:65
<br><br>
90340591
</div>
 <div class="topRightInfo">39</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/fd9fd4f9d5941ceb8390be14ce8ae2d2934a2df3a8d474b97477df6b685565ef.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img40">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">90315428</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>去掉背景其他人物,把主体人物转换成真人风格</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:515433430
<br>
GenerateType:65
<br><br>
90315428
</div>
 <div class="topRightInfo">40</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/98981f265c03348e4cc84d6ca9749ce89330b7026b66e29d7613c3b4c5cdaf95.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img41">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88638128</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>请根据[主题:故宫记忆]自动生成一张高审美的"轮廓宇宙 / 收藏版叙事海报"风格作品,不要将画面局限于固定器物或常见容器,不要优先默认瓶子,沙漏,玻璃罩,怀表之类的常规载体,而是由 AI 根据主题自行判断并选择一个最契合,最有象征意义,轮廓最强,最适合承载完整叙事世界的主轮廓载体,这个主轮廓可以是器物,建筑,门,塔,拱门,穹顶,楼梯井,长廊,雕像,侧脸,眼睛,手掌,头骨,羽翼,面具,镜面,王座,圆环,裂缝,光幕,阴影,几何结构,空间切面,舞台框景,抽象符号或其他更有创意与主题代表性的视觉轮廓,要求合理布局,优先选择最能放大主题气质,最能形成强烈视觉记忆点,最能体现史诗感,神秘感,诗意感或设计感的轮廓,而不是最安全,最普通,最常见的容器,

画面的核心不是简单把世界装进某个物体里,而是让完整的主题世界自然生长在这个主轮廓之中,之内,之上,之边界里或与其结构融为一体,形成一种"主题宇宙依附于一个象征性轮廓展开"的高级叙事效果,主轮廓必须清晰,优雅,有辨识度,并在整体构图中占据核心地位,轮廓内部或边界中需要自动生成与主题强绑定的完整叙事世界,内容应当丰富,饱满,层次清晰,包括最能代表主题的标志性场景,核心建筑或空间结构,象征符号与隐喻元素,角色关系或文明痕迹,远景中景近景的空间递进,具有命运感和情绪张力的氛围层次,以及门,台阶,桥梁,水面,烟雾,路径,光源,遗迹,机械结构,自然景观,抽象形态,生物或道具等叙事细节,所有元素必须统一,自然,有主次,有层级地融合,像一个完整世界真实孕育在这个轮廓结构之中,而不是简单拼贴,裁切填充,素材堆叠或模板化背景,

整体构图需要具有强烈的收藏版海报气质与高级设计感,大结构稳定,主轮廓强烈明确,内部世界具有纵深,秩序和呼吸感,细节丰富但不拥挤,内容丰满但不杂乱,可以适度加入小比例人物剪影,远处建筑,光柱,门洞,桥,阶梯,回廊,倒影,天光或远景结构来增强尺度感,故事感与史诗感,整体画面要安静,宏大,凝练,富有余味,不要平均铺满,不要廉价热闹,不要无重点堆砌,

风格融合收藏版电影海报构图,高级叙事型视觉设计,梦幻水彩质感与纸张印刷品气质,强调纸张颗粒感,边缘飞白,水彩刷痕,轻微晕染,空气透视,柔和雾化,局部体积光,光雾穿透,大面积留白与克制版式,让画面看起来像设计师完成的高端收藏版视觉作品,而不是普通 AI 跑图,整体气质要高级,诗意,宏大,神圣,怀旧,安静,具有传说感和叙事感,

色彩由 AI 根据主题自动判断并匹配最合适的高级配色方案,但必须保持统一,克制,耐看,低饱和,高级,不要杂乱高饱和,不要廉价霓虹感,不要塑料数码感,配色可以围绕黑金灰,冷蓝灰,雾白灰,褐红米白,暗铜,旧纸色,深海蓝,暮色紫,银灰等体系自由变化,但必须始终服务主题,并保持海报级审美与整体和谐,

最终要求:第一眼有强烈的主题识别度和轮廓记忆点,第二眼有完整丰富的叙事世界,第三眼仍有细节和余味,轮廓选择必须具有创意和主题匹配度,尽量避免重复,保守,常见的容器套路,优先选择更有象征性,更有空间感,更有设计潜力的轮廓形式,不要普通背景拼接,不要生硬裁切,不要模板化奇幻素材,不要游戏宣传图感,不要过度卡通化,不要过度写实导致失去艺术感,不要形式大于内容,如果合适,可以自然加入低调克制的标题,编号,签名或落款,让它更像收藏版海报设计的一部分,但不要喧宾夺主,
 </span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513039634
<br>
GenerateType:65
<br><br>
88638128
</div>
 <div class="topRightInfo">41</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4f039d56b08f8219ff5eed3fb61e9bd1d37d20dcda6b88a0642ac53feba1303d.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img42">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88635707</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>A dramatic anime-style cyberpunk witch standing on a dark rooftop high above a dense futuristic city at night, viewed from a slightly elevated angle. The main subject is a petite young witch girl with pale skin, short icy blue bobbed hair, pointed elf-like ears, and glowing red eyes, wearing a sly confident smile. She raises a black wand overhead in her right hand, with a dangling orb charm at the tip glowing faintly purple and red. Her oversized crooked witch hat is black with purple lining and covered in stitched patches, warning labels, straps, and white graphics including a large "404" and a skull emblem. She wears a black and purple techwear outfit: oversized hooded jacket with many straps and tags, black crop top with "404" on the chest, layered belts, short bottoms, fishnet on one leg, black lace-up combat boots, chokers, and metallic accessories. Several hanging straps and tags visibly read words like "WITCH 404," "404," and glitch-themed markings. Beneath and beside her, a large glowing violet magic circle mixed with hacker interface aesthetics is projected on the rooftop floor, filled with occult rings, sigils, a central skull symbol, and scattered neon system text such as error-code fragments, creating a fusion of sorcery and digital corruption. Emerging from the circle is 1 large armored summoned figure: a black futuristic demon-knight or robotic familiar with jagged reflective armor, a narrow purple-lit visor, and a heavy weapon held in one hand, partially dissolving into purple energy shards and smoke. The background shows a sprawling rainy megacity of apartment towers and industrial rooftops, packed with windows, balconies, cables, signs, and haze. On a nearby building wall is a giant vertical graffiti-style sign with 3 readable elements: "404", "Witch", and "ERROR NOT FOUND", plus a smaller "E404". Additional purple neon glitch text and symbols are scattered across rooftops and in the air. Use a dark palette of black, indigo, and deep violet with sharp magenta-purple highlights, cinematic contrast, reflective wet surfaces, dense detail, and a high-end polished illustration style. The mood is occult, edgy, stylish, and dangerous, combining urban fantasy, hacker aesthetics, and magical summoning.
 </span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513036576
<br>
GenerateType:65
<br><br>
88635707
</div>
 <div class="topRightInfo">42</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/b718aff7a424c26ce05113a527fc7eda0bb5dba86b02ff222ede9c0694eb2601.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img43">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88633893</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>请根据[主题]自动生成一张"博物馆图鉴式中文拆解信息图",

主题:__大明明式汉服__

要求整张图兼具真实写实主视觉,结构拆解,中文标注,材质说明,纹样寓意,色彩含义和核心特征总结,你需要根据[主题]自动判断最合适的主体对象,服饰体系,器物结构,时代风格,关键部件,材质工艺,颜色方案与版式结构,用户无需再提供其他信息,

整体风格应为:国家博物馆展板,历史服饰图鉴,文博专题信息图,而不是普通海报,古风写真,电商详情页或动漫插画,背景采用米白,绢纸白,浅茶色等纸张质感,整体高级,克制,专业,可收藏,

版式固定为:
- 顶部:中文主标题 + 副标题 + 导语
- 左侧:结构拆解区,中文引线标注关键部件,并配局部特写
- 右上:材质 / 工艺 / 质感区,展示真实纹理小样并附说明
- 右中:纹样 / 色彩 / 寓意区,展示主色板,纹样样本和文化解释
- 底部:穿着顺序 / 构成流程图 + 核心特征总结

若主题适合人物展示,则以真实人物全身站姿为中央主体,若更适合器物或单体结构,则改为中心主体拆解图,但整体仍保持完整中文信息图形式,所有文字必须为简体中文,清晰,规整,可读,不要乱码,错字,英文或拼音,重点突出真实结构,材质差异,文化说明与图鉴气质,

避免:海报感,影楼感,电商感,动漫感,cosplay感,乱标注,错结构,糊字,假材质,过度装饰,
 </span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513033744
<br>
GenerateType:65
<br><br>
88633893
</div>
 <div class="topRightInfo">43</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/1507911c3669ad975eb3377e79433bdcbf7c99c1ba212242cb1474717e01573f.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img44">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88630446</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>"唐朝人的朋友圈"/"tang DYNASTY SOCIAL MEDIA FEED",古今穿越幽默融合界面设计风格,画面模拟手机社交媒体界面,但内容全部是唐朝场景头像是唐代文人画像,用户名"李白_Official",发布内容"刚到黄州,被贬了但心情还行,今天自己做了东坡肉,味道绝了,附菜谱:",配图为工笔画风格的东坡肉特写,点赞列表"黄庭坚,秦观,佛印等126人",评论区"王安石:呵呵""司马光:还是那个味道",界面元素如点赞图标用宋代花纹替代,状态栏显示"大宋移动 5G"和"元丰三年",配色为手机深色模式搭配宋代雅致色调,历史与社交媒体的趣味碰撞杰</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513029236
<br>
GenerateType:65
<br><br>
88630446
</div>
 <div class="topRightInfo">44</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/90c9273bc8d08dabba56bce37d5bf6f2a38aef11910d93122c428a7dc0460460.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img45">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88626600</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>symmetrical design featuring two elegant blue peacocks with detailed feather patterns, surrounded by blue floral elements, intricate vintage botanical ornament, soft beige background, classical floral decor style with rich navy and sky blue details, decorative art illustration --ar 3:2
 </span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513024262
<br>
GenerateType:65
<br><br>
88626600
</div>
 <div class="topRightInfo">45</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/91518acd1655d12d3b775d6b851b7412536805444f492bdf1ca6aba3cc415adf.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img46">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88621958</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>架空のアニメ映画のポスターをGPT image2で作成,
 </span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513017961
<br>
GenerateType:65
<br><br>
88621958
</div>
 <div class="topRightInfo">46</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/25cb9974c42da57c3a361351da47407c88afcec9a62e2f04518aadcddabed335.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img47">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">88621044</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>三国演义收藏版史诗海报,人物侧脸剪影中生长出完整世界观与经典场景,整体偏电影海报加梦幻水彩插画风,安静,宏大,神圣,怀旧,带纸张颗粒,轻雾感,飞白刷痕与高级留白</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:513016564
<br>
GenerateType:65
<br><br>
88621044
</div>
 <div class="topRightInfo">47</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/d4099e1425e69522d4d0c896efd56d25a9708694159ed7853cf431659a4823d0.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img48">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">87199089</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>这张图片展示了一位年轻女性在户外绿植环绕的环境中蹲姿拍照的场景,
人物特征:
	•	黑色长发,扎着双麻花辫,带有空气刘海
	•	穿着浅蓝色短袖衬衫,外搭浅灰色马甲背心
	•	系着深色带点纹样的领带
	•	下身是蓝灰色格子百褶短裙
	•	脚穿黑色厚底亮面皮鞋
	•	手腕佩戴银色细手镯和金色手镯
姿势神态:
	•	蹲坐在石板地面上,双腿并拢屈膝
	•	右手托腮,手肘撑在膝盖上,表情略带沉思或忧郁
	•	左手自然垂放在身侧,指尖轻触地面
	•	目光微微向下,看向斜下方
环境背景:
	•	背景是茂密的绿色植物,包括蕨类,灌木和大型观叶植物
	•	身后有几块灰色岩石作为点缀
	•	远处可见浅色砖墙
	•	整体环境像是花园,植物园或公园一角,充满自然清新的氛围
整体风格: 照片色调清新自然,带有日系学院风(JK制服风格)的穿搭特点,氛围安静略带文艺感,
</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:511004520
<br>
GenerateType:65
<br><br>
87199089
</div>
 <div class="topRightInfo">48</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/image/fc7cbd30df56e947073c7c5a9f9e62e2c5370d36775f0075bb997e07b6e7b46e.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img49">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">87170244</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,extreme aesthetic,in the style of fashion photography,light particles,cinematic lighting,Visual impact,sharp focus,Emotionalization,depth of field,dutch angle,scenery,1girl,solo,long_hair,breasts,bangs,simple_background,shirt,medium_breasts,blue_hair,jacket,yellow_eyes,upper_body,ponytail,short_sleeves,shiny,blunt_bangs,from_side,profile,mask,headgear,yellow_background,yellow_shirt,android,joints,cable,yellow_jacket,mechanical_arms,cyborg,robot_joints,yellow_theme,cyberpunk,mechanical_parts,respirator,mechanical_ears,</span>
<br><br>
Checkpoint Name:Qwen-Image
<br><br>
Size:1136x1472
<br>
GenerateId:510961695
<br>
GenerateType:56
<br><br>
87170244
</div>
 <div class="topRightInfo">49</div>
 <div class="bottomInfo">Qwen-Image</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/804d1bc0cbd341c02c3df26ddd732f55a2fac9145e021133bb430ae5b6c9f2ef.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img50">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">87169145</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,extreme aesthetic,in the style of fashion photography,light particles,cinematic lighting,Visual impact,sharp focus,Emotionalization,depth of field,dutch angle,scenery,1girl,solo,long_hair,breasts,bangs,simple_background,shirt,medium_breasts,blue_hair,jacket,yellow_eyes,upper_body,ponytail,short_sleeves,shiny,blunt_bangs,from_side,profile,mask,headgear,yellow_background,yellow_shirt,android,joints,cable,yellow_jacket,mechanical_arms,cyborg,robot_joints,yellow_theme,cyberpunk,mechanical_parts,respirator,mechanical_ears,</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:1440x2560
<br>
GenerateId:510960510
<br>
GenerateType:65
<br><br>
87169145
</div>
 <div class="topRightInfo">50</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img51">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">87167689</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Anime-style illustration featuring two distinct scenes seamlessly blended into a single high-quality image, showcasing two female characters in different urban settings: 

**Left side:** A blue-haired girl with long wavy hair tied into a low ponytail and dark ram horns (a Genshin Impact Ganyu-inspired original character), wearing a school uniform consisting of a white short-sleeve shirt, dark necktie, light blue-gray pleated skirt, black tights, and light-colored sneakers. She stands naturally on an autumn city street, left hand raised near her head in a relaxed pose. The background features a warm, sunlit urban sidewalk with other students in similar uniforms, tall modern buildings in the distance, and trees with vibrant orange-yellow leaves, fallen leaves scatter the ground, evoking a cozy, golden-hour autumn atmosphere. 

**Right side:** A silver-white long straight-haired woman with soft purple eyes and a gentle smile, dressed in an elegant white professional outfit: a lace-trimmed blouse, a cropped blazer jacket, a form-fitting pencil skirt with delicate lace hem, and white high heels. She stands confidently before a floor-to-ceiling window in a high-rise office, hands forming a cheerful "V" sign. The background reveals a breathtaking bird's-eye view of a sprawling metropolitan skyline under a clear, bright blue sky, with sharp architectural lines and reflective glass surfaces, conveying a sleek, modern, and sophisticated urban professional vibe. 

The composition uses a subtle visual transition—such as a soft gradient or overlapping cityscape elements—to harmoniously merge the two scenes</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:1728x2304
<br>
GenerateId:510958281
<br>
GenerateType:65
<br><br>
87167689
</div>
 <div class="topRightInfo">51</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9e87cd391a4617f0534b9dfffcf6ffd130400db91eab0cffdfdadb9033ca3f6a.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img52">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86470619</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,extreme aesthetic,in the style of fashion photography,light particles,cinematic lighting,Visual impact,sharp focus,Emotionalization,depth of field,dutch angle,scenery,1girl,solo,long_hair,breasts,bangs,simple_background,shirt,medium_breasts,blue_hair,jacket,yellow_eyes,upper_body,ponytail,short_sleeves,shiny,blunt_bangs,from_side,profile,mask,headgear,yellow_background,yellow_shirt,android,joints,cable,yellow_jacket,mechanical_arms,cyborg,robot_joints,yellow_theme,cyberpunk,mechanical_parts,respirator,mechanical_ears,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509908626
<br>
GenerateType:65
<br><br>
86470619
</div>
 <div class="topRightInfo">52</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/bb2eb0570b24b7bfc933dd28eb08dcc7e204ff21e97f850e0ac70370e881f4e7.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img53">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86470502</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>masterpiece,best quality,amazing quality,very aesthetic,absurdres,newest,extreme aesthetic,in the style of fashion photography,light particles,cinematic lighting,Visual impact,sharp focus,Emotionalization,depth of field,dutch angle,scenery,1girl,solo,long_hair,breasts,bangs,simple_background,shirt,medium_breasts,blue_hair,jacket,yellow_eyes,upper_body,ponytail,short_sleeves,shiny,blunt_bangs,from_side,profile,mask,headgear,yellow_background,yellow_shirt,android,joints,cable,yellow_jacket,mechanical_arms,cyborg,robot_joints,yellow_theme,cyberpunk,mechanical_parts,respirator,mechanical_ears,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509908469
<br>
GenerateType:65
<br><br>
86470502
</div>
 <div class="topRightInfo">53</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/f67ff356425e17ec6db0d23b519b50c0439aa33885b416eb026c61d0343eefa2.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img54">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86470331</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>1girl,solo,white hair,long hair,blue eyes,white frilled dress,pinafore dress,straw hat,upper body, best quality, good quality, hugging flower,flower field,wind,particles,sunlight,blurry background,colorful,lens flare,perspective,from side,scenery,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:509908273
<br>
GenerateType:65
<br><br>
86470331
</div>
 <div class="topRightInfo">54</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/aa8bbf3460ac63dc2748f6402ed48424a122094965a3e78e401255d10eae6006.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img55">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86470222</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>1girl,solo,white hair,long hair,blue eyes,white frilled dress,pinafore dress,straw hat,upper body, best quality, good quality, hugging flower,flower field,wind,particles,sunlight,blurry background,colorful,lens flare,perspective,from side,scenery,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509908103
<br>
GenerateType:65
<br><br>
86470222
</div>
 <div class="topRightInfo">55</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img56">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86462560</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>A hyper-realistic digital painting of a noble young woman in a Western fantasy/medieval aristocratic setting, exuding regal authority and quiet intensity. She has long chestnut-brown hair intricately braided into an elegant side braid, crowned with a delicate golden tiara embedded with shimmering red rubies that catch the ambient light. Her jewelry is opulent: multiple layered gold necklaces drape across her décolletage, complemented by ornate gold earrings that glint subtly. She wears a form-fitting, floor-length gown in deep emerald green or jet black, crafted with luxurious fabric and adorned with intricate golden embroidery along the seams and hem. The dress features a dramatic one-shoulder strap, a plunging V-neckline, and a high side slit that reveals a glimpse of her leg, adding both elegance and boldness. On her left hand, she wears a sleek black leather glove that extends past her elbow, while her right forearm is encased in a polished golden vambrace-style bracer, suggesting both nobility and martial readiness. Her posture is confident and poised—one hand rests firmly on her hip, shoulders back, spine straight—her expression cool and composed, with piercing eyes gazing slightly to the left of the frame, as if assessing something beyond the viewer. The background is a softly blurred interior of a grand palace or castle hall, featuring towering arched windows with stained glass accents, rich crimson velvet drapes, ornate golden moldings, and a long red carpet runner stretching into the distance. Sunlight streams dramatically through the windows, casting warm golden rays that illuminate dust motes in the air and highlight the textures of her gown and jewelry, creating a luminous, cinematic atmosphere. The overall mood is one of majestic solemnity and quiet power, evoking the aesthetic of high-fantasy concept art from AAA video games or epic film productions. Rendered in ultra-high detail with realistic skin texture, fabric folds, and metallic reflections, using a shallow depth of field to emphasize the subject against the softly out-of-focus opulent surroundings.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509897167
<br>
GenerateType:65
<br><br>
86462560
</div>
 <div class="topRightInfo">56</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img57">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86462332</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>是一幅写实风格的数字绘画,描绘了一位贵族女性形象,

人物:一位年轻女性,棕色长发编成侧辫,头戴镶嵌红宝石的精致王冠,佩戴多层金项链与耳环
服饰:身穿深色(墨绿或黑色)紧身礼服裙,设计华丽 单肩带,深V领口,金色镶边装饰,高开叉裙摆,一侧有黑色皮质长手套,另一侧是金色护腕
姿态:单手叉腰,站姿挺拔,表情冷峻淡然,目光看向画面左侧
背景:模糊的宫殿/城堡内部,有拱形门窗,红色地毯,金色装饰,光线从窗外洒入,营造出奢华而庄重的氛围
整体风格:西方奇幻/中世纪贵族设定,可能是女王,公主或贵族角色,带有游戏或影视概念设计的感觉</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509896879
<br>
GenerateType:65
<br><br>
86462332
</div>
 <div class="topRightInfo">57</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img58">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86462170</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>是一幅写实风格的数字绘画,描绘了一位贵族女性形象,

人物:一位年轻女性,棕色长发编成侧辫,头戴镶嵌红宝石的精致王冠,佩戴多层金项链与耳环
服饰:身穿深色(墨绿或黑色)紧身礼服裙,设计华丽 单肩带,深V领口,金色镶边装饰,高开叉裙摆,一侧有黑色皮质长手套,另一侧是金色护腕
姿态:单手叉腰,站姿挺拔,表情冷峻淡然,目光看向画面左侧
背景:模糊的宫殿/城堡内部,有拱形门窗,红色地毯,金色装饰,光线从窗外洒入,营造出奢华而庄重的氛围
整体风格:西方奇幻/中世纪贵族设定,可能是女王,公主或贵族角色,带有游戏或影视概念设计的感觉</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509896626
<br>
GenerateType:65
<br><br>
86462170
</div>
 <div class="topRightInfo">58</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/fe446f9da99dd29704956678ef4c8b06e35470a7ccb9d62a25445b4a5636f309.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img59">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86444204</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Cinematic film still, French-inspired fashion editorial, soft pastel color grading, ethereal forest setting with dappled sunlight filtering through tall trees, a young woman in a delicate Lolita-style dress blending traditional Chinese hanfu elements with Western vintage aesthetics (han-yang zhezhong), standing barefoot on lush green grass, dreamy double exposure effect merging her silhouette with blooming cherry blossoms, soft focus and film grain texture mimicking analog photography, candid behind-the-scenes vibe capturing a spontaneous moment during a photoshoot, natural lighting with golden hour warmth, intimate and emotive portrait expressing quiet melancholy and serene beauty, styled like a high-end Japanese street fashion magazine spread, ultra-detailed skin retouching with a filmic Kodak Portra aesthetic, shallow depth of field, 35mm lens, authentic amateur photographer's perspective with subtle imperfections for realism, composition evoking a poetic daily life narrative in a woodland sanctuary.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:509871355
<br>
GenerateType:65
<br><br>
86444204
</div>
 <div class="topRightInfo">59</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4b6152bf3930a242daaba4c3ed50e1b3c5f917e3209017d9d110d4b3f3f81381.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img60">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86443890</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Cinematic film still, French-inspired fashion editorial, soft pastel color grading, ethereal forest setting with dappled sunlight filtering through tall trees, a young woman in a delicate Lolita-style dress blending traditional Chinese hanfu elements with Western vintage aesthetics (han-yang zhezhong), standing barefoot on lush green grass, dreamy double exposure effect merging her silhouette with blooming cherry blossoms, soft focus and film grain texture mimicking analog photography, candid behind-the-scenes vibe capturing a spontaneous moment during a photoshoot, natural lighting with golden hour warmth, intimate and emotive portrait expressing quiet melancholy and serene beauty, styled like a high-end Japanese street fashion magazine spread, ultra-detailed skin retouching with a filmic Kodak Portra aesthetic, shallow depth of field, 35mm lens, authentic amateur photographer's perspective with subtle imperfections for realism, composition evoking a poetic daily life narrative in a woodland sanctuary.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509870981
<br>
GenerateType:65
<br><br>
86443890
</div>
 <div class="topRightInfo">60</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/4602cfa4a35ae4f934d78fb294d1ef18e42631e288ff69494e6619bb33dd3758.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img61">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86443396</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Cinematic film still, French-inspired fashion editorial, soft pastel color grading, ethereal forest setting with dappled sunlight filtering through tall trees, a young woman in a delicate Lolita-style dress blending traditional Chinese hanfu elements with Western vintage aesthetics (han-yang zhezhong), standing barefoot on lush green grass, dreamy double exposure effect merging her silhouette with blooming cherry blossoms, soft focus and film grain texture mimicking analog photography, candid behind-the-scenes vibe capturing a spontaneous moment during a photoshoot, natural lighting with golden hour warmth, intimate and emotive portrait expressing quiet melancholy and serene beauty, styled like a high-end Japanese street fashion magazine spread, ultra-detailed skin retouching with a filmic Kodak Portra aesthetic, shallow depth of field, 35mm lens, authentic amateur photographer's perspective with subtle imperfections for realism, composition evoking a poetic daily life narrative in a woodland sanctuary.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509870156
<br>
GenerateType:65
<br><br>
86443396
</div>
 <div class="topRightInfo">61</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/811c8151a9eaf7062e50cf55030b8226376d0236f231c7c4aff36795ee1ec304.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img62">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86440186</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Korean drama female lead, stylish winter to early spring outfit, layered look featuring a cozy oversized lambswool coat in neutral beige, paired with a thick ribbed turtleneck sweater in cream, a vintage-inspired corduroy pleated skirt with subtle Hanfu elements like side slits and soft draping, and a cropped knit cardigan in earthy tones layered underneath for extra warmth. Accessorize with a delicate gold pendant necklace, knee-high socks with lace trim, and platform loafers. Hair in soft loose waves with a middle part, light dewy makeup with rosy cheeks and glossy lips. Background: a snowy Seoul street during Lunar New Year, cherry blossom branches hinting at early spring, warm golden hour lighting, soft bokeh of city lights. Mood: sweet yet edgy (sweet-cool aesthetic), confident and effortlessly chic, inspired by TikTok fashion trends and modern reinterpretations of traditional Korean style. Include subtle details like a folded tote bag with a hanbok-inspired print and a steaming cup of matcha latte. Full-body shot, cinematic composition, high-resolution, ultra-detailed fabric textures, realistic skin tones, soft shadows, 85mm lens, f/1.8 aperture.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:509861058
<br>
GenerateType:65
<br><br>
86440186
</div>
 <div class="topRightInfo">62</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/6c3b3498d967bf176646c17f39dfbb7b0e515520314d12e19fa42d3873fd22cf.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img63">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86436134</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Ancient gnarled tree with twisted, leafless branches draped in dry, brittle vines, standing alone on a desolate hillside at dusk, a single crow perched silently on a skeletal limb, its dark feathers blending into the fading twilight, overcast sky painted in muted grays and deep purples, with faint streaks of orange sunset bleeding through the clouds, dry, cracked earth beneath, scattered with fallen twigs and withered leaves, atmosphere heavy with solitude and quiet melancholy, rendered in a highly detailed, moody oil painting style with dramatic chiaroscuro lighting, inspired by classical Chinese ink wash aesthetics blended with Western romanticism, 8K resolution, ultra-realistic textures, cinematic composition, depth of field emphasizing the crow and central tree.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:509860335
<br>
GenerateType:65
<br><br>
86436134
</div>
 <div class="topRightInfo">63</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/5a2619c9508d7f1c5d2d46cd6f6f675243f14f1846b1a8f6a4215d143afe02b0.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img64">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86435823</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>A young girl with flowing hair and a dreamy expression, her heart visibly glowing and floating above her chest like a radiant, ethereal butterfly made of light, surrounded by soft pastel clouds and shimmering stardust, standing barefoot on a meadow of wildflowers under a twilight sky painted in hues of lavender, rose, and gold, delicate wings of light subtly emerging from her back, conveying a sense of freedom, hope, and inner joy, ultra-detailed, cinematic lighting, 8k resolution, fantasy art style, inspired by Studio Ghibli and Alphonse Mucha, ethereal atmosphere, soft focus background with bokeh effects, emotional and poetic composition</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:2304x1728
<br>
GenerateId:509859894
<br>
GenerateType:65
<br><br>
86435823
</div>
 <div class="topRightInfo">64</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/25d17b05060f7a142310596e20d40772768ab7686a3f363f757c537d54648a7e.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img65">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">86435548</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>A young girl with flowing hair and a dreamy expression, her heart visibly glowing and floating above her chest like a radiant, ethereal butterfly made of light, surrounded by soft pastel clouds and shimmering stardust, standing barefoot on a meadow of wildflowers under a twilight sky painted in hues of lavender, rose, and gold, delicate wings of light subtly emerging from her back, conveying a sense of freedom, hope, and inner joy, ultra-detailed, cinematic lighting, 8k resolution, fantasy art style, inspired by Studio Ghibli and Alphonse Mucha, ethereal atmosphere, soft focus background with bokeh effects, emotional and poetic composition</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1440x2560
<br>
GenerateId:509859324
<br>
GenerateType:65
<br><br>
86435548
</div>
 <div class="topRightInfo">65</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/836f56b9a0f2eb2eabf8cae4fc003a40f4be3e534eaa9b7bb5174fb6252d2c31.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img66">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82057318</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Cinematic film still, French-inspired fashion editorial, soft pastel color grading, ethereal forest setting with dappled sunlight filtering through tall trees, a young woman in a delicate Lolita-style dress blending traditional Chinese hanfu elements with Western vintage aesthetics (han-yang zhezhong), standing barefoot on lush green grass, dreamy double exposure effect merging her silhouette with blooming cherry blossoms, soft focus and film grain texture mimicking analog photography, candid behind-the-scenes vibe capturing a spontaneous moment during a photoshoot, natural lighting with golden hour warmth, intimate and emotive portrait expressing quiet melancholy and serene beauty, styled like a high-end Japanese street fashion magazine spread, ultra-detailed skin retouching with a filmic Kodak Portra aesthetic, shallow depth of field, 35mm lens, authentic amateur photographer's perspective with subtle imperfections for realism, composition evoking a poetic daily life narrative in a woodland sanctuary.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503772380
<br>
GenerateType:65
<br><br>
82057318
</div>
 <div class="topRightInfo">66</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/f8e477e764895a408b850df440ac3f9566f855b6ea7c64b389c7ec3ea895832c.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img67">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82056614</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>晨光微熹的森林深处,一位身着汉洋折衷风格lo娘服饰的少女静立于斑驳树影间,裙摆轻扬,蕾丝与丝绸在微风中泛起细腻光泽,法式穿搭的优雅轮廓与自然森系氛围悄然融合,她侧身回眸,眼神温柔而略带忧郁,仿佛藏着未诉的故事,双重曝光手法将远处草地与树梢光影温柔叠印在她面庞与裙褶之上,营造出梦幻而私密的写真情绪,胶片质感的色调低饱和却层次丰富,青灰与暖褐交织,光影柔和漫射,仿佛时光凝滞在某个慵懒的午后,构图以低角度仰拍捕捉她与参天古木的对话,前景散落着野花与落叶,背景虚化如水彩晕染,整体画面宛如一幅精心调色的人像精修画报,既保留业余摄影的随性温度,又透出日系风格的静谧诗意,记录下这场摄影约拍中最动人的日常瞬间,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503767770
<br>
GenerateType:65
<br><br>
82056614
</div>
 <div class="topRightInfo">67</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img68">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82041073</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>在繁星璀璨的夜晚,一位身穿精致女仆装的魔法少女静立于魔法森林深处,月光与星光交织洒落,照亮她柔顺的发丝与裙摆上细腻的蕾丝褶皱,她脚踩一双泛着温润光泽的珍珠平底布鞋,丝袜在微光中透出若隐若现的柔滑质感,手中紧握镶嵌水晶的魔法棒,顶端正缓缓释放出梦幻的光晕,周围漂浮着点点发光的精灵与轻盈飞舞的花仙子,南瓜灯在树根间错落摆放,散发出温暖而神秘的橙光,照亮蜿蜒小径与藤蔓缠绕的古树,整幅画面构图层次分明,远景是幽深林间闪烁的萤火与银河横跨天际,近景则聚焦于少女清澈眼眸中映出的星光倒影,色彩以梦幻的蓝紫与柔粉为主调,辅以金色光点点缀,光影柔和而富有层次,呈现出明亮却不刺眼的奇幻氛围,整体风格融合日式动漫的细腻笔触与童话般的唯美质感,细节丰富,画面纯净通透,宛如梦境降临人间,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503752118
<br>
GenerateType:65
<br><br>
82041073
</div>
 <div class="topRightInfo">68</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img69">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82035862</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>魔法女仆少女</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503744813
<br>
GenerateType:65
<br><br>
82035862
</div>
 <div class="topRightInfo">69</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img70">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82032134</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>在萤火虫漫展的璀璨夜色中,一位融合了秒速五厘米诗意氛围与魔卡少女樱梦幻气质的美少女伫立于光影交错的展台前,她身着辉夜大小姐风格的精致制服与公主连结元素的魔法裙摆交织设计,发间点缀着香风智乃般的兔耳发饰,眼神中闪烁着中二病特有的炽热幻想,画面以三维动画质感呈现,角色建模细腻流畅,肌肤透出柔和的次表面散射光效,服装材质兼具丝绸光泽与板绘手绘纹理,背景是漫剪混剪的动态投影墙,浮现着小樱,七七等二次元角色的剪影与魔法阵光纹,整体构图采用低角度仰视视角,突出少女的灵动与神秘感,青橙色为主色调,萤火虫如星屑般在空气中漂浮,营造出既梦幻又略带忧伤的氛围,光影层次丰富,高光与阴影过渡自然,细节处可见板绘过程的笔触痕迹,仿佛整幅插画正从画布中缓缓浮现,充满同人创作的温度与二次元漫画的浪漫幻想,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503739927
<br>
GenerateType:65
<br><br>
82032134
</div>
 <div class="topRightInfo">70</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/f20b1733be2332f7410b393f538962388eb29f665b6500de7cee5edab807d301.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img71">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">82029540</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>在萤火虫漫展的璀璨夜色中,一位融合了秒速五厘米诗意氛围与魔卡少女樱梦幻气质的美少女伫立于光影交错的展台前,她身着辉夜大小姐风格的精致制服与公主连结元素的魔法裙摆交织设计,发间点缀着香风智乃般的兔耳发饰,眼神中闪烁着中二病特有的炽热幻想,画面以三维动画质感呈现,角色建模细腻流畅,肌肤透出柔和的次表面散射光效,服装材质兼具丝绸光泽与板绘手绘纹理,背景是漫剪混剪的动态投影墙,浮现着小樱,七七等二次元角色的剪影与魔法阵光纹,整体构图采用低角度仰视视角,突出少女的灵动与神秘感,青橙色为主色调,萤火虫如星屑般在空气中漂浮,营造出既梦幻又略带忧伤的氛围,光影层次丰富,高光与阴影过渡自然,细节处可见板绘过程的笔触痕迹,仿佛整幅插画正从画布中缓缓浮现,充满同人创作的温度与二次元漫画的浪漫幻想,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:503736557
<br>
GenerateType:65
<br><br>
82029540
</div>
 <div class="topRightInfo">71</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img72">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">81406481</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>一位优雅的黑暗女神伫立于高端酒店奢华浴室中,身着黑色蕾丝无肩带迷你裙,裙摆轻拂膝盖,搭配透肤黑色丝袜与尖头细跟高跟鞋,颈间闪耀着精致的钻石项链,她身姿曼妙,发丝随风自然飘动,背景是通顶落地窗映出的城市天际线,晨光柔和洒落,照亮独立式白色大浴缸与银色淋浴头,画面采用清新自然的摄影风格,高清晰度呈现细腻纹理与真实质感,光影层次丰富,色调偏向冷艳而奢华的黑白银灰,构图以全身视角捕捉她动态瞬间,尽显尊贵生活气息与神秘美感,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:502910173
<br>
GenerateType:65
<br><br>
81406481
</div>
 <div class="topRightInfo">72</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img73">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">81406406</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>Dark Goddess,beauty,A graceful and beautiful woman in a full-length shot in a luxurious bathroom of a high-end hotel,featuring a large standalone white bathtub,bright floor-to-ceiling windows showcasing urban views,and a silver shower head. The woman wears a black lace strapless mini dress that falls above the knee,paired with sheer black pantyhose and pointed-toe stiletto high heels. She adorns a sparkling delicate diamond necklace around her neck. The photo captures her dynamically with hair naturally flowing. The image is captured in a fresh and natural photography style with soft morning light,offering high clarity and realistic details,showcasing a moment of luxurious living.</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:502910063
<br>
GenerateType:65
<br><br>
81406406
</div>
 <div class="topRightInfo">73</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img74">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">81406000</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>一位年轻女性肖像,长发乌黑亮丽高高扎起成马尾,发尾由一条华丽宽大的黑色缎带领结固定,身穿剪裁利落,哑光质感黑色皮革连体衣,表面泛着微妙光泽,线条极简流畅,搭配黑色蕾丝露指手套延伸至手腕,颈间佩戴精致黑色细项圈,中央垂坠一枚小巧银色吊坠,肌肤如白瓷般细腻无瑕,双眸深邃如烟熏炭色,眉形锋利,唇色暗红,神情冷峻而专注,眼神直摄镜头,散发自信与神秘交织的气场,画面采用戏剧性明暗对比布光,柔和的伦勃朗光线雕琢面部轮廓,浓郁阴影增强立体感,浅景深效果突出主体,模拟85mm镜头在f/1.8光圈下的成像质感,背景为无缝平滑的灰度渐变,全幅聚焦人物,融合哥特式优雅与现代时尚摄影风格,营造出静谧却极具张力的迷人氛围,细节极致丰富,整体呈现8K超高分辨率 masterpiece 品质,</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:502909392
<br>
GenerateType:65
<br><br>
81406000
</div>
 <div class="topRightInfo">74</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img75">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">81405809</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>((masterpiece, best quality, ultra-detailed, 8k resolution)), (portrait of a young woman with long lustrous black hair in a high ponytail, secured by an ornate large black satin bow, wearing a sharply tailored matte black leather bodysuit with subtle sheen, minimalist lines, black lace fingerless gloves to wrists, delicate black choker with small silver pendant, pale porcelain skin, smoky charcoal eyes, sharp brows, dark red lips, cool intense expression, deep dark eyes locked on camera, radiating confidence and mystery), (dramatic chiaroscuro lighting, soft Rembrandt lighting sculpting facial contours, rich shadows adding depth, shallow depth of field, 85mm lens, f/1.8 aperture), (seamless smooth grayscale gradient background, all focus on subject), (gothic elegance fused with contemporary fashion photography, enigmatic captivating allure, quiet powerful presence)</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:502909163
<br>
GenerateType:65
<br><br>
81405809
</div>
 <div class="topRightInfo">75</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/b63c3e123821cd220fa1fcf5d197b5173f9dc98e088dc47e8832f36039856263.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img76">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">80488214</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>换成樱花场景,穿着旗袍</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:501678702
<br>
GenerateType:65
<br><br>
80488214
</div>
 <div class="topRightInfo">76</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/7564beab281bd5a4eabdf55e59433082e9296a8c9a193f4ecc252083e9712b69.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img77">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">80479672</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>换成绿色头发,樱花场景,衣服换成旗袍</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:501664824
<br>
GenerateType:65
<br><br>
80479672
</div>
 <div class="topRightInfo">77</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/9c8715033809ef75ab1f962b687578561e8527ed956a9b4fc03d5f14be65ec97.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img78">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">80475565</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>换成红色头发</span>
<br><br>
Checkpoint Name:Seedream 4.5
<br><br>
Size:1728x2304
<br>
GenerateId:501658026
<br>
GenerateType:65
<br><br>
80475565
</div>
 <div class="topRightInfo">78</div>
 <div class="bottomInfo">Seedream 4.5</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img79">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">78836831</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>1girl, solo, maid, breasts, maid headdress, cleavage, black hair, earrings, jewelry, realistic, open mouth, looking at viewer, medium breasts, short hair</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:1728x2304
<br>
GenerateId:499499735
<br>
GenerateType:65
<br><br>
78836831
</div>
 <div class="topRightInfo">79</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/xxxx_0000_porn_20230619.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img80">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">78836438</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>1girl, solo, maid, breasts, maid headdress, cleavage, black hair, earrings, jewelry, realistic, open mouth, looking at viewer, medium breasts, short hair</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:1728x2304
<br>
GenerateId:499499188
<br>
GenerateType:65
<br><br>
78836438
</div>
 <div class="topRightInfo">80</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/7d27d7bde803511b87db0faf2073bb6387a5c4094ab9cad29cc3e611e341def1.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img81">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">78835297</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>少女,black pantyhose,可爱,百褶裙,透明纱短袖,清冷少女,十六岁,简洁背景</span>
<br><br>
Checkpoint Name:Seedream 5.0
<br><br>
Size:1728x2304
<br>
GenerateId:499497720
<br>
GenerateType:65
<br><br>
78835297
</div>
 <div class="topRightInfo">81</div>
 <div class="bottomInfo">Seedream 5.0</div>

 </div>
 

 <div class="grid-item">
 <img class="img-content" data-src="https://liblibai-online.liblib.cloud/sd-gen-save-img/genius_playground/image/b2a8cf626f3745e4a1027977ee3db49a/0ca04bac345b5da857bdc3a5bd26e5549310f3b0b4ed81534b52424be935e182.png?Token=cad427758629478f8597a697ea413bb5?image_process=format,webp&x-oss-process=image/resize,w_1000,m_lfit,format,webp" alt="img82">
 <img id="infosvg" src="">
 <div class="image-id" style="display: none;">76087793</div>
 <div class="image-info" style="display: none;">
<span class ='copy'>绿头发小女孩</span>
<br><br>
Checkpoint Name:F.1基础算法模型-哩布在线可运行
<br><br>
Size:1728x2304
<br>
GenerateId:495941806
<br>
GenerateType:65
<br><br>
76087793
</div>
 <div class="topRightInfo">82</div>
 <div class="bottomInfo">F.1基础算法模型-哩布在线可运行</div>

 </div>
 
 
 




    </div>



    <div class="image-overlay" id="image-overlay">
        <div id=overlayimage-container>
            <img id="overlay-image">
            <img id="overlay-infosvg" src="">
        </div>
        <div id='overlay-id'></div>
        <div id="overlay-info">
            <div id="overlay-info-content">

            </div>

        </div>


    </div>
    <div class="info-overlay">
        <div id="info-overlay-content">

        </div>

    </div>


    <script src="https://cdn.jsdelivr.net/npm/macy@2"></script>
    <script>
        var macy = Macy({
            container: '.grid-container',
            trueOrder: false,
            waitForImages: false,
            margin: 5,
            columns: 2
        });

        const images = document.querySelectorAll('.grid-item .img-content');
        const imageIds = document.querySelectorAll('.image-id');
        const imageInfos = document.querySelectorAll('.image-info');
        const infosvgs = document.querySelectorAll('#infosvg');



        const overlay = document.getElementById('image-overlay');
        const overlayImage = document.getElementById('overlay-image');
        const overlayInfo = document.getElementById('overlay-info');
        const overlayInfoContent = document.getElementById('overlay-info-content');
        const overlayImageId = document.getElementById('overlay-id');
        const overlayInfosvg = document.getElementById('overlay-infosvg');
        const overlayImageContainer = document.getElementById('overlayimage-container');

        const infoOverlay = document.querySelector('.info-overlay');
        const infoOverlayContent = document.getElementById('info-overlay-content');

        infosvgSrc =
            "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAYAAACPgGwlAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAzDSURBVHic7Z17cFTVHcc/52yyeYkSQCwCDVQMWpRGko0iFsFHBcFWhQDOCAkqdJSq41hHqjJGtC21ap2houCDBUSEiIo6iDhKtGAgSzAoTwEThlehvASSkMfe0z+WSIBNso/72s39zOSPvXvu73yTb859nNdPEE/0z0vBn9wHJXsj6IGiB9AV6Ah0AtJPlWwPCEABR08dOwIcRKiDKLEXQSWKSiRbkNWbKCmqMfm3MQxhtYCIyctzsbPdFaiGASCuBbKBSwGXAbX5gW3AWlAlSFbyy5qNFBX5DajLcGLL9Oy7OuFy34piKHAzgRZsFYdQLAfxKVJbSuncQxZqCQv7m5498QJctSPRGIXgBiDBaklBaADxBYpFKPdiymb9ZLWglrCv6Z7x14I2ARgFpFotJwyqgEUI9Tqlc0usFhMM+5nuGXcTiKlAf6ulRI/6BuQ0fN5PCDw02gKbmF4o8VQOAzUF8FitRncU3yF5kYzq+XZ4+LPedM+40SAKgcuslmICmxCikFJvkZUirDO93929cCX8G9QtlmmwCsUKXPJPrJm9yYrqzTe9f14K/rTHUWoykGR6/fahHniV6uon2Vh0wsyKzTU9Z9xQhJgB9DC1XntTAeIBfN5lZlVojumDBiVQ3eMplJoCSFPqjC0UMJ3q6sfYWFRndGXGm+4Z3x38757qKnVoGR+4xuB760cjKzG21eXk/x60csfwkPGAfx25BXlGVmLE4ASAICf/OQSvEFu9aXYgGRhJ16wE9q4vNqIC/S/veXkuKlNnABN1j93mEHNIq7yP4uIGPaPq29J7PZhEnfYOMFbXuG2XLOrbZ5GRuYTdm3QzXr+WnlXQnkS1BBioW0yHRlYj1HC9hm/1MT1g+AogS5d4BpKS5CajS0fS26Vx5HgVlXsPcrKu3mpZoVBOvRhMufdo60VbJnrT++el0JC6DBu3cCEEdw7OZsLt1zM4+3LciaeH5GvrGlhRtpnXPyzmg+J1KGWbwbBgrEZLupGyWdXRBInO9MBD20JgRFRxDCSjS0cWPHc//a/s1WrZb77bzpgnZ7Br/2ETlEXMx6TtvDOah7to3tMFFakzsbHhfXt1p9T7dEiGA1zbtxe+OYVc2aubwcqi4jZOZLxJFA028qf3wHv4wxGfbzCd089nxWuTufjC9NYLN+G8lCSGXtuX+ctKqD5peI9oZAh+Q9csEel7fGSm544bDmIGdhiPb4bpj93NoOzIhujbt0slvV0aH/+nXGdVujKQbletZ0/5lnBPDN80z/juoH2LtTNRW+SSbp3Z+t40XDLyu1eD30/miMlU7P2fjsp05wgu0Y/V3spwTgrvr5I9MTEweGJfwwFG3uCJynCABJeLETfk6KTIMNLxq4X0yXOHc1J4fxlRNy0WBk8GXtVblzjX99MnjsHkkpL6bDgnhG56zrihCPVI2JIsoGvn8B7emqNb5w66xDEcwWPkjg152llopvfPS0GIV7Dxg1tTEhP0GVJo2oljcwSImWRPDGlEMzTT/WlPAT2jUWUm+w5G3VMJwJ4DR3SJYwpKZCBrHw+laOumX11wKUo9GrUoE1m7uUKXOL5Nhk5gMYLJ5NzT6oNI66Zr6lVibNbqh8XrdImz5OtvdYljIm6Ef3prhVo23TNuNHCjXorMYvWGHXzhi25K+YqyzZRujLmWDnAzOfktdo23YHqhBDFFb0Vm8ejLC6ipjawbtaqmlodemK+zIlN5NuBfcJo3PbdyBNDHCEVmsH7bLsZPfRO/poV1nl/TKJj6Bht27DZImQkILif3xz8093XzpisV0pOgnVn4+RqGP/Ivjh4Pbfj58LEqbn34Jd77wmewMhNQYgrNvGIHf6HNzR8G/NlASaaxffcB3vr4a5LcifTO6EJyUuI5ZY4er+a191cw6okZfB/LLfxMutD1qtXsLd9+9hfBO1s8+SuBAUarMpvEBBe/zcrkkm6d6XD+eRw+doLtuw6wcv0P1DdYvoLYCErwzTmn2/xc0wM7QKwyRZKD8WjaNZTNW9P0UJB7unLmq8cTUt539qEzW3r2xAuQtXtxVqXED4ITiIaurJl/rPHQmS3ddTIPx/D4QnEeKuH2pofONF2JUaYKcjAJNbrpp9OX9+y7OiHd+7DnPm0O0VFHQkIXSt48DE1buitxGI7h8Yobv39I44fTpisxJGhxh/hAO72hU+DyHlipsh+bT3gMlwSXi26d05Ey9Ak/mqbYfeAIDf6466w5gK9nFyjUApfzipS+iPgxXErBX+8fyUOjbyY1OayJogBUn6zj5QWfMWXm+2iarde2hUNnPBWX42Pjqcu7/We4hsODo25mcv6wiAwHSE1288T425g0MuamErSMUtdB4z1dxMM+rKcZ87urdYpzjS5x7EOgcZ9q6cr2s/rD4RcdL9AlzsUXttcljm0Q5ABI+uelgAhtWadDrJPJoIJkSUPaFRi3y5SDvUigisskqEyrlTiYicqUxNAiBgcdEKqnBDKs1uFgJrKnJJC3zKGtoKlukkCSOoe2gqCjY3pbQ9BJAvr0ZDjEBor2khhbnOgQNUkSiGxUwiFWcUuc2TJtjUQJ6LqXuIPtqZeATbdFdDCIOgnUWq3CwVRqJaDPrjwOscIRCRy0WoWDqRyUgC4pIhxiBMVhCeyxWoeDiUixWyKotFqHg5loFRLlmN6mUKJCIrStVutwMBHh2ipxndwIxN0aHoegNHA4bYukpKgG2Ga1GgdT2ML26bWNq1bLLJXiYA6KdXB6qbKzm1RbQIiV8PNaNtc3lopxMAcpVkGj6RnHN+D0zMU7+1kzezM0ml5U5Eex3FJJDsai+AxQ0HT7Eckyq/Q4mMLP/p423V+3FIiJnNIOYVNHcn0Q08sWHATxpSWSHIxmOSvf+TkL0VmbB7LIdDkOJqAWNv10lunuxUCVmXIcDEZwAnfCkqaHzjS9bNZPQJGZmhwMRqkFrHrreNND5279LdQs0wQ5GI+m3jz70Lmml84tQbDSFEEORlNy9gb/0FziHk383XA5DsYjtGeCHQ5u+lrvUpyRt1jnW0rnBe1lbSlF1zTD5DgYjxBTOdXtejbNm7527mJgg0GSHIxlE6U9Pmruy5ZyrapT/y0OsYZQT0Fhs6knW06wW+otAj7VW5ODgSiWUzr3g5aKtJ5K2+9/CDiplyYHQ6lFqgdbK9S66eve3g68oIciB4MRYhqlc39orVjrpgMkVP8NiMlk4m2IHaQS0htXaKaXFNWAmEQzrwAOlqOQPECxN6TbcGimA/i8y4AXI1XlYCTiedbMCXm6W+imA6Tt/AvOdGl7IcQaNPeUcE4Jz/Ti4gaQd2HzmbP7DuqzucaeA0daL2QtR5CMoWxWWNPcwjMdwDd7F4J8bHx/f3f5OQNLkcX5XJ84BqFQajyrvZXhnhhZRoc967fRNSsBGBjR+Qbj21xBostFv8t64E4Mf5u8qppanp+3lH/OW4qy67+2EFPxzZkZ0anRVItn3EwQE6KIYSguKel+UYewk/Ht2n8Yv9ZsL6YdmIVvzh8jPTma3SIVPWrupzK1AzAiijiG4dc0KvfF3T5KH5G2c1I0AaJp6QEGFSRTpT7Dppf6+EJ8RRpDQn0fbzaKLlqyCtqTqFYAWbrEcwhGOfViMOXeqF9Nwn96D0a59yj1YjDwtS7xHM5CfKWX4aBnPrb/lp8kdeACUmp7A310i9vWEWIJCVV3sPadE3qF1DcJ3+FSPwMy3+cn90VAXKXytAgvaTvHsnKprps263NPD4Yn/xlgiqF1xC+BWUul3kIjghtriKfgNlCzIX5ys5vATyjuZe2cxUZVYHwr9IzvDtoCYIDhdcU+PoQ2mtJ5FUZWYnxi3b3lx8hMn0tDuiLwLu9c7s9FAdPRksawdrbhg1nmGpA79haUnAH8ytR67c0OJA+EMx4eLeam0N7z3Q4yMl9HuRuAa2jbSYPqgVeo1fJYN3eLmRVbd6nNzr8EyXRgqGUaLEN9iSYnUeY11exGrL+/5uSPQPAMbaND53uEerq1eelGY73pAQSeguGgngJyrRajP2o9QrxEac+3W1p5YhZ2Mf002eOuQ4pC4EarpejAKhD/wOf9BBvNNLKf6Y1kj70aIScgGY3iPKvlhMFxYCGa9kawDQHsgH1Nb2TAPe2o998BajRK3IQ9c8PWActRYhE1VR+wsUi3wREjsL/pTel/bwf8/iGgDUGJW4DOFqrZf2rrzWUk1y9ruk+b3Ykt089E4Mn/NUpdh2QASmQDmRjz7t8AbEVRhmAVsArfnE3Y6D4dDrFs+rn0yXOTktIHQSbIngh6oKluCDrCzz8COJ9Ax5QfOEbAvEPAIRSHkGJ3IKGRVgFyK9VVm9hYFDc5af8PIJV/zY/mxigAAAAASUVORK5CYII="
        overlayInfosvg.src = infosvgSrc;

const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当元素进入视口时，替换图片地址
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => {
                        setTimeout(()=>{
                        img.classList.add('loaded');
                        },100);
                        // 图片加载完成后，重新计算 Macy.js 布局
                       macy.recalculate(true);
                   observer.unobserve(container);
                    };

                };
            });
        } );   

        images.forEach(img => {
            if(true){
                observer.observe(img)
     }
            


            img.addEventListener('click', function () {
                overlayImage.src = this.src;
                overlayImage.alt = this.alt;
                overlay.classList.add('active');
                overlay.classList.add('fadeIn');
                overlayImageContainer.classList.add('active');

                // keyframe还是只能配合动画类的方式来使用，不然很容易动画冲突，且移除不会产生回滚效果，前提是最终的动画结果和元素初始状态一致
                overlayImage.classList.add('zoomIn');
                setTimeout(function () {
                    overlayImage.classList.remove('zoomIn');
                }, 500);

                overlayImageId.classList.add('fadeIn');
                setTimeout(function () {
                    overlayImageId.classList.remove('fadeIn');
                }, 500);

                overlayInfosvg.classList.add('fadeIn');
                setTimeout(function () {
                    overlayInfosvg.classList.remove('fadeIn');
                }, 500);

                // 准备好image-overlay所需的id和info
                overlayImageId.innerHTML = this.parentNode.querySelector('.image-id').innerHTML;
                overlayInfoContent.innerHTML = this.parentNode.querySelector('.image-info').innerHTML;
                console.log(overlayImageId.innerHTML + ": " + overlayInfoContent.innerHTML)
            });
        });



        //infosvg启动infoOverlay
        infosvgs.forEach(infosvg => {
            infosvg.src = infosvgSrc;
        });

        document.addEventListener('click', function (event) {
            if (event.target.id === 'infosvg') {
                infoOverlay.classList.add('active');
                infoOverlayContent.innerHTML = event.target.parentNode.querySelector('.image-info').innerHTML;
                infoOverlayContent.scrollTop = 0;
                console.log(infoOverlayContent.innerHTML);
            }
        });


        infoOverlay.addEventListener('click', function () {
            infoOverlay.classList.add('fadeOut');
            setTimeout(function () {
                infoOverlay.classList.remove('fadeOut');
                infoOverlay.classList.remove('active');
            }, 500);

        });

        // 只需要给infoOveylay添加停止冒泡的监听事件就可以
        // 当事件在子元素 infoOverlayContent 上触发时，它会自动冒泡到父元素。所以，只需要阻止 infoOverlay 上的 touchmove 事件的默认行为和冒泡，就可以同时影响到子元素。
        // if (event.target === this) {}也是一种有效的阻止事件冒泡的方法:点击infoOverlayContent时，事件确实冒泡到了infoOverlay，但处理函数检查了event.target还想不是infoOverlay本身,于是停止执行
        // inforOverlay加上会影响结束后的跟手状态,所以去掉
        // infoOverlay.addEventListener('touchmove', function (event) {
        //     if (event.target !== infooverlayContent) {
        //         event.stopPropagation();
        //         event.preventDefault();
        //     }
        // });


        overlayInfosvg.addEventListener('click', function () {
            // 阻止事件冒泡到 overlay 元素，不然的话，就要放到img的监听事件里面才不会出现点击overlayinfosvg就导致整个overlay退出，overlayImage的监听事件同理
            event.stopPropagation();
            overlayImageContainer.classList.toggle('show-text');
            overlayInfo.classList.toggle('show-text');
            // onverlayInfo 开启和关闭show-text比较特别，进入的时候可以和进入动画以及container一起进入，但是退出的时候需要先执行退出动画再退出
            if (overlayImageContainer.classList.contains('show-text')) {
                // 开启onverlayInfo show-text并给其添加进入动画
                // overlayInfo.classList.toggle('show-text');
                // overlayInfo.classList.add('bottomSlideIn');
                setTimeout(function () {
                    // overlayInfo.classList.remove('bottomSlideIn');
                }, 500);
                // imageId元素处理
                overlayImageId.classList.add('fadeOut')
            } else {
                closeOverlayInfoShowText()
            }
        });

        function closeOverlayInfoShowText() {
            // 关闭onverlayInfo show-text但是先添加退出动画
            // overlayInfo.classList.add('bottomSlideOut');
            overlayImageContainer.classList.remove('show-text');
            overlayInfo.classList.remove('show-text');
            //注意这里是remove而不是toggle show-fulltext，因为存在没有show-Fulltext到那时有show-text的情况，就是半屏下滑
            overlayInfo.classList.remove('show-fulltext');
            // imageId元素处理
            overlayImageId.classList.remove('fadeOut')
            overlayImageId.classList.add('fadeIn');
            setTimeout(function () {
                // overlayInfo.classList.remove('bottomSlideOut');
                // 关闭onverlayInfo的 showtext

                // imageId元素处理
                overlayImageId.classList.remove('fadeIn');
            }, 500);
        }

        // overlayInfo放大信息页 
        overlayInfo.addEventListener('touchmove', function (e) {
            // 只是阻止touchmove的冒泡，没有阻止click的冒泡，不影响点击的时候就是点击整个overlay
            // 阻止冒泡事件同时也阻止了overlayInfo滚动事件的触发,导致即使内容超过了容器的高度,但是依旧无法滚动,但是不设置又会导致上滑的时候最底层的页面的滚动,暂时没有好的解决办法,只能先这样了
            e.preventDefault(); // 阻止默认滚动行为
            e.stopPropagation(); // 阻止事件冒泡        
        });

        overlayInfo.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
        });

        overlayInfo.addEventListener('touchend', function (e) {
            touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchEndY - touchStartY;
            // 下滑退出showText
            // 直接共用动画
            if (deltaY > 50) {
                closeOverlayInfoShowText()
            } else if (deltaY < -50) {
                // 上滑放大showText
                // 如果是用toggle而不是add和remove呢，是否又增加了一个新操作状态，就是想要实现的恢复原有半image和半text的状态
                // 但是overlay点击退出的时候似乎又会冲突，所以，overlay点击退出的时候应该是remove就不能再是toggle了，和showText一样
                // 但是有showText没有show-Fulltext的时候又有冲突了，这个时候下滑showText是退出了，但是show-Fulltext反而是增加,所以这里也只能是remove
                // 此外，全屏恢复到半屏的时候，动画转换有些生硬，因为过渡动画只应用到了transform和opacaity而不是全部的转换
                overlayInfo.classList.toggle('show-fulltext');
                // 上滑会导致元素内的文字的滚动,所以加一个回到顶部的操作
                // overlayInfo.scrollTo({top:0,behavior:'smooth'});
            }
        });

        overlay.addEventListener('click', closeOverlay);

        // overlayImage.addEventListener('click', closeOverlay); //放外面，避免重复执行，但是需要使用事件冒泡才能实现放在img监听事件里面一样的效果，即点击该区域不会引发整个overlay的退出，所以，这里没必要添加了
        // overlayImageId.addEventListener('click', closeOverlay);


        let copiedItems = [];


        // 通用复制函数
        document.body.addEventListener('click', function (event) {
            if (event.target.classList.contains('copy')) {
                //阻止冒泡事件失败，原因未知
                event.stopPropagation();
                console.log(event.target);
                 if(!copiedItems.includes(event.target.innerHTML)){
                    copiedItems.push(event.target.innerHTML);
                    navigator.clipboard.writeText(copiedItems);
                    console.log(copiedItems)

                    event.target.classList.add('colorChange')
                    setTimeout(() => {
                        event.target.classList.remove('colorChange')
                    }, 500);
                }
            }
        });

        overlayImageId.addEventListener('click', function () {
            if (!copiedItems.includes(overlayImageId.innerHTML)) {
                copiedItems.push(overlayImageId.innerHTML);
                console.log(copiedItems)
            }
        });

        function closeOverlay() {
            // 如果应用了show-text及其fulltext的缩放动画，则需先关闭这些动画再延迟执行关闭动画，否则立即执行关闭动画
            if (overlayImageContainer.classList.contains('show-text')) {
                closeOverlayInfoShowText()
                setTimeout(function () {
                    applyCloseAnimation();
                }, 500); // 假设缩放动画持续 0.5 秒
            } else {
                applyCloseAnimation();
            }
        }
        // 执行关闭动画
        function applyCloseAnimation() {
            navigator.clipboard.writeText(copiedItems)
            overlayImage.classList.add('zoomOut');
            overlay.classList.add('fadeOut');

            // 在关闭动画完成后重置类
            setTimeout(function () {
                overlayImage.classList.remove('zoomOut');
                overlay.classList.remove('fadeOut');
                overlay.classList.add('fadeIn');
                overlay.classList.remove('active');
                overlayImageId.classList.remove('fadeOut');
                overlayImageContainer.classList.remove('active');
            }, 600); // 假设动画持续 0.5 秒
        }


        //照片切换
        overlayImage.addEventListener('touchmove', function (e) {
            // 阻止默认滚动行为
            e.preventDefault();
            // 阻止事件冒泡
            e.stopPropagation();
        });

        let touchStartY = 0;
        let touchEndY = 0;

        overlayImage.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
        });

        overlayImage.addEventListener('touchend', function (e) {
            touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchEndY - touchStartY;

            if (deltaY > 50) {
                slidePrevImage();
                // 向下滑动，显示上一张图片
                const prevImage = getPrevImage(overlayImage.src);
                const prevId = getPrevId(overlayImageId.innerHTML);
                const prevInfo = getPrevInfo(overlayInfoContent.innerHTML);

                if (prevImage) {
                    //当前图片淡出后再切换图片,所以时间设置动画时间的一半
                    setTimeout(function () {
                        overlayImage.src = prevImage.src;
                        overlayImage.alt = prevImage.alt;
                        overlayImageId.innerHTML = prevId.innerHTML
                        overlayInfoContent.innerHTML = prevInfo.innerHTML
                    }, 325);
                }
            } else if (deltaY < -50) {
                slideNextImage();
                // 向上滑动，显示下一张图片
                const nextImage = getNextImage(overlayImage.src);
                const nextId = getNextId(overlayImageId.innerHTML);
                const nextInfo = getNextInfo(overlayInfoContent.innerHTML);
                if (nextImage) {
                    //注意延迟时间,当前图片淡出后再切换图片
                    setTimeout(function () {
                        overlayImage.src = nextImage.src;
                        overlayImage.alt = nextImage.alt;
                        overlayImageId.innerHTML = nextId.innerHTML
                        overlayInfoContent.innerHTML = nextInfo.innerHTML
                    }, 325);
                }
            }

        });

        function getPrevId(currentId) {
            const currentIdIndex = Array.from(imageIds).findIndex(info => info.innerHTML === currentId);

            if (currentIdIndex > 0) {
                return imageIds[currentIdIndex - 1];
            } else {
                return null;
            }
        }

        function getNextId(currentId) {
            const currentIdIndex = Array.from(imageIds).findIndex(info => info.innerHTML === currentId);

            if (currentIdIndex < imageIds.length - 1) {
                return imageIds[currentIdIndex + 1];
            } else {
                return null;
            }
        }

        function getPrevInfo(currentTxt) {
            const currentInfoIndex = Array.from(imageInfos).findIndex(info => info.innerHTML === currentTxt);

            if (currentInfoIndex > 0) {
                return imageInfos[currentInfoIndex - 1];
            } else {
                return null;
            }
        }

        function getNextInfo(currentTxt) {
            const currentInfoIndex = Array.from(imageInfos).findIndex(info => info.innerHTML === currentTxt);

            if (currentInfoIndex < imageInfos.length - 1) {
                return imageInfos[currentInfoIndex + 1];
            } else {
                return null;
            }
        }


        function getPrevImage(currentSrc) {
            const currentImageIndex = Array.from(images).findIndex(img => img.src === currentSrc);
            if (currentImageIndex > 0) {
                return images[currentImageIndex - 1];
            } else {
                return null;
            }
        }

        function getNextImage(currentSrc) {
            const currentImageIndex = Array.from(images).findIndex(img => img.src === currentSrc);
            if (currentImageIndex < images.length - 1) {
                return images[currentImageIndex + 1];
            } else {
                return null;
            }
        }

        function slideNextImage() {
            overlayImage.classList.add('nextPhotoChange');
            overlayInfosvg.classList.add('overlayFadeInOut');
            overlayImageId.classList.add('colorChange');
            if (overlayImageContainer.classList.contains('show-text')) {
                overlayInfo.classList.add('overlaySlideChange');
                setTimeout(function () {
                    overlayInfo.classList.remove('overlaySlideChange');
                }, 750);
            }
            setTimeout(function () {
                overlayImage.classList.remove('nextPhotoChange');
                overlayInfosvg.classList.remove('overlayFadeInOut');
                overlayImageId.classList.remove('colorChange');
            }, 750);
        }

        function slidePrevImage() {
            overlayImage.classList.add('prevPhotoChange');
            overlayInfosvg.classList.add('overlayFadeInOut');
            overlayImageId.classList.add('colorChange');
            if (overlayImageContainer.classList.contains('show-text')) {
                overlayInfo.classList.add('overlaySlideChange');
                setTimeout(function () {
                    overlayInfo.classList.remove('overlaySlideChange');
                }, 750);
            }
            setTimeout(function () {
                overlayImage.classList.remove('prevPhotoChange');
                overlayInfosvg.classList.remove('overlayFadeInOut');
                overlayImageId.classList.remove('colorChange');
            }, 750);
        }
    </script>
</body>

</html> `;
    
    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
};