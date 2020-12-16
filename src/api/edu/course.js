import request from '@/utils/request'

export default {
    //publish course
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/edu-course/addCourseInfo`,
            method: 'post',
            data:courseInfo
        })
    }
}
