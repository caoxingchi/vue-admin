<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-button type="text" @click="dialogFormVisible = true">添加章节</el-button>

    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text">添加课时</el-button>
            <el-button style="" type="text" @click="openUpdateDialog(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapterDialog(chapter.id)">删除</el-button>
          </span>
        </p>
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>

    <!-- 章节的添加 -->
    <el-dialog title="章节" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="chapter">
        <el-form-item label="章节名称" :label-width="formLabelWidth">
          <el-input v-model="chapter.title" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="chapter.sort"
            style="width: 50%"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="openChapterDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [], //章节小节视频
      courseId: "",
      dialogFormVisible: false, //弹框的显示效果
      formLabelWidth: "120px", //弹框的大小
      chapter: {
        title: "",
        sort: 0,
        courseId: "",
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },

  methods: {
    //添加或者更新数据
    openChapterDialog() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
    //处理关闭
    handleClose() {
      console.log("关闭弹框了");
      this.closeDialog();
    },
    //关闭弹框的时候
    closeDialog() {
      this.dialogFormVisible = false;
      this.resetData();
    },
    //添加章节
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapter
        .addChapter(this.chapter)
        .then((resp) => {
          if (resp.success === true) {
            //关闭弹框
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "添加章节成功",
            });
            this.getChapterVideo();
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "添加章节失败",
          });
        });
      this.closeDialog();
    },
    //打开更新章节的弹框
    openUpdateDialog(chapterId) {
      console.log("开始执行更新操作");
      chapter.getChapterInfo(chapterId).then((resp) => {
        this.chapter = resp.data.chapter;
      });
      this.dialogFormVisible = true;
    },
    //开始进行更新操作 更新章节
    updateChapter() {
      this.chapter.courseId = this.courseId;
      chapter
        .updateChapter(this.chapter)
        .then((resp) => {
          if (resp.success === true) {
            this.$message({
              type: "success",
              message: "修改章节成功",
            });
            this.getChapterVideo();
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "修改章节失败",
          });
        });
      this.closeDialog();
    },
    //删除章节
    deleteChapterDialog(chapterId) {
      this.$confirm("是否删除该章节", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          chapter.deleteChapter(chapterId).then((resp) => {
            if (resp.success === true) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getChapterVideo()
            }
          })
        })
        .catch(() => {
          console.log("取消删除");
        });
        
    },
    //重置表单
    resetData() {
      console.log("执行重置表单");
      this.chapter = {
        title: "",
        sort: 0,
      };
    },
    //获取所有的章节小节
    getChapterVideo() {
      chapter.getAllChapterVideoByCourseId(this.courseId).then((resp) => {
        this.chapterVideoList = resp.data.chapterVideos; //
        console.log("chapterVideo=" + this.chapterVideoList);
      });
    },
    previous() {
      console.log("previous");
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      console.log("next");
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
