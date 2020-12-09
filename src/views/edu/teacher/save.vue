<template>
  <div class="app-container">
    <el-form
      ref="teacherForm"
      :model="teacher"
      label-width="120px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="teacher.name"
          placeholder="请输入讲师姓名"
          style="width: 45%"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number
          style="width: 45%"
          v-model="teacher.sort"
          :min="0"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select
          v-model="teacher.level"
          style="width: 45%"
          clearable
          placeholder="请选择"
        >
          <el-option label="高级讲师" :value="1" />
          <el-option label="首席讲师" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input
          v-model="teacher.career"
          style="width: 45%"
          placeholder="请输入讲师资历"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input
          v-model="teacher.intro"
          :rows="10"
          type="textarea"
          placeholder="请输入讲师简介"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="saveBtnDisabled"
          @click="submitForm('teacherForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import t from "@/api/edu/teacher";
export default {
  data() {
    return {
      teacher: {
        name: "",
        level: "",
        sort: 0,
        avatar: "",
        career: "",
        intro: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入讲师姓名", trigger: "blur" },
          {
            require: true,
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        level: [{ required: true, message: "请选择讲师头衔", trigger: "blur" }],
      },
      saveBtnDisabled: false,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherInfo(id);
    }
  },
  watch:{
      $route(to,from){//路由改变,此处是监听路由发生变化后进行相应的操作
        console.log("路由发生变化")
        this.resetData()
      }
  },
  methods: {
    //提交表单
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveBtnDisabled = true;
          //添加操作
          if (this.$route.params && this.$route.params.id) {
            //此处可以直接进行判断是否存在id if(!this.teacher.id)然后进行判断操作
            this.updateTeacher(this.teacher);
          } else {
            //修改操作
            this.addTeacher(this.teacher);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加讲师操作
    addTeacher() {
      t.addTeacher(this.teacher)
        .then((resp) => {
          console.log(resp);
          if (resp.success === true) {
            this.saveBtnDisabled = false; //将按键还原可以点击
            this.$message({
              //提示信息
              type: "success",
              message: resp.message,
            });
            this.resetData(); //清除表单
            this.redirectToList();
          } else {
            this.$message({
              //表单提交后有错误的显示
              type: "error",
              message: resp.message,
            });
            this.saveBtnDisabled = false;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.message,
          });
        });
    },
    //修改讲师操作
    updateTeacher() {
      t.editTeacher(this.teacher)
        .then((resp) => {
          if (resp.success === true) {
            this.saveBtnDisabled = false; //将按键还原可以点击
            this.$message({
              type: "success",
              message: resp.message,
            });
            this.resetData();
            this.redirectToList();
          } else {
            this.$message({
              type: "error",
              message: resp.message,
            });
            this.saveBtnDisabled = false;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.message,
          });
        });
    },
    //根据id获取讲师信息
    getTeacherInfo(id) {
      console.log("开始获取数据");
      t.getTeacherInfo(id)
        .then((resp) => {
          this.teacher = resp.data.teacher;
        })
        .catch(() => {
          console.log("此时为添加讲师");
        });
    },
    //重置表单
    resetData() {
      this.teacher = {};
    },
    redirectToList() {
      this.$router.push({ path: "/teacher/list" }); //跳转页面
    },
  },
};
</script>