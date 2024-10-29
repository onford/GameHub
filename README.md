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

开发者需注意目录`init`。该目录存放一个 sql 文件，用于生成所有后端涉及到的表格。**在进行开发之前，应该执行该 sql 脚本**。
> Mysql workbench 执行脚本的方法为，打开脚本，使用快捷键`Ctrl + Shift + Enter`。

当前存在的表格为：

PK: primary key
AI: auto_increment
NN: not null
FK: foreign key

Table: **userlist**
| 列名|类型|限制|
|:---:|:---:|:---:|
|username|varchar(255)|PK|
|username|varchar(255)|NN|

Table: **game_list**
| 列名|类型|限制|
|:---:|:---:|:---:|
|gamename|varchar(255)|PK|

Table: **comment_list**
| 列名|类型|限制|
|:---:|:---:|:---:|
|id|int|PK AI|
|username|varchar(255)|FK -> userlist(username)|
|gamename|varchar(255)|FK -> game_list(gamename)|
|comment|text|NN|



