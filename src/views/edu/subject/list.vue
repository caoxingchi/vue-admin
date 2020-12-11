<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行搜索课程"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree"
      :data="listTree"
      :props="defaultProps"
      highlight-current
      :filter-node-method="filterNode"
      class="filter-tree"
      show-checkbox
      check-strictly
      default-expand-all
    />
  </div>
</template>

<script>
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      listTree: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    this.listAllSubejctTree();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val.trim());
    },
  },

  methods: {
    listAllSubejctTree() {
      subject
        .listSubjectTree()
        .then((resp) => {
          if (resp.success === true) {
            this.listTree = resp.data.list;
            console.log("获取课程数据成功");
          }
        })
        .catch((err) => {
          console.log("获取课程数据失败");
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
  },
};
</script>
