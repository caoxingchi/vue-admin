<template>
  <div class="app-container">
    <!-- 行内表单进行查询操作 -->
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseQuery.title" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="courseQuery.status" clearable placeholder="状态">
          <el-option label="已发布" :value="normal" />
          <el-option label="未发布" :value="draft" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          placeholder="选择开始时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="截止时间">
        <el-date-picker
          v-model="courseQuery.end"
          placeholder="选择截止时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getCourseListByCondition()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" stripe fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          {{ (current - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="250" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope"
          ><!-- scope是每行的内容 -->
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="viewCount" label="浏览数量" width="160" />
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <br />
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"
              >编辑课程大纲</el-button
            >
          </router-link>
          <br />
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除课程信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="current"
      :page-size="limit"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getByCurrent"
      @size-change="getBySize"
    >
    </el-pagination>
  </div>
</template>

<script>
import course from "@/api/edu/course";
export default {
  data() {
    return {
      list: null,
      current: 1, //当前页
      limit: 10, //每页记录数
      total: 0, //总记录数
      courseQuery: {
        title: "",
        status: "",
      },
      normal:'Normal',
      draft:'Draft'
    };
  },
  created() {
    this.getCourseListByCondition();
  },
  methods: {
    /* ================================================================ */
    /* 
    解决当改变current和页面的size的数据的获取操作
    */
    getByCurrent(current = 1) {
      this.current = current;
      this.getCourseListByCondition();
    },
    getBySize(limit = 10) {
      this.limit = limit;
      this.getCourseListByCondition();
    },
    /* =========================================================== */

    /* 
      根据条件查询 获取数据
    */
    getCourseListByCondition() {
      course
        .pageConditionListCourse(this.current, this.limit, this.courseQuery)
        .then((resp) => {
          this.list = resp.data.list;
          this.total = resp.data.total;
          console.log(this.list);
          console.log(this.total);
        }).catch(err=>{
          this.$message({
            type:'error',
            message:"获取数据失败"
          })
        });
    },
    resetData() {
      this.courseQuery = {};
      this.getCourseListByCondition()
    },
    removeDataById(id) {
      this.$confirm("是否删除该课程？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        course
          .removeCourse(id)
          .then((resp) => {
            if (resp.success === true) {
              this.getCourseListByCondition()
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败!",
              });
            }
          })
          .catch((err)=>{
              console.log(err)
          })
        //this.getList();
        //console.log(resp.data.success);
      }).catch(()=>{
          console.log("取消删除")
      })
    },
  },
};
</script>

<style></style>
