import request from '@/utils/request'

export default {
    //根据课程id来查询章节 小节视频
    getAllChapterVideoByCourseId(courseId) {
        return request({
            url: `/eduservice/edu-chapter/${courseId}`,
            method: 'get'
        })
    }
}