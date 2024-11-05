-- 在执行该脚本之前，请各维护者记录好旧表中的内容，将其注入 sql 中或者在网站中通过图形化接口恢复数据。 

drop database if exists softwareproject;
create database softwareproject;

use softwareproject;

create table userlist(
    accountnumber varchar(127) primary key,
    username varchar(127) unique,
    `password` varchar(127) not null,
    available_time datetime not null default '2000-12-12 12:50:50'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table game_list(
    gamename varchar(127) primary key
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table comment_list(
    id int auto_increment primary key,
    username varchar(127),
    gamename varchar(127),
    `comment` text not null,
    reference_id int default null,
    root_id int default null,
    `timestamps` datetime,
    foreign key(username) references userlist(username) on delete cascade on update cascade,
    foreign key(gamename) references game_list(gamename) on delete cascade on update cascade,
    foreign key(reference_id) references comment_list(id) on delete cascade on update cascade,
    foreign key(root_id) references comment_list(id) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table gamescorelist(
    username varchar(127),
    gamename varchar(127),
    highest_score int unsigned default null,
    primary key(username,gamename),
    foreign key(username) references userlist(username) on delete cascade on update cascade,
    foreign key(gamename) references game_list(gamename) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table likelist(
    username varchar(127),
    comment_id int,
    primary key(username,comment_id),
    foreign key(username) references userlist(username) on delete cascade on update cascade,
    foreign key(comment_id) references comment_list(id) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table unlikelist(
    username varchar(127),
    comment_id int,
    primary key(username,comment_id),
    foreign key(username) references userlist(username) on delete cascade on update cascade,
    foreign key(comment_id) references comment_list(id) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table newgame_list(
    newgame_id int primary key auto_increment, -- 新游戏id，用户提交的压缩包将按照这个命名
    username varchar(127),
    newgame_name varchar(127),
    `status` tinyint, -- 0 待审核 | 1 通过 | 2 打回
    `version` int,
    uploadtime datetime,
    foreign key(username) references userlist(username) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `message_list` (
  `message_id` int primary key auto_increment,
  `message_type` tinyint NOT NULL,
  `message_title` varchar(127) NOT NULL,
  `timestamps` datetime NOT NULL,
  `recognize_id` int DEFAULT NULL,
  `status` tinyint default 0,
  `receive_accountnumber` varchar(127) references userlist(accountnumber) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- 下面代码用于加载 game_list，这是一个相对固定的表
insert into game_list values ('2048'),('senpai');




