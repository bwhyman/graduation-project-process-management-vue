# graduation-project-process-management-vue

### Update
#### 2024.05.22
小组成绩按总分排序。

#### 2024.01.04
学生上传文件请求添加摘要验证。  

#### 2024.01.02
允许学生上传多文件。学生可上传答辩PPT，答辩时在教师机系统直接下载文件，避免排队复制。  
教师在教师机登录，切换到学生下载文件功能，自动隐藏其他功能，避免学生操作看到分数。  
完成小组学生基于所有过程分数的总成绩统计。  
完成全部学生包含过程分数/单项分数的总成绩统计。  
改为组件加载时获取当前屏幕宽度，确定评分对话框尺寸，感觉无需一直动态监听消耗资源。   
升级各种依赖版本。

#### 2023.12.28
通过动态监听屏幕尺寸，适配移动端评分对话框。

#### 2023.10.06
添加反序列化响应拦截器。  
关闭弹窗。  
重新设计为同步组件。   

### Others
账号密码相同改完路由到修改密码视图。  

分组有点麻烦。规则很简单，学生平均分配到各组，导师学生不同组，组学生数平均。

但是，仅抽出学生随机插入其他组，每组数量无法控制；如果再判断当前插入组数量，会出现死循环，即某组占用另一组过多名额，致使其他组必须分配学生无法加入；还有学生数无法整除时各组名额等等限制。采用一种笨的方法。
