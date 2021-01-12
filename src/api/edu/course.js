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
    },
    //获取将要发的信息
    getCoursePublishInfo(courseId){
        return request({
            url:`/eduservice/edu-course/getCoursePublishInfo/${courseId}`,
            method:'get'
        })
    },
    //发布课程
    publishCourse(courseId){
        return request({
            url:`/eduservice/edu-course/publishCourse/${courseId}`,
            method:'post'
        })
    },
    pageConditionListCourse(current,limit,courseQuery){
        return request({
            url:`/eduservice/edu-course/pageCourseCondition/${current}/${limit}`,
            method:'post',
            data:courseQuery
        })
    },
    //删除课程信息
    removeCourse(courseId){
        return request({
            url:`/eduservice/edu-course/removeCourse/${courseId}`,
            method:"delete"
        })
    }
}
