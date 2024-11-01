-- 在执行该脚本之前，请各维护者记录好旧表中的内容，将其注入 sql 中或者在网站中通过图形化接口恢复数据。 

drop database if exists softwareproject;
create database softwareproject;

use softwareproject;


drop table if exists userlist;
create table userlist(
    username varchar(127) primary key,
    `password` varchar(127) not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


drop table if exists game_list;
create table game_list(
    gamename varchar(127) primary key
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

drop table if exists comment_list;
create table comment_list(
    id int auto_increment primary key,
    username varchar(127),
    gamename varchar(127),
    `comment` text not null,
    reference_id int default null,
    root_id int default null,
    likes int default 0,
    unlikes int default 0,
    `timestamps` datetime,
    foreign key(username) references userlist(user_name),
    foreign key(gamename) references game_list(gamename),
    foreign key(reference_id) references comment_list(id),
    foreign key(root_id) references comment_list(id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

drop table if exists gamescorelist;
create table gamescorelist(
    username varchar(127),
    gamename varchar(127),
    highest_score int unsigned default null,
    primary key(username,gamename),
    foreign key(username) references userlist(user_name),
    foreign key(gamename) references game_list(gamename)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- 下面代码用于加载 game_list，这是一个相对固定的表
insert into game_list values ('2048'),('senpai');




