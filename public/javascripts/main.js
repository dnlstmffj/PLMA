
var reasons = [], curReasonID, curStudentID, curTeacherID;
function fechar(){
	document.getElementById('popup').style.display = 'none';
	document.getElementById('mask').style.display = 'none';
}
	
function loading(){
	document.getElementById('popup').style.display = 'block';
    document.getElementById('mask').style.display = 'block';
    $.ajax({
        url: '/get_reasons',
        type : "POST"
    }).done(function(results) {
        for(i=0; i<results.length; i++) {
            reasons[results[i].id] = new Array();
            reasons[results[i].id][0] = results[i].title;
            reasons[results[i].id][1] = results[i].plus;
            reasons[results[i].id][2] = results[i].minus;
        }
    });
}
function getUser() {
    var grade = document.getElementById('grade').value;
    var _class = document.getElementById('class').value;
    var num = document.getElementById('num').value;
    var mp = document.getElementById('mp').value;
    var lp = document.getElementById('lp').value;
    var mm = document.getElementById('mm').value;
    var lm = document.getElementById('lm').value;
    var ms = document.getElementById('ms').value;
    var ls = document.getElementById('ls').value;
    $.ajax({
        url: '/get_user',
        type : "POST",
        data : {
            grade:grade,
            class:_class,
            num:num,
            mp:mp,
            lp:lp,
            mm:mm,
            lm:lm,
            ms:ms,
            ls:ls
        }
    }).done(function(results) {
        console.log(results);
        setTimeout ("fechar()", 1100);
        setTimeout ("table.draw()", 1000);
        loading();
        table.clear();
        for(var i=0; i<results.length; i++) {
            table.row.add([results[i].grade, results[i].class, results[i].num, results[i].name, results[i].plus, results[i].minus, results[i].plus - results[i].minus]);
        }
        
    });
}

function autoSet() {
    var curReason = document.getElementById('reason').value * 1;
    document.getElementById('plus').value = reasons[curReason][1];
    document.getElementById('minus').value = reasons[curReason][2];
    return;

}
function addApply() {
    var grade = document.getElementById('grade').value;
    var _class = document.getElementById('class').value;
    var num = document.getElementById('num').value;
    var plus = document.getElementById('plus').value;
    var minus = document.getElementById('minus').value;
    var reason = document.getElementById('reason').value;
    table.row.add([grade, _class, num, plus, minus, reason]);
    table.draw();
    document.getElementById('grade').value = "";
    document.getElementById('class').value = "";
    document.getElementById('num').value = "";
    document.getElementById('plus').value = "";
    document.getElementById('minus').value = "";
    document.getElementById('grade').focus()
}

function deleteHistory(id) {
    var isConfirm = confirm("정말 삭제하시겠습니까?");
    if(!isConfirm){
        return ;
    }
    $.ajax({
        url: '/delete_history',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
    
        alert("삭제되었습니다.")
        window.location.reload();
        
    });
}

