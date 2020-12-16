import request from '@/utils/request'

export default {
    //列出课程
    listSubjectTree() {
        return request({
            url: `/eduservice/edu-subject/listSubjectTree`,
            method: 'get',
        })
    },
}
