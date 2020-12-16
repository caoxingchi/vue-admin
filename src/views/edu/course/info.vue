<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-form
      label-width="120px"
      style="width: 85%"
      :model="courseInfo"
      :rules="rules"
      ref="courseForm"
      class="demo-ruleForm"
    >
      <el-form-item label="课程标题" prop="title">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类" prop="subjectId">
        <el-select
          v-model="courseInfo.subjectParentId"
          clearable
          filterable
          style="width: 49%"
          @change="getSecSubject"
          placeholder="一级分类"
        >
          <el-option
            v-for="subject in firSubjectList"
            :label="subject.title"
            :key="subject.id"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          clearable
          filterable
          style="width: 49%"
          placeholder="二级分类"
        >
          <el-option
            v-for="subject in secSubjectList"
            :label="subject.title"
            :key="subject.id"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师" prop="teacherId">
        <el-select
          v-model="courseInfo.teacherId"
          clearable
          filterable
          style="width: 60%"
          placeholder="请选择"
        >
          <el-option
            v-for="teacher in teacherList"
            :label="teacher.name"
            :key="teacher.id"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          style="width: 60%"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介" prop="description">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          style="width: 60%"
          class="avatar-uploader"
          :show-file-list="false"
          :action="BASE_API + '/eduoss/fileoss/uploadFile'"
          :on-success="handlerCoverSuccess"
          :before-upload="beforeUpload"
        >
          <img :src="courseInfo.cover" style="width: 75%; height:75%" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          style="width: 60%"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate('courseForm')"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import teacher from "@/api/edu/teacher";
import subject from "@/api/edu/subject";
import Tinymce from '@/components/Tinymce';//引入组件

export default {
  components:{Tinymce},//声明组件
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: "",
        subjectId: "",
        teacherId: "",
        subjectParentId: "", //一级分类
        lessonNum: 0,
        description: "",
        cover: "https://itcolors-edu.oss-cn-hangzhou.aliyuncs.com/default.png",
        price: 0,
      },
      teacherList: [],
      subjectList: [],
      firSubjectList: [], //一级分类
      secSubjectList: [], //二级分类
      BASE_API: process.env.BASE_API, //获取url地址
      rules: {
        title: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        description: [{ required: true, message: "请输入课程描述", trigger: "blur" }],
        teacherId: [{ required: true, message: "请选择讲师", trigger: "blur" }],
        subjectId: [{ required: true, message: "请选择课程分类", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getFirSubject(); //获取一级分类的所有数据
    this.getTeacherList(); //获取讲师的所有信息
  },
  methods: {
    saveOrUpdate(form) {
      console.log("进入表单验证" + this.$refs[form]);
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log("next to chapter");
          course
            .addCourseInfo(this.courseInfo)
            .then((resp) => {
              if (resp.success === true) {
                this.$message({
                  type: "success",
                  message: "添加课程信息成功",
                });
                this.$router.push({ path: `/course/chapter/${resp.data.courseId}` }); //跳转页面
              }
            })
            .catch();
        } else {
          console.log("submit error!");
          return false;
        }
      });
    },

    //获取课程的list
    getFirSubject() {
      subject.listSubjectTree().then((resp) => {
        console.log("获取一级分类的信息");
        this.firSubjectList = resp.data.list;
      });
    },
    getSecSubject(id) {
      console.log("parentId=" + id);
      this.secSubjectList = "";
      this.firSubjectList.forEach((subject) => {
        if (subject.id === id) {
          this.secSubjectList = subject.children;
          this.courseInfo.subjectId = "";
        }
      });
    },
    //获取讲师的list
    getTeacherList() {
      teacher.getAllTeachers().then((resp) => {
        this.teacherList = resp.data.eduTeachers;
      });
    },

    //成功上传封面
    handlerCoverSuccess(res, file) {
      console.log(res); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
      this.courseInfo.cover = res.data.url;
    },
    //在上传之前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
