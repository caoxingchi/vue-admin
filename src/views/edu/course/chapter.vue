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
            <el-button type="text" @click="openAddVideoDialog(chapter.id)"
              >添加课时</el-button
            >
            <el-button style="" type="text" @click="openUpdateDialog(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapterDialog(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <span class="acts">
                <el-button type="text" @click="openUpdateVideoDialog(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="deleteVideoDialog(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>

    <!-- 章节的添加 和 修改 dialog-->
    <el-dialog
      title="章节"
      :visible.sync="dialogFormVisible"
      :before-close="closeChapterDialog"
    >
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
        <el-button @click="closeChapterDialog">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加修改小节 dialog-->
    <el-dialog
      :visible.sync="dialogVideoVisible"
      title="添加课时"
      :before-close="closeVideoDialog"
    >
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label=true>免费</el-radio>
            <el-radio :label=false>默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeVideoDialog">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  /* ====================================数据====================================== */
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false, //保存小节按钮是否禁用
      chapterVideoList: [], //章节小节视频
      courseId: "",
      chapterId: "", //章节id
      dialogFormVisible: false, //章节弹框的显示效果
      dialogVideoVisible: false, //小节处理弹框显示效果
      formLabelWidth: "120px", //弹框的大小
      //章节对象
      chapter: {
        title: "",
        sort: 0,
        courseId: "",
      },
      video: {
        // 课时对象
        title: "",
        courseId:"",
        chapterId:"",
        sort: 0,
        free: true,
        videoSourceId: "",
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
    /* ==============================小节部分============================================= */
    //添加或修改小节
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo();
      } else {
        this.updateVideo();
      }
      this.closeVideoDialog();
      this.getChapterVideo();
    },
    //打开addvideo弹框
    openAddVideoDialog(chapterId) {
      console.log("打开video弹框");
      this.chapterId = chapterId;
      this.dialogVideoVisible = true;
    },
    //打开更新video
    openUpdateVideoDialog(videoId) {
      video.getVideoInfo(videoId).then((resp) => {
        if (resp.success === true) {
          this.video = resp.data.video;
        }
      });
      
      console.log("videoId=" + this.video.title+"chapterId="+ this.video.chapterId);
      console.log("free?" + this.video.free);
      this.dialogVideoVisible = true;
    },

    deleteVideoDialog(videoId) {
      console.log("打开删除video弹框");
      this.$confirm("是否删除该课时", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          video.deleteVideo(videoId).then((resp) => {
            if (resp.success === true) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getChapterVideo();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //添加小节
    addVideo() {
      console.log("添加小节操作");
      this.video.courseId = this.courseId;
      this.video.chapterId = this.chapterId;
      console.log(this.video);
      video
        .addVideo(this.video)
        .then((resp) => {
          if (resp.success === true) {
            this.$message({
              type: "success",
              message: "添加课时成功",
            });
            this.getChapterVideo();
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "添加课时失败",
          });
        });
    },
    //更新小节
    updateVideo(videoId) {
      console.log("修改小节操作");
      video
        .updateVideo(this.video)
        .then((resp) => {
          if (resp.success === true) {
            this.$message({
              type: "success",
              message: "修改课时成功",
            });
            this.getChapterVideo();
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "修改课时失败",
          });
        });
    },
    //关闭弹框 小节的处理 也进行了表单的重置
    closeVideoDialog() {
      this.dialogVideoVisible = false; //关闭video弹框
      console.log("执行重置表单++video");
      this.video = {
        // 课时对象
        title: "",
        sort: 0,
        free: true,
        videoSourceId: "",
      };
    },
    /* ==============================章节部分============================================= */
    //添加或者更新章节数据
    saveOrUpdateChapter() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
      this.closeChapterDialog();
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
              this.getChapterVideo();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },

    //关闭弹框的时候 章节的处理 并且进行表单的重置
    closeChapterDialog() {
      this.dialogFormVisible = false; //关闭章节弹框
      console.log("执行重置表单+++chapter");
      this.chapter = {
        title: "",
        sort: 0,
      };
    },
    /* =================================公共部分========================================= */

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
