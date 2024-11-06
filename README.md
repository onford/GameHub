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

开发者需注意目录`/www.csgamehub.hust.cn/init`。该目录存放一个 sql 文件，用于生成所有后端涉及到的表格。**在进行开发之前，应该执行该 sql 脚本**。
> Mysql workbench 执行脚本的方法为，打开脚本，使用快捷键`Ctrl + Shift + Enter`。

当前存在的表格为：

Table: **userlist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|accountnumber|varchar(127)|PK|
|username|varchar(127)|UQ|
|password|varchar(127)|NN|
|available_time|datetime|DEFAULT '2000-12-12 12:50:50'<br>NN|

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
|timestamps|datetime||

Table: **gamescorelist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|username|varchar(127)|FK -> userlist(username)|
|gamename|varchar(127)|FK -> game_list(gamename)|
|highest_score|int |DEFAULT NULL<br>UN|

PK = (username,gamename)

Table: **likelist,unlikelist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|username   |varchar(127)|FK -> userlist(username)|
|comment_id |int|FK -> comment_list(id)|

PK = (username,comment_id)

Table: **newgame_list**
| 列名          | 类型           | 限制                      |
| :-----------: | :-----------: | :-----------------------: |
| newgame_id    | int           | PK AI                     |
| username      | varchar(127)  | FK -> userlist(username)  |
| newgame_name  | varchar(127)  |                           |
| status        | tinyint       |                           |
| version       | int           |                           |
|uploadtime     | datetime      |                           |



Table: **message_list**

| 列名                  | 类型         | 限制                          |
| :-------------------: | :----------: | :---------------------------: |
| message_id            | int          | PK AI                         |
| message_type          | tinyint      | NN                            |
| message_title         | varchar(127) | NN                            |
| timestamps            | datetime     | NN                            |
| recognize_id          | int          | DEFAULT NULL                  |
| status                | tinyint      | DEFAULT 0                     |
| receive_accountnumber | varchar(127) | FK -> userlist(accountnumber) |



Table: **content_list**

|      列名       | 类型 |              限制              |
| :-------------: | :--: | :----------------------------: |
|  recognize_id   | int  | FK -> newgame_list(newgame_id) |
| message_content | text |               NN               |



其中限制条件的缩写分别是  
PK: primary key  
AI: auto_increment  
NN: not null  
FK: foreign key（所有外码在参照对象被删除/修改时，会采取级联删除/修改的策略——`on delete cascade`以及`on update cascade`）  
UN: unsigned  
UQ: unique

### 关于样式库
直接使用 cdn 引入会受到网络质量的影响，建议直接将代码下载到本地。样式库位于`/www.csgamehub.hust.cn/src/vendor`。