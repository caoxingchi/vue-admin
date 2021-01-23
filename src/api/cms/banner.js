import request from '@/utils/request'

export default {

    //添加banner
    addBanner(crmBanner){
        return request({
            url:`/educms/banneradmin/addBanner`,
            method:'post',
            data:crmBanner
        })
    },

    //修改banner
    updateBanner(crmBanner){
        return request({
            url:`/educms/banneradmin/updateBanner`,
            method:'post',
            data:crmBanner
        })
    },
    //删除banner
    removeBanner(bannerId){
        return request({
            url:`/educms/banneradmin/delete/${bannerId}`,
            method:"delete"
        })
    },
    //获取banner
    getBannerById(bannerId){
        return request({
            url:`/educms/banneradmin/getBanner/${bannerId}`,
            method:'get'
        })
    },

    //分页管理
    pageBanner(current,limit){
        return request({
            url:`/educms/banneradmin/pageBanner/${current}/${limit}`,
            method:'post'
        })
    },

    //删除ossFile banner图片
    removeOssFileFromAli(fileName){
        return request({
            url:`/eduoss/fileoss/deleteOssFile?fileName=${fileName}`,
            method:'delete',
        })
    }


}