# GameHub

### 介绍
该仓库是华中科技大学软件工程的项目文件仓库，项目旨在实现一个游戏网站平台，重温童年经典。

### 数据库

- 登录信息

```php
"serverName" => "localhost",
"username" => "root",
"password" => "114514",
```



- SQL 文件

开发者需注意目录`www.csgamehub.hust.cn/init`。该目录存放一个 sql 文件，用于生成所有后端涉及到的表格。**在进行开发之前，应该执行该 sql 脚本**。
> Mysql workbench 执行脚本的方法为，打开脚本，使用快捷键`Ctrl + Shift + Enter`。

当前存在的表格为：

Table: **userlist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|username|varchar(127)|PK|
|username|varchar(127)|NN|

Table: **game_list**
| 列名|类型|限制|
|:---:|:---:|:---:|
|gamename|varchar(127)|PK|

Table: **comment_list**
| 列名|类型|限制|
|:---:|:---:|:---:|
|id|int|PK AI|
|username|varchar(127)|FK -> userlist(username)|
|gamename|varchar(127)|FK -> game_list(gamename)|
|comment|text|NN|
|reference_id|int|DEFAULT NULL<br>FK -> comment_list(id)|
|root_id|int|DEFAULT NULL<br>FK -> comment_list(id)|
|likes|int|DEFAULT 0|
|unlikes|int|DEFAULT 0|
|timestamps|datetime||

Table: **gamescorelist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|username|varchar(127)|FK -> userlist(username)|
|gamename|varchar(127)|FK -> game_list(gamename)|
|highest_score|int |DEFAULT NULL<br>UN|

PK = (username,gamename)
 
其中限制条件的缩写分别是  
PK: primary key  
AI: auto_increment  
NN: not null  
FK: foreign key  
UN: unsigned

### 关于样式库
直接使用 cdn 引入会受到网络质量的影响，建议直接将代码下载到本地。样式库位于`/www.csgamehub.hust.cn/src/vendor`。