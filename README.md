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



- 表格

```sql
CREATE DATABASE `softwareproject` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `comment_list` (
  `username` varchar(255) NOT NULL,
  `gamename` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;


CREATE TABLE `game_list` (
  `game_name` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



CREATE TABLE `gamescorelist` (
  `username` varchar(50) NOT NULL,
  `gamename` varchar(50) NOT NULL,
  `highest_score` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `userlist` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`username`,`password`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

```

