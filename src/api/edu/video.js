import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video){
        return request({
            url:'/eduservice/edu-video/addVideo',
            method:"post",
            data:video
        })
    },
    //获取小节信息
    getVideoInfo(videoId){
        return request({
            url:`/eduservice/edu-video/getVideoInfo/${videoId}`,
            method:'get',
        })
    },
    //更新小节信息
    updateVideo(video){
        return request({
            url:'/eduservice/edu-video/updateVideo',
            method:'post',
            data:video
        })
    },
    //删除整个小节
    deleteVideo(videoId){
        return request({
            url:`/eduservice/edu-video/deleteVideo/${videoId}`,
            method:'delete',
        })
    },
    //删除单独的视频小节部分
    deleteVideoFromAli(videoSourceId){
        return request({
            url:`/eduvod/video/deleteVideo/${videoSourceId}`,
            method:'delete'
        })
    }

}