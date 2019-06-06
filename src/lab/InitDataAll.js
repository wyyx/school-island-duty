function InitDataAll(){

    db.transaction(function (context) {

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8888/w/pad/test",
            dataType: "json",
            async:false,
            contentType: "application/json;charset=UTF-8",
            success: function(data) {
                if (data == null) {
                    alert('数据获取失败，请检查网络');
                    return;
                }

                /*创建表*/
                context.executeSql('CREATE TABLE "school" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"school_id" INTEGER,"school_name" text(100));');
                context.executeSql('CREATE TABLE "class" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"class_id" INTEGER,"school_id" INTEGER,"grade" TEXT,"name" TEXT);');
                context.executeSql('CREATE TABLE "duty_check_item_config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_item_config_id" integer,"school_id" integer,"check_name" TEXT(50),"check_score" real(8,3),"description" TEXT,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);');
                context.executeSql('CREATE TABLE "duty_check_sub_item_config" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_check_sub_item_config_id" INTEGER,"school_id" INTEGER,"duty_check_item_config_id" INTEGER,"name" TEXT,"priority" integer,"description" TEXT,"score" real,"create_time" TEXT,"update_time" TEXT,"deleted" integer DEFAULT 0);');
                context.executeSql('CREATE TABLE "config" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"key" text(50) NOT NULL,"val" TEXT(200) NOT NULL,"del" integer DEFAULT 0);');
                context.executeSql('CREATE TABLE "duty_score_history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"uuid" text,"school_id" INTEGER,"class_id" INTEGER,"class_name" TEXT,"check_id" INTEGER,"check_name" TEXT,"check_sub_id" INTEGER,"check_sub_name" TEXT,"change_score" TEXT,"remarks" TEXT,"executor_id" integer,"executor_name" TEXT,"is_media" integer,"autograph" TEXT,"status" integer DEFAULT 0,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);');
                context.executeSql('CREATE TABLE "duty_media" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"duty_history_id" INTEGER,"type" integer,"media_address" TEXT,"create_time" TEXT,"update_time" text,"deleted" integer DEFAULT 0);');

                /*添加学校数据*/
                context.executeSql(`INSERT INTO school(school_id,school_name) VALUES(${data.content.schoolId},"${data.content.schoolName}")`);

                var classes = data.content.classes;
                if (classes != null) {
                    for (var i=0; i<classes.length; i++) {
                        var sql = `INSERT INTO class(class_id,school_id,grade,name) VALUES(${classes[i].id},${classes[i].schoolId},"${classes[i].grade}","${classes[i].name}")`;
                        console.log(sql);
                        context.executeSql(sql);
                    }
                }

                var checkItems = data.content.checkItems;
                var date = timeStamp2String(new Date().getTime());
                if (checkItems != null) {
                    for (var i=0; i<checkItems.length; i++) {
                        var sql = `INSERT INTO duty_check_item_config(duty_check_item_config_id,school_id,check_name,check_score,description,create_time,update_time) VALUES(${checkItems[i].id},${checkItems[i].schoolId},"${checkItems[i].checkName}",${checkItems[i].checkScore},"${checkItems[i].description}","${date}","${date}")`;
                        console.log(sql);
                        context.executeSql(sql);
                    }
                }

                var subCheckItems = data.content.subCheckItems;
                if (subCheckItems != null) {
                    for (var i=0; i<subCheckItems.length; i++) {
                        var sql = `INSERT INTO duty_check_sub_item_config(duty_check_sub_item_config_id,school_id,duty_check_item_config_id,name,priority,description,score,create_time,update_time) VALUES(${subCheckItems[i].id},${subCheckItems[i].schoolId},${subCheckItems[i].dutyCheckItemConfigId},"${subCheckItems[i].name}",${subCheckItems[i].priority},"${subCheckItems[i].description}",${subCheckItems[i].score},"${date}","${date}")`;
                        console.log(sql);
                        context.executeSql(sql);
                    }
                }

                var h = data.content.dutyScoreHistory;
                if (h != null){
                    for (var i = 0;i<h.length;i++){
                        var sql = `INSERT INTO duty_score_history(uuid,school_id,class_id,check_id,check_name,check_sub_id,check_sub_name,change_score,is_media,status,create_time) VALUES("${h[i].uuid}",${h[i].schoolId},${h[i].classId},${h[i].checkId},"${h[i].checkName}",${h[i].checkSubId},"${h[i].checkSubName}",${h[i].changeScore},1,0,"${h[i].createTime}")`;
                        console.log(sql);
                        context.executeSql(sql);
                    }
                }

                var m = data.content.dutyMedia;
                if (m != null){
                    for (var i = 0;i<m.length;i++) {
                        var sql = `INSERT INTO duty_media(duty_history_id,type,media_address,create_time) VALUES(${m[i].dutyHistoryId},1,"${m[i].mediaAddress}","${m[i].createTime}")`;
                        console.log(sql);
                        context.executeSql(sql);
                    }
                }

            }
        });

    }  , function (error) {
        console.log('获取所有数据失败[' + error.message + ']');
    }, function () {
        console.log('获取所有数据成功');
    });
}

function DropTable() {//删除表
    db.transaction(function (context) {
        context.executeSql('DROP TABLE class');
        context.executeSql('DROP TABLE config');
        context.executeSql('DROP TABLE duty_check_sub_item_config');
        context.executeSql('DROP TABLE duty_media');
        context.executeSql('DROP TABLE duty_check_item_config');
        context.executeSql('DROP TABLE duty_score_history');
        context.executeSql('DROP TABLE school');
    }, function (error) {
        console.log('删除表失败:[' + error.message + ']');
    }, function () {
        console.log('删除表成功');
    });
}