function addReason() {
    var title = document.getElementById('newReasonDialogReason').value;
    var plus = document.getElementById('newReasonDialogPlus').value;
    var minus = document.getElementById('newReasonDialogMinus').value;
    $.ajax({
        url: '/add_reason',
        type : "POST",
        data : {
            title: title,
            plus: plus,
            minus: minus
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}

function editReason() {
    var title = document.getElementById('editReasonDialogReason').value;
    var plus = document.getElementById('editReasonDialogPlus').value;
    var minus = document.getElementById('editReasonDialogMinus').value;
    $.ajax({
        url: '/edit_reason',
        type : "POST",
        data : {
            id: curReasonID,
            title: title,
            plus: plus,
            minus: minus
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}

function deleteReason(id) {
    var isConfirm = confirm("정말 삭제하시겠습니까?");
    if(!isConfirm) return ;
    
    $.ajax({
        url: '/delete_reason',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
    
        alert("삭제되었습니다.")
        window.location.reload();
        
    });
}

function getReason(id) {
    
    var title = document.getElementById('editReasonDialogReason');
    var plus = document.getElementById('editReasonDialogPlus');
    var minus = document.getElementById('editReasonDialogMinus');
    $.ajax({
        url: '/get_reason',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
        curReasonID = results[0].id;
        title.value = results[0].title;
        plus.value = results[0].plus;
        minus.value = results[0].minus;
    });
}

function addStudent() {
    var stuid = document.getElementById('newStudentDialogStuid').value;
    var grade = document.getElementById('newStudentDialogGrade').value;
    var _class = document.getElementById('newStudentDialogClass').value;
    var num = document.getElementById('newStudentDialogNum').value;
    var name = document.getElementById('newStudentDialogName').value;
    $.ajax({
        url: '/add_student',
        type : "POST",
        data : {
            stuid: stuid,
            grade: grade,
            class: _class,
            num: num,
            name: name
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}
function deleteStudent(id) {
    var isConfirm = confirm("정말 삭제하시겠습니까?");
    if(!isConfirm) return ;
    
    $.ajax({
        url: '/delete_student',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
    
        alert("삭제되었습니다.")
        window.location.reload();
        
    });
}
function getStudent(id) {
    var stuid = document.getElementById('editStudentDialogStuid');
    var grade = document.getElementById('editStudentDialogGrade');
    var _class = document.getElementById('editStudentDialogClass');
    var num = document.getElementById('editStudentDialogNum');
    var name = document.getElementById('editStudentDialogName');
    var plus = document.getElementById('editStudentDialogPlus');
    var minus = document.getElementById('editStudentDialogMinus');
    $.ajax({
        url: '/get_student',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
        curStudentID = results[0].id;
        stuid.value = results[0].stuid;
        grade.value = results[0].grade;
        _class.value = results[0].class;
        num.value = results[0].num;
        name.value = results[0].name;
        plus.value = results[0].plus;
        minus.value = results[0].minus;
    });
}

function editStudent() {
    var stuid = document.getElementById('editStudentDialogStuid').value;
    var grade = document.getElementById('editStudentDialogGrade').value;
    var _class = document.getElementById('editStudentDialogClass').value;
    var num = document.getElementById('editStudentDialogNum').value;
    var name = document.getElementById('editStudentDialogName').value;
    var plus = document.getElementById('editStudentDialogPlus').value;
    var minus = document.getElementById('editStudentDialogMinus').value;

    $.ajax({
        url: '/edit_student',
        type : "POST",
        data : {
            id: curStudentID,
            stuid: stuid,
            grade: grade,
            class: _class,
            num: num,
            name: name,
            plus: plus,
            minus: minus
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}

function addTeacher() {
    var name = document.getElementById('newTeacherDialogName').value;
    var job = document.getElementById('newTeacherDialogJob').value;
    var password = document.getElementById('newTeacherDialogPassword').value;
    $.ajax({
        url: '/add_teacher',
        type : "POST",
        data : {
            name:name,
            job:job,
            password: password
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}

function getTeacher(id) {
    
    var name = document.getElementById('editTeacherDialogName');
    var job = document.getElementById('editTeacherDialogJob');
    var password = document.getElementById('editTeacherDialogPassword');

    $.ajax({
        url: '/get_teacher',
        type : "POST",
        data : {
            id: id
        }
    }).done(function(results) {
        curTeacherID = results[0].id;
        name.value = results[0].name;
        job.value = results[0].job;
        password.value = "INPUTPASSWORD";
        
    });
}

function deleteTeacher(id) {
    var isConfirm = confirm("정말 삭제하시겠습니까?");
    if(!isConfirm) return ;
    
    $.ajax({
        url: '/delete_teacher',
        type : "POST",
        data : {
            id:id
        }
    }).done(function(results) {
    
        alert("삭제되었습니다.")
        window.location.reload();
        
    });
}

function editTeacher() {
    var name = document.getElementById('editTeacherDialogName').value;
    var job = document.getElementById('editTeacherDialogJob').value;
    var password = document.getElementById('editTeacherDialogPassword').value;


    $.ajax({
        url: '/edit_teacher',
        type : "POST",
        data : {
            id: curTeacherID,
            name: name,
            job: job,
            password: password
        }
    }).done(function(results) {
    
        alert("정상적으로 처리되었습니다.")
        window.location.reload();
        
    });
}

setTimeout ("fechar()", 500);
loading();