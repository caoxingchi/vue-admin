import request from '@/utils/request'

export default {
    //publish course
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/edu-course/addCourseInfo`,
            method: 'post',
            data:courseInfo
        })
    },
    //根据课程id获取课程信息
    getCourseInfo(courseId){
        return request({
            url:`/eduservice/edu-course/getCourseInfo/${courseId}`,
            method:'get'
        })
    },
    //更新课程信息
    updateCourseInfo(courseInfo){
        return request({
            url:"/eduservice/edu-course/updateCourseInfo",
            method:'post',
            data:courseInfo
        })
    }
}
