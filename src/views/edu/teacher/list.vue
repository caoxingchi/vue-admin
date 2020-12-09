<template>
  <div class="app-container">
    <!-- 行内表单进行查询操作 -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="讲师人">
        <el-input v-model="teacherQuery.name" placeholder="讲师人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="讲师头衔"
        >
          <el-option label="高级讲师" :value="1" />
          <el-option label="首席讲师" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          placeholder="选择开始时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="截止时间">
        <el-date-picker
          v-model="teacherQuery.end"
          placeholder="选择截止时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()"
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
      <el-table-column prop="name" label="姓名" width="80" />
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope"
          ><!-- scope是每行的内容 -->
          {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >修改</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-edit"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>
<script>
import teacher from "@/api/edu/teacher";
export default {
  //写代码核心部分
  /* data:{

    }, */
  data() {
    //定义变量和初始值

    return {
      list: null, //查询之后返回的list集合
      current: 1, //当前页
      limit: 10, //每页记录数
      total: 0, //总记录数
      teacherQuery: {
        name: "",
        level: "",
        begin: "",
        end: "",
      }, //条件封装对象 可以不定义里面的东西
      loading: true,
    };
  },
  created() {
    //页面渲染之前调用methods里面的方法
    this.getList();
  },
  methods: {
    getList(current = 1) {
      this.current = current;
      this.loading = true;
      teacher
        .getTeacherPage(this.current, this.limit, this.teacherQuery)
        .then((resp) => {
          this.list = resp.data.rows;
          this.total = resp.data.total;
          this.loading = false;
          console.log(this.list);
          console.log(this.total);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    //清空表单
    resetData() {
      (this.teacherQuery = {}), this.getList();
    },
    //删除讲师的方法
    removeDataById(id) {
      this.$confirm("是否删除该讲师？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        teacher
          .removeTeacherById(id)
          .then((resp) => {
            if (resp.success === true) {
              this.getList()
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