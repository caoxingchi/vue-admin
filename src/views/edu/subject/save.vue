<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag>
          <i class="el-icon-download"></i>
          <a :href="OSS_PATH">点击下载模板</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/edu-subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >{{ fileUploadBtnText }}</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OSS_PATH: process.env.OSS_PATH,
      BASE_API: process.env.BASE_API,
      fileUploadBtnText: "上传到服务器",
      importBtnDisabled: false,
      loading: false,
    };
  },
  created() {},
  methods: {
    //提交表单进行上传添加操作
    submitUpload() {
      this.fileUploadBtnText = "正在上传";
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },
    //添加成功
    fileUploadSuccess(resp) {
      if (resp.success === true) {
        this.fileUploadBtnText = "导入成功";
        this.loading = false;
        this.$message({
          type: "success",
          message: "添加课程分类成功",
        });
        this.redirectToList()//路由跳转
      }
    },
    //添加失败
    fileUploadError(err) {
      this.fileUploadBtnText = "导入失败";
      this.loading = false;
      this.$message({
        type: "error",
        message: "添加课程分类失败",
      });
    },
    redirectToList() {
      this.$router.push({ path: "/subject/list" }); //跳转页面
    },
  },
};
</script>
