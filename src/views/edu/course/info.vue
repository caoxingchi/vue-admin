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
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          style="width: 60%"
          :file-list="coverList"
          :action="BASE_API + '/eduoss/fileoss/uploadFile/picture'"
          :on-success="handlerCoverSuccess"
          :before-upload="beforeUpload"
          :before-remove="handleBeforeReomve"
          :on-remove="handleRemove"
          :limit="1"
          :auto-upload="true"
          list-type="picture-card"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          </div>
        </el-upload>
        <img :src="courseInfo.cover" style="width: 50%; height: 50%" />
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
import Tinymce from "@/components/Tinymce"; //引入组件

export default {
  components: { Tinymce }, //声明组件
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
      courseId: "",
      doUpdateCourseInfo: false, //是否是更新 默认是false
      teacherList: [],
      subjectList: [],
      coverList: [],
      cover: {}, //用于回显图片的对象
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
    if (this.$route.params && this.$route.params.id) {
      this.doUpdateCourseInfo = true; //假如路径上有id 则就把该值修改为true 此时为修改操作页面
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    } else {
      this.getFirSubject(); //获取一级分类的所有数据
      this.getTeacherList(); //获取讲师的所有信息
    }
  },
  watch: {
    $route(to, from) {
      //路由改变,此处是监听路由发生变化后进行相应的操作
      console.log("路由发生变化");
      this.resetData();
    },
  },
  methods: {

     //移除图片
    handleBeforeReomve(file) {
      return this.$confirm(`是否移除该图片${file.name}？`);
    },
    handleRemove() {
      if(this.cover.url!=null||this.cover.url!=""){
        this.cover={}
        this.courseInfo.cover=""
      }
    },
    //重置表单
    resetData() {
      this.courseInfo = {};
      this.courseId = "";
    },
    saveOrUpdate(form) {
      console.log("进入表单验证" + this.$refs[form]);
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log("next to chapter");
          if (this.doUpdateCourseInfo) {
            this.updateCourseInfo(); //更新课程信息
          } else {
            this.saveCourseInfo(); //保存课程信息
          }
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
    //获取课程的信息
    getCourseInfo() {
      course.getCourseInfo(this.courseId).then((resp) => {
        this.courseInfo = resp.data.courseInfo;
        this.echoImage(); //回显图片
        console.log("sasfaf" + this.courseInfo.subjectParentId);
        //获取一级分类

        subject.listSubjectTree().then((resp) => {
          console.log("进入进行树型展示");
          this.firSubjectList = resp.data.list;
          console.log("firSubjectList=" + this.firSubjectList);
          this.firSubjectList.forEach((subject) => {
            console.log("sasfaf" + this.courseInfo.subjectParentId);
            if (subject.id == this.courseInfo.subjectParentId) {
              this.secSubjectList = subject.children;
            }
          });
        });
        this.getTeacherList();
      });
    },
    //更新课程信息
    updateCourseInfo() {
      course
        .updateCourseInfo(this.courseInfo)
        .then((resp) => {
          if (resp.success === true) {
            this.$message({
              type: "success",
              message: "修改课程信息成功",
            });
            this.$router.push({ path: `/course/chapter/${this.courseId}` }); //跳转页面
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "修改课程信息失败",
          });
        });
    },
    //保存课程信息
    saveCourseInfo() {
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
        .catch((err) => {
          this.$message({
            type: "error",
            message: "修改课程信息失败",
          });
        });
    },
    //成功上传封面
    handlerCoverSuccess(res, file) {
      console.log(res); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
      if (res.success === true) {
        this.courseInfo.cover = res.data.url;
      }
    },
    //在上传之前
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    //回显图片
    echoImage() {
      this.coverList = [];
      this.cover.url = this.courseInfo.cover;
      this.coverList.push(this.cover);
    },
  },
};
</script>
