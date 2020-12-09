import request from '@/utils/request'

export default {
    //讲师列表，条件查询
    getTeacherPage(current,limit,teacherQuery){
        return request({
            url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //使用data将数据转换成json传递到接口里面
            data:teacherQuery
          })
    },
    removeTeacherById(id){
        return request({
            url:`/eduservice/edu-teacher/deleteTeacher/${id}`,
            method:'delete',
        })
    },
    //保存讲师信息
    addTeacher(teacher){
        return request({
            url:'/eduservice/edu-teacher/addTeacher',
            method:'post',
            data:teacher
        })
    },
    //修改讲师信息
    editTeacher(teacher){
        return request({
            url:'/eduservice/edu-teacher/updateTeacher',
            method:'post',
            data:teacher
        })
    },
    //获取讲师信息
    getTeacherInfo(id){
        return request({
            url:`/eduservice/edu-teacher/findTeacher/${id}`,
            method:'get'
        })
    }
}
