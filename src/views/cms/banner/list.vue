<template>
  <div class="app-container">
    <!-- 查询 -->

    <!-- 添加banner -->
    <el-button type="success" @click="dialogFormVisible = true">添加banner</el-button>
    <!-- 表格 -->
    <el-table :data="bannerList" stripe fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          {{ (current - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="banner名称" width="250" />
      <el-table-column prop="imageUrl" label="图片路径" width="250">
        <template slot-scope="scope">
          <el-popover placement="bottom" :title="scope.row.title" trigger="click">
            <img :src="scope.row.imageUrl" alt="" style="width: 30%; height: 30%" />
            <img
              slot="reference"
              :src="scope.row.imageUrl"
              style="width: 100%; height: 100%"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="linkUrl" label="点击链接" width="190" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="updateBannerById(scope.row.id)"
            >编辑banner</el-button
          >
          <br />
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除banner</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="banner"
      :visible.sync="dialogFormVisible"
      :before-close="closeBannerDialog"
      :width="dialogWidth"
    >
      <el-form :model="crmBanner" class="demo-ruleForm" :rules="rules" ref="bannerForm">
        <el-form-item label="banner名称" prop="title" :label-width="formLabelWidth">
          <el-input v-model="crmBanner.title" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="banner排序" :label-width="formLabelWidth">
          <el-input-number
            v-model="crmBanner.sort"
            style="width: 50%"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="banner链接" :label-width="formLabelWidth">
          <el-input v-model="crmBanner.linkUrl" style="width: 50%"></el-input>
        </el-form-item>
        <!-- 上传图片 banner -->
        <el-form-item label="上传banner图片" :label-width="formLabelWidth">
          <el-upload
            :action="BASE_API + '/eduoss/fileoss/uploadFile/banner'"
            list-type="picture-card"
            :auto-upload="true"
            :drag="true"
            :limit="1"
            :file-list="imageList"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :before-remove="handleBeforeReomve"
            :on-remove="handleRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeBannerDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm('bannerForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="imageDialogVisible">
      <img width="60%" height="40%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <el-pagination
      :current-page="current"
      :page-size="limit"
      :page-sizes="[5, 10, 30, 40]"
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
import banner from "@/api/cms/banner";
export default {
  data() {
    return {
      bannerList: [],
      imageList: [], //
      image:{},//一个对象来存储地址 用于回显
      current: 1,
      limit: 5,
      total: 0, //总数
      // bannerId: "", //banner的id
      dialogFormVisible: false,
      dialogWidth: "60%", //弹框的大小
      formLabelWidth: "20%", //form表单中的控件的大小
      errorBox: "error",
      successBox: "success",
      crmBanner: {
        //banner实体类
        title: "",
        imageUrl: "",
        linkUrl: "",
        sort: 0,
      },
      rules: {
        title: [
          { required: true, message: "请输入banner的标题", trigger: "blur" },
          {
            require: true,
            min: 2,
            message: "至少输入2个字符",
            trigger: "blur",
          },
        ],
      },
      dialogImageUrl: "", //上传的图片的地址
      imageDialogVisible: false, //图片的预览的弹框的显示
      BASE_API: process.env.BASE_API,
    };
  },
  created() {
    this.pageBanners();
  },
  methods: {
    //分页管理
    pageBanners() {
      banner
        .pageBanner(this.current, this.limit)
        .then((resp) => {
          if (resp.success === true) {
            this.bannerList = resp.data.bannerList;
            this.total = resp.data.total;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "获取数据失败",
          });
        });
    },
    getByCurrent(current = 1) {
      this.current = current;
      this.pageBanners();
    },
    getBySize(limit = 5) {
      this.limit = limit;
      this.pageBanners();
    },
    //更新数据banner
    updateBannerById(bannerId) {
      this.dialogFormVisible = true;
      this.crmBanner.id = bannerId;
      banner
        .getBannerById(bannerId)
        .then((resp) => {
          if (resp.success === true) {
            this.crmBanner = resp.data.banner;
            //this.echoImage()
            this.echoImage()
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "获取数据失败--banner",
          });
        });
      
    },
    //保存修改 提交表单
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.crmBanner.id != null && this.crmBanner.id != "") {
            console.log("修改操作");
            
            banner
              .updateBanner(this.crmBanner)
              .then((resp) => {
                if (resp.success === true) {
                  this.messageBox(this.successBox, "修改成功");
                  this.pageBanners();
                }
              })
              .catch((err) => {
                this.messageBox(this.errorBox, "修改失败");
              });

            this.pageBanners(); //获取数据
          } else {
            console.log("添加操作");
            banner
              .addBanner(this.crmBanner)
              .then((resp) => {
                if (resp.success === true) {
                  this.messageBox(this.successBox, "添加成功");
                  this.pageBanners(); //获取数据
                }
              })
              .catch((err) => {
                this.messageBox(this.errorBox, "添加失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      this.dialogFormVisible = false;
      this.restData(); //重置数据
    },
    //移除banner  会用到远程调用方法 调用删除
    removeDataById(bannerId) {
      this.$confirm("是否删除该banner", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then((resp) => {
          banner
            .removeBanner(bannerId)
            .then((resp) => {
              if (resp.success === true) {
                this.messageBox(this.successBox, "删除成功");
                this.pageBanners();
              }
            })
            .catch((err) => {
              this.messageBox(this.errorBox, "删除失败");
            });
        })
        .catch((err) => {
          console.log("error");
        });
    },
    //关闭banner弹框
    closeBannerDialog() {
      this.dialogFormVisible = false;
      this.restData();
    },
    /* =======================处理图片上传=================================== */
    //处理预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imageDialogVisible = true;
    },
    //移除图片
    handleBeforeReomve(file) {
      return this.$confirm(`是否移除该图片${file.name}？`);
    },
    handleRemove() {
      if (this.crmBanner.ossFileName != null && this.crmBanner.ossFileName != "") {
        banner
          .removeOssFileFromAli(this.crmBanner.ossFileName)
          .then((resp) => {
            if (resp.success === true) {
              this.$message({
                type: "success",
                message: "移除成功",
              });
              this.crmBanner.ossFileName = "";
            }
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "移除失败",
            });
          });
      } else {
        console.log("没有数据");
      }
    },

    //上传成功后将数据返回  进行数据的赋值CrmBanner
    handleUploadSuccess(response, file, fileList) {
      if (response.success === true) {
        this.crmBanner.imageUrl = response.data.url;
        this.dialogImageUrl = response.data.url;
        this.crmBanner.ossFileName = response.data.fileName;
      }
    },
    //重置数据
    restData() {
      this.crmBanner = {};
      this.imageList=[]
      this.image={}
    },

    //弹框的封装
    messageBox(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },

    //回显图片
    echoImage() {
      this.imageList = [];
      this.image.url=this.crmBanner.imageUrl
      this.imageList.push(this.image);
    },
  },
};
</script>

<style></style>
