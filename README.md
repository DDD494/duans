# 轨道播报舱 · ORBITAL NEWS POD

一个全屏的"太空播报舱"网页：背景是缓缓自转的地球（卫星贴图）、四周是机械科技风边框，左侧漂浮着太空播报机器人，边框底边右侧摆着浇水壶与小植株，右上角是横向圆环式的新闻版块交互。

## 怎么访问

- **在线访问**：<https://DDD494.github.io/duans/>（GitHub Pages 已开启，推送到 `main` 后自动更新）
- 本地打开：双击 `index.html`（界面无需联网，版块配图需要联网）
- 想单独分享一个文件：用 `standalone.html`（样式与脚本已内联）

## 文件结构

```
index.html            页面结构
styles.css            全部样式与动画
app.js                全部交互逻辑
standalone.html       单文件版（样式 + 脚本内联）
assets/
  sky-milkyway.jpg    真实银河星空底图（ESO/S. Brunier，CC BY 4.0）
  earth-map.jpg       地球等距圆柱贴图（NASA Blue Marble，公有领域，经 Wikimedia Commons 获取）
  earth-clouds.png    真实卫星云层贴图（Solar System Scope，CC BY 4.0，源自 NASA 卫星数据）
  podcast-bot.png     机器人（透明底抠图，840 × 1169）
  shuihu-cut.png      浇水壶（透明底抠图）
  zhizhu-cut.png      小植株（透明底抠图）
  shuihu.png / zhizhu.png   上面两张的原图
```

素材来源与授权：

- 星空底图：ESO/S. Brunier 的银河全景（CC BY 4.0），经 Wikimedia Commons 获取
- 地球表面：NASA Blue Marble（公有领域），已重新调色为灰蓝色调
- 云层：[Solar System Scope](https://www.solarsystemscope.com/textures/)（CC BY 4.0，基于 NASA 卫星数据）

如用于商业发布，请保留以上署名。

## 页面构成

- 全屏窗口：标题栏 + 红黄绿圆点 + 音效 / 全屏按钮
- 机械科技风边框：四边金属横梁（拉丝纹理 + 拼板分缝）、内沿冷光、四角螺丝角板、底边左侧状态指示灯
- 地球背景：NASA 卫星贴图铺在一个巨大的球面上，屏幕只露出顶部的地平线弧；贴图横向缓慢滚动模拟自转，另有一层按不同速度飘动的云
- 太空：程序生成的星野（会闪烁、偶尔有流星）、星云、轨道上的小卫星
- 左侧：太空播报机器人（本地图片抠图），脚下有浮空装置：呼吸光晕、扩散气环、光柱、上浮微粒、地面光斑
- 边框底边右侧：小植株 + 浇水壶（本地图片抠图，缺失时自动回退内置矢量图）
- 右上：横向圆环新闻版块，8 个版块，每张卡片是该类型的照片 + 白色版块名

## 交互

- **圆环**：拖动 / 滚轮 / 键盘 ← → 切换版块，中间那张是当前版块（图片会自动缓慢推近）
- **播报**：点中间卡片或"播报"按钮，机器人逐条播报该版块新闻，最后补一句玩笑或生活化提醒
- **浇花**：点浇水壶，水滴落到罐子里，土壤湿度上升、小苗长高一级，机器人会顺势说一句
- **标题栏**：音效开关（默认关闭）、全屏

## 想改哪里

- 新闻版块、顺序、图片、文案：`app.js` 顶部的 `CATS` 数组（`img` 是该版块卡片图片，加载失败会自动回落到矢量插画）
- 配色、尺寸、动画节奏：`styles.css`
- 地球大小与自转速度：`.earth` 的 `width/height/bottom`（球体直径与露出高度）、`.earth__tex` 的 `animation` 时长（当前 320s 一圈）
- 地球显示的地带：`.earth__tex` 的 `background-size` 与 `background-position`（当前定位在贴图 22% 处 = 北纬约 50°，所以看到的是中纬度大陆）
- 机械边框粗细：`:root` 里的 `--fw`
- 摆件尺寸：`:root` 里的 `--jar-scale`（植株缩放）、`--can-w`（水壶，按植株比例算）
- 机器人位置与大小：`.robot` 的 `left / bottom / width`
- 脚下光圈位置：`.bot__halo / .bot__ripple` 的 `top`（当前 83%）
