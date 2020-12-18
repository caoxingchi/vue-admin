import request from '@/utils/request'

export default {
    //根据课程id来查询章节 小节视频
    getAllChapterVideoByCourseId(courseId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },
    //添加章节的操作
    addChapter(chapter){
        return request({
            url:'/eduservice/edu-chapter/addChapter',
            method:'post',
            data:chapter
        })
    },
    //根据id查询章节
    getChapterInfo(chapterId){
        return request({
            url:`/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
            method:'get'
        })
    },
    //修改章节操作
    updateChapter(chapter){
        return request({
            url:'/eduservice/edu-chapter/updateChapter',
            method:'post',
            data:chapter
        })
    },

    //删除章节操作
    deleteChapter(chapterId){
        return request({
            url:`/eduservice/edu-chapter/deleteChapter/${chapterId}`,
            method:'delete'
        })
    }
}