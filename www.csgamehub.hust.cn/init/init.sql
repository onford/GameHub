-- 在执行该脚本之前，请各维护者记录好旧表中的内容，将其注入 sql 中或者在网站中通过图形化接口恢复数据。 

drop database if exists softwareproject;
create database softwareproject;

use softwareproject;


drop table if exists userlist;
create table userlist(
	username varchar(255) primary key,
    `password` varchar(255) not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


drop table if exists game_list;
create table game_list(
	gamename varchar(255) primary key
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

drop table if exists comment_list;
create table comment_list(
	id int auto_increment primary key,
	username varchar(255),
    gamename varchar(255),
    `comment` text not null,
     foreign key(username) references userlist(user_name),
     foreign key(gamename) references game_list(gamename)
);


-- 下面代码用于加载 game_list，这是一个相对固定的表
insert into game_list values ('2048'),('senpai');




